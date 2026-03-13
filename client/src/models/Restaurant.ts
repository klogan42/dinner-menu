import mongoose, { Schema, Document } from "mongoose";

export interface IRestaurant extends Document {
  name: string;
  cuisine: string;
  rating: number;
  notes: string;
  isFavorite: boolean;
  createdAt: Date;
}

const RestaurantSchema = new Schema<IRestaurant>(
  {
    name: { type: String, required: true },
    cuisine: { type: String, default: "" },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    notes: { type: String, default: "" },
    isFavorite: { type: Boolean, default: false },
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

export const Restaurant =
  mongoose.models.Restaurant || mongoose.model<IRestaurant>("Restaurant", RestaurantSchema);
