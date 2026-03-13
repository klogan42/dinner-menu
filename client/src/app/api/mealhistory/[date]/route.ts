import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { MealHistory } from "@/models/MealHistory";
import { dateParamSchema, mealHistoryUpdateSchema } from "@/lib/validations";

// PUT /api/mealhistory/[date] — set or clear a meal for a date
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ date: string }> }
) {
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

    const { recipeId } = parsed.data;

    if (recipeId === null) {
      await MealHistory.deleteOne({ date });
    } else {
      await MealHistory.findOneAndUpdate(
        { date },
        { date, recipeId },
        { upsert: true }
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
