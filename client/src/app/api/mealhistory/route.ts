import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { MealHistory } from "@/models/MealHistory";
import { mealHistoryQuerySchema } from "@/lib/validations";

// GET /api/mealhistory?year=2026&month=3
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = req.nextUrl;
    const parsed = mealHistoryQuerySchema.safeParse({
      year: searchParams.get("year"),
      month: searchParams.get("month"),
    });

    if (!parsed.success) {
      return NextResponse.json({ error: "Valid year and month required" }, { status: 400 });
    }

    const { year, month } = parsed.data;
    const from = `${year}-${String(month).padStart(2, "0")}-01`;
    const to = `${year}-${String(month).padStart(2, "0")}-31`;

    const entries = await MealHistory.find({
      date: { $gte: from, $lte: to },
    });

    const result: Record<string, { recipeId: string; restaurantId?: string }> = {};
    for (const e of entries) {
      result[e.date] = { recipeId: e.recipeId, ...(e.restaurantId ? { restaurantId: e.restaurantId } : {}) };
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
