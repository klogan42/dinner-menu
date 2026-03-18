import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { MealHistory } from "@/models/MealHistory";
import { dateParamSchema, mealHistoryUpdateSchema } from "@/lib/validations";
import { requireUserId } from "@/lib/session";

// PUT /api/mealhistory/[date] — set or clear a meal for a date
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ date: string }> }
) {
  const auth = await requireUserId();
  if (auth.error) return auth.error;
  try {
    await connectDB();
    const { date } = await params;

    const dateResult = dateParamSchema.safeParse(date);
    if (!dateResult.success) {
      return NextResponse.json({ error: "Invalid date format, use YYYY-MM-DD" }, { status: 400 });
    }

    const body = await req.json();
    const parsed = mealHistoryUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { recipeId, restaurantId } = parsed.data;

    if (recipeId === null) {
      await MealHistory.deleteOne({ date, userId: auth.userId });
    } else {
      await MealHistory.findOneAndUpdate(
        { date, userId: auth.userId },
        { date, userId: auth.userId, recipeId, restaurantId: restaurantId ?? null },
        { upsert: true }
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error("PUT /api/mealhistory error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
