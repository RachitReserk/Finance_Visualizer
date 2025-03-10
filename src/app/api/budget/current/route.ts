import { NextResponse, NextRequest } from "next/server";
import Budget from "@/models/categoryBudgetModel";
import { connect } from "@/dbConfig/dbConfig";

export async function GET(req: NextRequest) {
  try {
    await connect();
    
    const currentMonth = new Date().getMonth() + 1; 
    const currentYear = new Date().getFullYear();

    const budgets = await Budget.find({ month: currentMonth, year: currentYear });

    return NextResponse.json({ budgets }, { status: 200 });
  } catch (error) {
    console.error("Error fetching budget:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
