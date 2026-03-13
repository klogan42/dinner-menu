export interface Ingredient {
  name: string;
  amount: string;
  unit: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  tags: string[];
  ingredients: Ingredient[];
  steps: string[];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  isFavorite: boolean;
  createdAt: string;
}

export interface WeekPlan {
  [day: string]: string | null; // recipe ID or null
}

export const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export type DayOfWeek = (typeof DAYS)[number];
