import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Recipe } from "@/models/Recipe";

// GET /api/recipes/random — returns 7 random recipes
export async function GET() {
  try {
    await connectDB();
    const recipes = await Recipe.aggregate([{ $sample: { size: 7 } }]);
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
