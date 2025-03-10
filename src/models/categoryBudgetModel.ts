import mongoose, { Schema, Document, models } from "mongoose";

export interface IBudget extends Document {
  category: "Food" | "Rent" | "Shopping" | "Entertainment" | "Transport" | "Other";
  budget: number;
  month: number;
  year: number;
}

const BudgetSchema = new Schema<IBudget>({
  category: {
    type: String,
    enum: ["Food", "Rent", "Shopping", "Entertainment", "Transport", "Other"],
    required: true,
  },
  budget: { type: Number, required: true },
  month: { type: Number, min: 1, max: 12, required: true },
  year: { type: Number, required: true },
}, { timestamps: true });

const Budget = models.Budget || mongoose.model<IBudget>("Budget", BudgetSchema);

export default Budget;
