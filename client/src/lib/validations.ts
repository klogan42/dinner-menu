import { z } from "zod";

export const ingredientSchema = z.object({
  name: z.string().min(1).max(200),
  amount: z.string().max(50).default(""),
  unit: z.string().max(50).default(""),
});

export const recipeSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(2000).default(""),
  tags: z.array(z.string().max(50)).max(20).default([]),
  ingredients: z.array(ingredientSchema).max(100).default([]),
  steps: z.array(z.string().max(2000)).max(50).default([]),
  prepTimeMinutes: z.number().int().nonnegative().max(10000).default(0),
  cookTimeMinutes: z.number().int().nonnegative().max(10000).default(0),
  servings: z.number().int().positive().max(100).default(4),
  isFavorite: z.boolean().default(false),
});

export const mealHistoryUpdateSchema = z.object({
  recipeId: z.string().min(1).max(100).nullable(),
  restaurantId: z.string().min(1).max(100).nullable().optional(),
  leftoversOfId: z.string().min(1).max(100).nullable().optional(),
});

export const restaurantSchema = z.object({
  name: z.string().min(1).max(255),
  cuisine: z.string().max(100).default(""),
  rating: z.number().min(0).max(5).default(0),
  notes: z.string().max(2000).default(""),
  isFavorite: z.boolean().default(false),
});

export const dateParamSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD");

export const mealHistoryQuerySchema = z.object({
  year: z.coerce.number().int().min(1900).max(2100),
  month: z.coerce.number().int().min(1).max(12),
});
