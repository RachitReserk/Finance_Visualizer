import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Transaction from "@/models/transactionModel";

export async function POST(req: NextRequest) {
  try {
    await connect();
    
    const { amount, date, description, category } = await req.json();

    if (!description || typeof description !== "string" || description.length > 25) {
      return NextResponse.json({ error: "Description is required." }, { status: 400 });
    }
    if (!amount || typeof amount !== "number") {
      return NextResponse.json({ error: "Amount is required and must be a number." }, { status: 400 });
    }
    if (amount > 10000000) {
      return NextResponse.json({ error: "Most probably you are joking." }, { status: 400 });
    }
    if (!date || isNaN(new Date(date).getTime())) {
      return NextResponse.json({ error: "Invalid date format." }, { status: 400 });
    }
    if (!category || !["Food", "Rent", "Shopping", "Entertainment", "Transport", "Other"].includes(category)) {
      return NextResponse.json({ error: "Invalid category." }, { status: 400 });
    }

    const transaction = new Transaction({ 
      amount, 
      date: new Date(date), 
      description, 
      category 
    });

    await transaction.save();

    return NextResponse.json({ success: true, transaction }, { status: 201 });

  } catch (error) {
    console.error("Error adding transaction:", error);
    return NextResponse.json({ error: "Server error, please try again later." }, { status: 500 });
  }
}
