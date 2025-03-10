import { NextRequest, NextResponse } from "next/server";
import {connect} from "@/dbConfig/dbConfig";
import Transaction from "@/models/transactionModel";

export async function DELETE(req: NextRequest) {
  try {
    await connect();

    const { id: transactionId } = await req.json();
    if (!transactionId) {
      return NextResponse.json({ error: "Transaction ID is required." }, { status: 400 });
    }

    const deletedTransaction = await Transaction.findByIdAndDelete(transactionId);

    if (!deletedTransaction) {
      return NextResponse.json({ error: "Transaction not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Transaction deleted." }, { status: 200 });

  } catch (error) {
    console.error("Error deleting transaction:", error);
    return NextResponse.json({ error: "Server error, please try again later." }, { status: 500 });
  }
}
