import mongoose, { Schema, Document } from "mongoose";

export interface IMealHistory extends Document {
  date: string; // YYYY-MM-DD
  recipeId: string;
}

const MealHistorySchema = new Schema<IMealHistory>(
  {
    date: { type: String, required: true, unique: true },
    recipeId: { type: String, required: true },
  },
  {
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

export const MealHistory =
  mongoose.models.MealHistory ||
  mongoose.model<IMealHistory>("MealHistory", MealHistorySchema);
