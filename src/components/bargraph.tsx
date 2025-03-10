"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Transaction {
  amount: number;
  date: string;
  description: string;
  category: string;
}

interface ChartData {
  month: string;
  total: number;
}

const MonthlyExpensesChart = ({ transactions }: { transactions: Transaction[] }) => {
  const [data, setData] = useState<ChartData[]>([]);

  useEffect(() => {
    const processTransactions = () => {
      const now = new Date();
      const currentYear = now.getFullYear();
      const monthlyData: Record<string, number> = {};


      const months = Array.from({ length: 12 }, (_, i) =>
        new Date(currentYear, i).toLocaleString("default", { month: "short" })
      );

      months.forEach((month) => (monthlyData[month] = 0));

      transactions.forEach(({ amount, date }) => {
        const transactionDate = new Date(date);
        if (transactionDate.getFullYear() === currentYear) {
          const month = transactionDate.toLocaleString("default", { month: "short" });
          monthlyData[month] += amount;
        }
      });

      const chartData: ChartData[] = months.map((month) => ({
        month,
        total: monthlyData[month] || 0,
      }));

      setData(chartData);
    };

    processTransactions();
  }, [transactions]);

  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle>Monthly Expenses ({new Date().getFullYear()})</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default MonthlyExpensesChart;
