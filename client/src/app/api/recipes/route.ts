import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Recipe } from "@/models/Recipe";

// GET /api/recipes
export async function GET() {
  try {
    await connectDB();
    const recipes = await Recipe.find().sort({ createdAt: -1 });
    return NextResponse.json(recipes);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// POST /api/recipes
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const recipe = await Recipe.create(body);
    return NextResponse.json(recipe, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
