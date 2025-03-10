import { Schema, Document, model, models } from "mongoose";

export interface ITransaction extends Document {
  amount: number;
  date: Date;
  description?: string;
  category: "Food" | "Rent" | "Shopping" | "Entertainment" | "Transport" | "Other"; 
}

const TransactionSchema = new Schema<ITransaction>(
  {
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    description: { type: String, required: true, trim: true },
    category: { 
      type: String, 
      required: true, 
      enum: ["Food", "Rent", "Shopping", "Entertainment", "Transport", "Other"],
      trim: true 
    },
  },
  { timestamps: true }
);

export default models.Transaction || model<ITransaction>("Transaction", TransactionSchema);
