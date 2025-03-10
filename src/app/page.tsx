"use client";
import Bargraph from '@/components/bargraph'
import { useState , useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import TransactionList from '@/components/listTransaction';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PieChart from '@/components/pieChart'


interface FormData {
  amount: number;
  date: string;
  description: string;
  category: string;
}

interface Transaction {
  amount: number;
  date: string;
  description: string;
  category: string;
}

const page = () => {
  const { register, handleSubmit, reset, setValue } = useForm<FormData>();
  const [loading, setLoading] = useState(false);
  const [start,setStart] = useState(false)
  const [refresh, setRefresh] = useState(0);
  const [data, setData] = useState<Transaction[]>([]);
  const [forceRender,setForceRender] = useState(0)

  useEffect(()=>{
      const fetchTransactions = async () => {
        try {
          const response = await axios.get("/api/transaction/currentYearTransactions");
          setData(response.data.transactions)
          setStart(true)
        } catch (error) {
          console.log(error)
        }
      }
      fetchTransactions()
  },[refresh])

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      await axios.post("/api/transaction/add", data);
      toast.success("Transaction added successfully!");
      setRefresh(prev => prev + 1);
      reset();
      setForceRender(prev=>prev+1)
    } catch (error) {
      toast.error("Failed to add transaction");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if(start)
  return (
    <div className='w-full min-h-screen'>
      <div className='flex mt-8 flex-col md:flex-row w-full items-center justify-center'>
        <span className='md:w-[50%] mt-16'><Bargraph transactions={data}/></span>
        <span className='md:w-[50%] mt-16'><PieChart date={String(new Date().getFullYear())} transactions={data}/></span>
      </div>
      <TransactionList update={setRefresh}/>
      <Card className="p-4 mx-4 mb-4">
        <CardHeader>
          <CardTitle>Add Transaction</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                min={0}
                max={10000000}
                className='mt-3'
                placeholder="Enter amount"
                {...register("amount", { required: true, valueAsNumber: true })}
              />
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input className='mt-3' id="date" type="date" {...register("date", { required: true })} />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input className='mt-3' id="description" placeholder="Enter description" maxLength={25} {...register("description", { required: true })} />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select key={forceRender} onValueChange={(value) => setValue("category", value)}>
                <SelectTrigger className="mt-3">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Food">Food</SelectItem>
                  <SelectItem value="Transport">Transport</SelectItem>
                  <SelectItem value="Entertainment">Entertainment</SelectItem>
                  <SelectItem value="Shopping">Shopping</SelectItem>
                  <SelectItem value="Rent">Rent</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? <div className="w-6 h-6 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div> : "Add Transaction"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
  else
    return(
      <div className="min-h-screen mt-16 flex items-center justify-center">
        <div className="w-6 h-6 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    )
};

export default page;
