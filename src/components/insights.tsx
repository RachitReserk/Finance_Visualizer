"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const categories = ["Food", "Rent", "Shopping", "Entertainment", "Transport", "Other"];

export default function SpendingInsights(props:any) {
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [savings, setSavings] = useState(0);
  const [topCategory, setTopCategory] = useState<string | null>(null);
  const [overBudgetCategories, setOverBudgetCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [budgetRes, expensesRes] = await Promise.all([
          axios.get("/api/budget/current"),
          axios.get("/api/transaction/currentMonthTransactions"),
        ]);

        const budgetData = budgetRes.data.budgets;
        const expensesData = expensesRes.data.transactions;

        let budgetMap: Record<string, number> = Object.fromEntries(categories.map((cat) => [cat, 0]));
        let expensesMap: Record<string, number> = Object.fromEntries(categories.map((cat) => [cat, 0]));

        budgetData.forEach(({ category, budget }: { category: string; budget: number }) => {
          budgetMap[category] = budget;
        });

        expensesData.forEach(({ category, amount }: { category: string; amount: number }) => {
          expensesMap[category] = amount;
        });

        const totalBudgetValue = Object.values(budgetMap).reduce((sum, val) => sum + val, 0);
        const totalSpentValue = Object.values(expensesMap).reduce((sum, val) => sum + val, 0);
        const savingsValue = totalBudgetValue - totalSpentValue;

        let highestSpendingCategory = Object.entries(expensesMap).reduce(
          (max, curr) => (curr[1] > max[1] ? curr : max),
          ["None", 0]
        )[0];

        let overBudget = categories.filter((cat) => expensesMap[cat] > budgetMap[cat]);

        setTotalBudget(totalBudgetValue);
        setTotalSpent(totalSpentValue);
        setSavings(savingsValue);
        setTopCategory(highestSpendingCategory);
        setOverBudgetCategories(overBudget);
      } catch (error) {
        console.error("Error fetching insights:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [props]);

  return (
    <Card className="mt-6 p-6 shadow-md border bg-white">
      <CardHeader>
        <CardTitle className="text-2xl md:font-bold">Spending Insights</CardTitle>
      </CardHeader>
      <CardContent className="min-h-[300px]">
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <div className="space-y-4">
            <p><strong>Total Budget:</strong> ₹{totalBudget}</p>
            <p><strong>Total Spent:</strong> ₹{totalSpent}</p>
            <p><strong>Savings:</strong> ₹{savings} {savings < 0 && <span className="text-red-500">(Over Budget)</span>}</p>
            <p><strong>Top Spending Category:</strong> {topCategory}</p>
            {overBudgetCategories.length > 0 ? (
              <p className="text-red-500"><strong>Over Budget:</strong> {overBudgetCategories.join(", ")}</p>
            ) : (
              <p className="text-green-500"><strong>All categories within budget.</strong></p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
