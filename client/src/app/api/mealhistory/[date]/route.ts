import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { MealHistory } from "@/models/MealHistory";

// PUT /api/mealhistory/[date] — set or clear a meal for a date
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ date: string }> }
) {
  try {
    await connectDB();
    const { date } = await params;
    const { recipeId } = await req.json();

    if (recipeId === null || recipeId === undefined) {
      await MealHistory.deleteOne({ date });
    } else {
      await MealHistory.findOneAndUpdate(
        { date },
        { date, recipeId },
        { upsert: true }
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
