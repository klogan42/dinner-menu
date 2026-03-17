import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { MealHistory } from "@/models/MealHistory";
import { requireUserId } from "@/lib/session";

// GET /api/recipes/[id]/history — all dates this recipe was cooked
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireUserId();
  if (auth.error) return auth.error;
  try {
    await connectDB();
    const { id } = await params;

    const entries = await MealHistory.find({ recipeId: id, userId: auth.userId })
      .sort({ date: -1 })
      .lean();

    const dates = entries.map((e) => ({
      date: e.date,
      restaurantId: e.restaurantId || null,
    }));

    return NextResponse.json(dates);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
