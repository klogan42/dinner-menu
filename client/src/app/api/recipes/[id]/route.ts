import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Recipe } from "@/models/Recipe";
import { recipeSchema } from "@/lib/validations";
import { requireUserId } from "@/lib/session";

// GET /api/recipes/[id]
export async function GET(
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
    return NextResponse.json(recipe);
  } catch (err) {
    console.error("GET /api/recipes/[id] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT /api/recipes/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireUserId();
  if (auth.error) return auth.error;
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();
    const parsed = recipeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const recipe = await Recipe.findOneAndUpdate(
      { _id: id, userId: auth.userId },
      parsed.data,
      { new: true }
    );
    if (!recipe) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(recipe);
  } catch (err) {
    console.error("PUT /api/recipes/[id] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/recipes/[id]
export async function DELETE(
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
    if (recipe.isEatOut) return NextResponse.json({ error: "The Eat Out recipe cannot be deleted" }, { status: 400 });
    await Recipe.findOneAndDelete({ _id: id, userId: auth.userId });
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error("DELETE /api/recipes/[id] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
