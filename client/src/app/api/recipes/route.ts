import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Recipe } from "@/models/Recipe";
import { recipeSchema } from "@/lib/validations";

// GET /api/recipes
export async function GET() {
  try {
    await connectDB();
    const recipes = await Recipe.find().sort({ createdAt: -1 });
    return NextResponse.json(recipes);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/recipes
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const parsed = recipeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const recipe = await Recipe.create(parsed.data);
    return NextResponse.json(recipe, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
