import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Recipe } from "@/models/Recipe";

// PATCH /api/recipes/[id]/favorite — toggle isFavorite
export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const recipe = await Recipe.findById(id);
    if (!recipe) return NextResponse.json({ error: "Not found" }, { status: 404 });
    recipe.isFavorite = !recipe.isFavorite;
    await recipe.save();
    return NextResponse.json(recipe);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
