// expectation vs reality
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

const categories = ["Food", "Rent", "Shopping", "Entertainment", "Transport", "Other"];

export default function BudgetVsActualChart(props:any) {
  const [chartData, setChartData] = useState<{ category: string; budget: number; actual: number }[]>([]);
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

        const dataMap: Record<string, { budget: number; actual: number }> = Object.fromEntries(
          categories.map((cat) => [cat, { budget: 0, actual: 0 }])
        );

        budgetData.forEach(({ category, budget }: { category: string; budget: number }) => {
          dataMap[category].budget = budget;
        });

        expensesData.forEach(({ category, amount }: { category: string; amount: number }) => {
          dataMap[category].actual = amount;
        });

        setChartData(
          categories.map((category) => ({
            category,
            budget: dataMap[category].budget,
            actual: dataMap[category].actual,
          }))
        );
      } catch (error) {
        console.error("Error fetching budget/expenses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [props]);

  return (
    <Card className="w-full mt-6 shadow-md border bg-white">
      <CardHeader>
        <CardTitle className="text-2xl md:font-bold text-center">Budget vs Actual Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="min-h-[180px] mt-16 flex items-center justify-center">
          <div className="w-6 h-6 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="budget" fill="#4F46E5" name="Budget" />
              <Bar dataKey="actual" fill="#F43F5E" name="Actual Expenses" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
