"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from "axios";
import BudgetCard from "@/components/currentMonthBudget";
import BudgetVsActualChart from "@/components/budgetVSactual";
import SpendingInsights from "@/components/insights";

const categories = ["Food", "Rent", "Shopping", "Entertainment", "Transport", "Other"];

export default function BudgetPage() {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const [budget, setBudget] = useState({
    category: "",
    amount: "",
    month: String(currentMonth),
    year: String(currentYear),
  });

  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBudget((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCategoryChange = (value: string) => {
    setBudget((prev) => ({ ...prev, category: value }));
  };

  const submitBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!budget.category || !budget.amount || !budget.month || !budget.year)
      return alert("All fields are required");

    try {
      setLoading(true);
      await axios.post("/api/budget/add", {
        category: budget.category,
        budget: Number(budget.amount),
        month: Number(budget.month),
        year: Number(budget.year),
      });
      alert("Budget saved successfully!");
      setBudget({
        category: "",
        amount: "",
        month: String(currentMonth),
        year: String(currentYear),
      });
      setRefresh((prev) => prev + 1);
    } catch (error) {
      console.error("Error saving budget:", error);
      alert("Failed to save budget.");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="mt-16 min-w-screen min-h-screen">
   <div className="mx-auto flex flex-col md:flex-row items-center justify-center gap-16 w-full">
    <div className="max-w-md mt-6 p-6 border rounded-lg shadow-md bg-white">
      <h2 className="text-2xl font-bold mb-4">Set Monthly Budget</h2>
      <form onSubmit={submitBudget} className="space-y-4">
        <div>
          <Label className="mb-2">Category</Label>
          <Select key={refresh} onValueChange={handleCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-2">Budget Amount</Label>
          <Input  min={0} max={10000000} type="number" name="amount" value={budget.amount} onChange={handleChange} required />
        </div>

        <div>
          <Label className="mb-2">Month</Label>
          <Input
            type="number"
            name="month"
            value={budget.month}
            onChange={handleChange}
            min="1"
            max="12"
            required
          />
        </div>

        <div>
          <Label className="mb-2">Year</Label>
          <Input
            type="number"
            name="year"
            value={budget.year}
            onChange={handleChange}
            min="2000"
            max="2100"
            required
          />
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Saving..." : "Save Budget"}
        </Button>
      </form>
    </div>
  <BudgetCard refresh={refresh}/>
  <SpendingInsights refresh={refresh}/>
   </div>
   <BudgetVsActualChart refresh={refresh}/>
  </div>
  );
}
