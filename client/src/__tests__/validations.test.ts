import { describe, it, expect } from "vitest";
import {
  recipeSchema,
  restaurantSchema,
  mealHistoryUpdateSchema,
  dateParamSchema,
  mealHistoryQuerySchema,
} from "@/lib/validations";

describe("dateParamSchema", () => {
  it("accepts valid YYYY-MM-DD", () => {
    expect(dateParamSchema.safeParse("2026-03-19").success).toBe(true);
  });

  it("rejects invalid formats", () => {
    expect(dateParamSchema.safeParse("2026-3-19").success).toBe(false);
    expect(dateParamSchema.safeParse("03-19-2026").success).toBe(false);
    expect(dateParamSchema.safeParse("not-a-date").success).toBe(false);
    expect(dateParamSchema.safeParse("").success).toBe(false);
  });
});

describe("mealHistoryQuerySchema", () => {
  it("accepts valid year and month", () => {
    const result = mealHistoryQuerySchema.safeParse({ year: "2026", month: "3" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.year).toBe(2026);
      expect(result.data.month).toBe(3);
    }
  });

  it("coerces string numbers", () => {
    const result = mealHistoryQuerySchema.safeParse({ year: "2026", month: "12" });
    expect(result.success).toBe(true);
  });

  it("rejects month > 12", () => {
    expect(mealHistoryQuerySchema.safeParse({ year: "2026", month: "13" }).success).toBe(false);
  });

  it("rejects month < 1", () => {
    expect(mealHistoryQuerySchema.safeParse({ year: "2026", month: "0" }).success).toBe(false);
  });
});

describe("mealHistoryUpdateSchema", () => {
  it("accepts recipeId with null", () => {
    const result = mealHistoryUpdateSchema.safeParse({ recipeId: null });
    expect(result.success).toBe(true);
  });

  it("accepts recipeId with string", () => {
    const result = mealHistoryUpdateSchema.safeParse({ recipeId: "abc123" });
    expect(result.success).toBe(true);
  });

  it("accepts optional restaurantId", () => {
    const result = mealHistoryUpdateSchema.safeParse({ recipeId: "abc", restaurantId: "rest1" });
    expect(result.success).toBe(true);
  });

  it("accepts optional leftoversOfId", () => {
    const result = mealHistoryUpdateSchema.safeParse({ recipeId: "abc", leftoversOfId: "orig1" });
    expect(result.success).toBe(true);
  });

  it("rejects empty recipeId string", () => {
    expect(mealHistoryUpdateSchema.safeParse({ recipeId: "" }).success).toBe(false);
  });

  it("rejects missing recipeId", () => {
    expect(mealHistoryUpdateSchema.safeParse({}).success).toBe(false);
  });
});

describe("recipeSchema", () => {
  it("accepts minimal recipe", () => {
    const result = recipeSchema.safeParse({ title: "Tacos" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBe("Tacos");
      expect(result.data.servings).toBe(4); // default
      expect(result.data.tags).toEqual([]); // default
    }
  });

  it("rejects empty title", () => {
    expect(recipeSchema.safeParse({ title: "" }).success).toBe(false);
  });

  it("rejects title over 255 chars", () => {
    expect(recipeSchema.safeParse({ title: "a".repeat(256) }).success).toBe(false);
  });

  it("accepts full recipe", () => {
    const result = recipeSchema.safeParse({
      title: "Spaghetti",
      description: "Classic pasta",
      tags: ["pasta", "quick"],
      ingredients: [{ name: "Pasta", amount: "1", unit: "lb" }],
      steps: ["Boil water", "Cook pasta"],
      prepTimeMinutes: 5,
      cookTimeMinutes: 15,
      servings: 4,
      isFavorite: true,
    });
    expect(result.success).toBe(true);
  });

  it("rejects negative prep time", () => {
    expect(recipeSchema.safeParse({ title: "Test", prepTimeMinutes: -1 }).success).toBe(false);
  });
});

describe("restaurantSchema", () => {
  it("accepts minimal restaurant", () => {
    const result = restaurantSchema.safeParse({ name: "Pizza Place" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.rating).toBe(0); // default
    }
  });

  it("rejects empty name", () => {
    expect(restaurantSchema.safeParse({ name: "" }).success).toBe(false);
  });

  it("rejects rating > 5", () => {
    expect(restaurantSchema.safeParse({ name: "Test", rating: 6 }).success).toBe(false);
  });

  it("rejects rating < 0", () => {
    expect(restaurantSchema.safeParse({ name: "Test", rating: -1 }).success).toBe(false);
  });
});
