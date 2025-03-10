import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Transaction from "@/models/transactionModel";

export async function GET() {
  try {
    await connect();

    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59);

    const transactions = await Transaction.find({
      date: { $gte: startOfYear, $lte: endOfYear }
    }).sort({ date: -1 });

    return NextResponse.json({ success: true, transactions }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error fetching transactions" },
      { status: 500 }
    );
  }
}
