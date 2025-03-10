import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Transaction from "@/models/transactionModel";

export async function GET() {
  try {
    await connect();

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const transactions = await Transaction.find({
      date: { $gte: startOfMonth, $lte: endOfMonth }
    }).sort({ date: -1 });

    return NextResponse.json({ success: true, transactions }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error fetching transactions" },
      { status: 500 }
    );
  }
}
