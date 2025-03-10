"use client";
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { useMediaQuery } from "react-responsive";

const COLORS = ["#4F46E5", "#16A34A", "#EAB308", "#DC2626", "#DB2777", "#0EA5E9"];

interface Transaction {
  amount: number;
  date: string;
  description: string;
  category: string;
}

interface ChartData {
  name: string;
  value: number;
  actualValue: number;
}

const CategoryPieChart = ({ transactions , date }: { transactions: Transaction[] , date:string}) => {
  const [data, setData] = useState<ChartData[]>([]);
  const isMobile = useMediaQuery({ maxWidth: 640 });

  useEffect(() => {
    if (!transactions || transactions.length === 0) {
      setData([]);
      return;
    }

    const categoryMap: Record<string, number> = {};

    transactions.forEach(({ category, amount }) => {
      categoryMap[category] = (categoryMap[category] || 0) + amount;
    });

    const maxValue = Math.max(...Object.values(categoryMap));
    const normalizedData: ChartData[] = Object.entries(categoryMap).map(([name, value]) => ({
      name,
      actualValue: value,
      value: Math.max(Math.log(value + 1) / Math.log(maxValue + 1), 0.05),
    }));

    setData(normalizedData);
  }, [transactions]);

  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle>Category-wise Expenses ({date})</CardTitle>
      </CardHeader>
      <CardContent className="min-h-[300px]">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={isMobile?50:80}
                fill="#8884d8"
                label={isMobile?undefined:({ name, actualValue }) => `${name}: ₹${actualValue}`}
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name, props) => `₹${props.payload.actualValue}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center py-4">No transactions found this year.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryPieChart;
