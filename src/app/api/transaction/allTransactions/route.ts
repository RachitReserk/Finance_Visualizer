import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Transaction from "@/models/transactionModel";

export async function GET() {
  try {
    await connect();
    const transactions = await Transaction.find().sort({ date: -1 });

    return NextResponse.json({ success: true, transactions }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error fetching transactions" },
      { status: 500 }
    );
  }
}
