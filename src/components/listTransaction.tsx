"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Loader2, Trash2, Pencil } from "lucide-react";
import axios from "axios";

interface Transaction {
  _id: string;
  amount: number;
  date: string;
  description: string;
  category: "Food" | "Rent" | "Shopping" | "Entertainment" | "Transport" | "Other";
}

export default function TransactionModal(props: any) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    const fetchTransactions = async () => {
      try {
        const response = await axios.get("/api/transaction/allTransactions");
        setTransactions(response.data.transactions)
      } catch (error) {
        console.log(error)
      }
    }
    fetchTransactions()
},[props])

  const deleteTransaction = async (id: string) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;

    try {
      setDeleting(id);
      await axios.delete(`/api/transaction/delete`, {
        data: { id },
      });
      setTransactions((prev) => prev.filter((tx) => tx._id !== id));
      props.update((prev: number) => prev + 1);
    } catch (error) {
      console.error("Error deleting transaction:", error);
    } finally {
      setDeleting(null);
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTx(transaction);
    setIsEditing(true);
  };

  const updateTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTx) return;

    try {
      setLoading(true);
      await axios.put(`/api/transaction/edit`, {
        id: editingTx._id,
        amount: editingTx.amount,
        date: editingTx.date,
        description: editingTx.description,
        category: editingTx.category,
      });

      setTransactions((prev) =>
        prev.map((tx) => (tx._id === editingTx._id ? editingTx : tx))
      );

      props.update((prev: number) => prev + 1);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating transaction:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center my-6">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="default">View Transactions</Button>
        </DialogTrigger>
        <DialogContent className="md:w-auto w-[340px] max-h-[500px] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Transaction List</DialogTitle>
          </DialogHeader>

          {loading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : transactions.length === 0 ? (
            <p className="text-center py-4">No transactions found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx._id}>
                    <TableCell>{new Date(tx.date).toLocaleDateString()}</TableCell>
                    <TableCell>₹{tx.amount}</TableCell>
                    <TableCell>{tx.description}</TableCell>
                    <TableCell>{tx.category}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(tx)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => deleteTransaction(tx._id)}
                        disabled={deleting === tx._id}
                      >
                        {deleting === tx._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
          </DialogHeader>
          {editingTx && (
            <form onSubmit={updateTransaction} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Amount</label>
                <Input
                  type="number"
                  value={editingTx.amount}
                  onChange={(e) =>
                    setEditingTx((prev) => prev && { ...prev, amount: Number(e.target.value) })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Date</label>
                <Input
                  type="date"
                  value={editingTx.date.split("T")[0]}
                  onChange={(e) =>
                    setEditingTx((prev) => prev && { ...prev, date: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Description</label>
                <Input
                  type="text"
                  value={editingTx.description}
                  onChange={(e) =>
                    setEditingTx((prev) => prev && { ...prev, description: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Category</label>
                <select
                  className="w-full border rounded-md p-2"
                  value={editingTx.category}
                  onChange={(e) =>
                    setEditingTx((prev) => prev && { ...prev, category: e.target.value as Transaction["category"] })
                  }
                  required
                >
                  <option value="Food">Food</option>
                  <option value="Rent">Rent</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Transport">Transport</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
