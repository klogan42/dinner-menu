import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { MealHistory } from "@/models/MealHistory";

// GET /api/restaurants/visits — returns { [restaurantId]: lastVisitDate }
export async function GET() {
  try {
    await connectDB();
    const entries = await MealHistory.find({
      restaurantId: { $ne: null, $exists: true },
    }).sort({ date: -1 });

    const result: Record<string, string[]> = {};
    for (const e of entries) {
      if (!e.restaurantId) continue;
      if (!result[e.restaurantId]) result[e.restaurantId] = [];
      result[e.restaurantId].push(e.date);
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
