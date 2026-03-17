import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Recipe } from "@/models/Recipe";
import { requireUserId } from "@/lib/session";

// PATCH /api/recipes/[id]/favorite — toggle isFavorite
export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireUserId();
  if (auth.error) return auth.error;
  try {
    await connectDB();
    const { id } = await params;
    const recipe = await Recipe.findOne({ _id: id, userId: auth.userId });
    if (!recipe) return NextResponse.json({ error: "Not found" }, { status: 404 });
    recipe.isFavorite = !recipe.isFavorite;
    await recipe.save();
    return NextResponse.json(recipe);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
