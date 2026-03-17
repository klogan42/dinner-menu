import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { MealHistory } from "@/models/MealHistory";
import { requireUserId } from "@/lib/session";

// GET /api/recipes/cooked — returns { [recipeId]: string[] } (dates cooked, newest first)
export async function GET() {
  const auth = await requireUserId();
  if (auth.error) return auth.error;
  try {
    await connectDB();
    const entries = await MealHistory.find({
      recipeId: { $exists: true },
      userId: auth.userId,
    })
      .sort({ date: -1 })
      .lean();

    const result: Record<string, string[]> = {};
    for (const e of entries) {
      if (!e.recipeId) continue;
      if (!result[e.recipeId]) result[e.recipeId] = [];
      result[e.recipeId].push(e.date);
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
