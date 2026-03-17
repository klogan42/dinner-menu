import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Recipe } from "@/models/Recipe";
import { requireUserId } from "@/lib/session";

// GET /api/recipes/random — returns 7 random recipes
export async function GET() {
  const auth = await requireUserId();
  if (auth.error) return auth.error;
  try {
    await connectDB();
    const recipes = await Recipe.aggregate([
      { $match: { userId: auth.userId } },
      { $sample: { size: 7 } },
    ]);
    // aggregate doesn't apply toJSON transform, so fix the shape
    const formatted = recipes.map((r) => ({
      ...r,
      id: r._id.toString(),
      _id: undefined,
      __v: undefined,
    }));
    return NextResponse.json(formatted);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
