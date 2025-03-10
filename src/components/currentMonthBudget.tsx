"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


interface Budget {
  category: string;
  budget: number;
}

const categories = ["Food", "Rent", "Shopping", "Entertainment", "Transport", "Other"];

const getCurrentMonthYear = () => {
  const date = new Date();
  const month = date.toLocaleString("default", { month: "long" }); 
  const year = date.getFullYear();
  return { month, year };
};

export default function BudgetTable({ refresh }: { refresh: number }) {
  const [budgetData, setBudgetData] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const { month, year } = getCurrentMonthYear(); 

  useEffect(() => {
    const fetchBudget = async () => {
      try {
        const res = await axios.get("/api/budget/current");
        const fetchedData: Budget[] = res.data.budgets;

        const budgetMap: Record<string, number> = Object.fromEntries(
          categories.map((cat) => [cat, 0])
        );

        fetchedData.forEach(({ category, budget }) => {
          budgetMap[category] = budget;
        });

        setBudgetData(budgetMap);
      } catch (error) {
        console.error("Error fetching budget:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBudget();
  }, [refresh]);

  return (
    <Card className="min-w-[300px] mt-6 shadow-md border bg-white">
      <CardHeader>
        <CardTitle className="text-2xl md:font-bold">
          {loading ? "Loading..." : `Budget for ${month} ${year}`}
        </CardTitle>
      </CardHeader>
      <CardContent className="min-h-[300px]">
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Budget (₹)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category}>
                  <TableCell>{category}</TableCell>
                  <TableCell className="text-right">₹{budgetData[category]}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
