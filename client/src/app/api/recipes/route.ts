import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Recipe } from "@/models/Recipe";
import { recipeSchema } from "@/lib/validations";
import { requireUserId } from "@/lib/session";

// GET /api/recipes
export async function GET() {
  const auth = await requireUserId();
  if (auth.error) return auth.error;
  try {
    await connectDB();
    const recipes = await Recipe.find({ userId: auth.userId }).sort({ createdAt: -1 });
    return NextResponse.json(recipes);
  } catch (err) {
    console.error("GET /api/recipes error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/recipes
export async function POST(req: NextRequest) {
  const auth = await requireUserId();
  if (auth.error) return auth.error;
  try {
    await connectDB();
    const body = await req.json();
    const parsed = recipeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const recipe = await Recipe.create({ ...parsed.data, userId: auth.userId });
    return NextResponse.json(recipe, { status: 201 });
  } catch (err) {
    console.error("POST /api/recipes error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
