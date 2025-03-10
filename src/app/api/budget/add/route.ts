import { NextResponse, NextRequest } from "next/server";
import Budget from "@/models/categoryBudgetModel";
import { connect } from "@/dbConfig/dbConfig";

const validCategories = new Set(["Food", "Rent", "Shopping", "Entertainment", "Transport", "Other"]);

export async function POST(req: NextRequest) {
  try {
    await connect();
    
    const body = await req.json();
    const { category, budget, month, year } = body;
  
    if (!category || budget === null || budget === undefined || !month || !year) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }
    

    if (
      typeof category !== "string" ||
      typeof budget !== "number" ||
      typeof month !== "number" ||
      typeof year !== "number"
    ) {
      return NextResponse.json({ error: "Invalid data types" }, { status: 400 });
    }

    if (budget > 10000000) {
          return NextResponse.json({ error: "Most probably you are joking." }, { status: 400 });
        }

    if (!validCategories.has(category)) {
      return NextResponse.json({ error: "Invalid category." }, { status: 400 });
    }

    if (month < 1 || month > 12) {
      return NextResponse.json({ error: "Month must be between 1 and 12." }, { status: 400 });
    }

    if (year < 0) {
      return NextResponse.json({ error: "Invalid year." }, { status: 400 });
    }

    const existingBudget = await Budget.findOne({ category, month, year });

    if (existingBudget) {
      existingBudget.budget = budget;
      await existingBudget.save();
      return NextResponse.json(
        { message: "Budget updated successfully", budget: existingBudget },
        { status: 200 }
      );
    } else {
      const newBudget = new Budget({ category, budget, month, year });
      await newBudget.save();
      return NextResponse.json(
        { message: "Budget added successfully", budget: newBudget },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Error adding/updating budget:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
