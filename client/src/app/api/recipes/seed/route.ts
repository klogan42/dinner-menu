import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Recipe } from "@/models/Recipe";
import { requireUserId } from "@/lib/session";

const STARTER_RECIPES = [
  { title: "Tacos", tags: ["quick"], prepTimeMinutes: 10, cookTimeMinutes: 15, servings: 4 },
  { title: "Spaghetti and Meatballs", tags: ["pasta"], prepTimeMinutes: 15, cookTimeMinutes: 30, servings: 4 },
  { title: "Grilled Chicken", tags: ["grill"], prepTimeMinutes: 10, cookTimeMinutes: 20, servings: 4 },
  { title: "Stir Fry", tags: ["quick"], prepTimeMinutes: 10, cookTimeMinutes: 15, servings: 4 },
  { title: "Pizza Night", tags: ["quick"], prepTimeMinutes: 5, cookTimeMinutes: 20, servings: 4 },
  { title: "Burgers", tags: ["grill"], prepTimeMinutes: 10, cookTimeMinutes: 15, servings: 4 },
];

// POST /api/recipes/seed — add starter recipes for new users
export async function POST() {
  const auth = await requireUserId();
  if (auth.error) return auth.error;

  try {
    await connectDB();

    // Only seed if user has 1 or fewer recipes (just the Eat Out recipe)
    const count = await Recipe.countDocuments({ userId: auth.userId });
    if (count > 1) {
      return NextResponse.json({ error: "You already have recipes" }, { status: 400 });
    }

    const docs = STARTER_RECIPES.map((r) => ({
      userId: auth.userId,
      description: "",
      ingredients: [],
      steps: [],
      isFavorite: false,
      isEatOut: false,
      ...r,
    }));

    await Recipe.insertMany(docs);
    return NextResponse.json({ added: docs.length });
  } catch (err) {
    console.error("POST /api/recipes/seed error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
