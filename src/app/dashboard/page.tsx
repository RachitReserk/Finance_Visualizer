"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CategoryPieChart from "@/components/pieChart";

interface Transaction {
  amount: number;
  date: string;
  description: string;
  category: string;
}

const Dashboard = () => {
  const [totalExpenseYear, setTotalExpenseYear] = useState<number>(0);
  const [totalExpenseMonth, setTotalExpenseMonth] = useState<number>(0);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [data, setData] = useState<Transaction[]>([]);
  const [start, setStart] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const yearRes = await axios.get<{ transactions: Transaction[] }>("/api/transaction/currentYearTransactions");
        const yearTransactions = yearRes.data.transactions;

        const yearTotal = yearTransactions.reduce((sum, tx) => sum + tx.amount, 0);
        setTotalExpenseYear(yearTotal);

        const recent = yearTransactions
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 5);
        setRecentTransactions(recent);

        const monthRes = await axios.get<{ transactions: Transaction[] }>("/api/transaction/currentMonthTransactions");
        const monthTransactions = monthRes.data.transactions;
        setData(monthTransactions);

        const monthTotal = monthTransactions.reduce((sum, tx) => sum + tx.amount, 0);
        setTotalExpenseMonth(monthTotal);

        setStart(true);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchData();
  }, []);

  if (!start) {
    return (
      <div className="min-h-screen mt-16 flex items-center justify-center">
        <div className="w-6 h-6 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
      <Card className="p-4 col-span-1 md:col-span-3">
        <CardHeader>
          <CardTitle>Total Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xl font-bold">This Year: ₹{totalExpenseYear}</p>
          <p className="text-lg text-gray-600">This Month: ₹{totalExpenseMonth}</p>
        </CardContent>
      </Card>

      <CategoryPieChart date={new Date().toLocaleString("default", { month: "long" })} transactions={data} />

      <Card className="p-4 md:col-span-2">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent >
          <ul className="space-y-2">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((tx, i) => (
                <li key={i} className="flex justify-between border-b py-2">
                  <span>{tx.description}</span>
                  <span className="font-semibold">₹{tx.amount}</span>
                </li>
              ))
            ) : (
              <p className="text-center py-4">No transactions found.</p>
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
