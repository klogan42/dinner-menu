import mongoose, { Schema, Document } from "mongoose";

export interface IIngredient {
  name: string;
  amount: string;
  unit: string;
}

export interface IRecipe extends Document {
  userId: string;
  title: string;
  description: string;
  tags: string[];
  ingredients: IIngredient[];
  steps: string[];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  isFavorite: boolean;
  isEatOut: boolean;
  createdAt: Date;
}

const IngredientSchema = new Schema<IIngredient>(
  {
    name: { type: String, required: true },
    amount: { type: String, default: "" },
    unit: { type: String, default: "" },
  },
  { _id: false }
);

const RecipeSchema = new Schema<IRecipe>(
  {
    userId: { type: String, default: null, index: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    tags: { type: [String], default: [] },
    ingredients: { type: [IngredientSchema], default: [] },
    steps: { type: [String], default: [] },
    prepTimeMinutes: { type: Number, default: 0 },
    cookTimeMinutes: { type: Number, default: 0 },
    servings: { type: Number, default: 4 },
    isFavorite: { type: Boolean, default: false },
    isEatOut: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  {
    toJSON: {
      virtuals: true,
      transform(_doc, ret: Record<string, unknown>) {
        ret.id = String(ret._id);
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

export const Recipe =
  mongoose.models.Recipe || mongoose.model<IRecipe>("Recipe", RecipeSchema);
