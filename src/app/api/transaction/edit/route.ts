import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Transaction from "@/models/transactionModel";

export async function PUT(req: NextRequest) {
  try {
    await connect();

    const { id , amount, date, description, category } = await req.json();
    
    if (!id) {
      return NextResponse.json({ error: "Something important seems missing." }, { status: 400 });
    }
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

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      id,
      { amount, date, description, category },
      { new: true }
    );

    if (!updatedTransaction) {
      return NextResponse.json({ error: "Transaction not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Transaction updated.", transaction: updatedTransaction }, { status: 200 });

  } catch (error) {
    console.error("Error updating transaction:", error);
    return NextResponse.json({ error: "Server error, please try again later." }, { status: 500 });
  }
}
