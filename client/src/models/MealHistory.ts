import mongoose, { Schema, Document } from "mongoose";

export interface IMealHistory extends Document {
  userId: string;
  date: string; // YYYY-MM-DD
  recipeId: string;
  restaurantId?: string;
  leftoversOfId?: string;
}

const MealHistorySchema = new Schema<IMealHistory>(
  {
    userId: { type: String, default: null, index: true },
    date: { type: String, required: true },
    recipeId: { type: String, required: true },
    restaurantId: { type: String, default: null },
    leftoversOfId: { type: String, default: null },
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

// Compound unique index: one entry per date per user
MealHistorySchema.index({ date: 1, userId: 1 }, { unique: true });

export const MealHistory =
  mongoose.models.MealHistory ||
  mongoose.model<IMealHistory>("MealHistory", MealHistorySchema);
