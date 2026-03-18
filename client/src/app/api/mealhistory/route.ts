import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { MealHistory } from "@/models/MealHistory";
import { mealHistoryQuerySchema } from "@/lib/validations";
import { requireUserId } from "@/lib/session";

// GET /api/mealhistory?year=2026&month=3
export async function GET(req: NextRequest) {
  const auth = await requireUserId();
  if (auth.error) return auth.error;
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
    const lastDay = new Date(year, month, 0).getDate();
    const from = `${year}-${String(month).padStart(2, "0")}-01`;
    const to = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;

    const entries = await MealHistory.find({
      userId: auth.userId,
      date: { $gte: from, $lte: to },
    });

    const result: Record<string, { recipeId: string; restaurantId?: string }> = {};
    for (const e of entries) {
      result[e.date] = { recipeId: e.recipeId, ...(e.restaurantId ? { restaurantId: e.restaurantId } : {}) };
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("GET /api/mealhistory error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
