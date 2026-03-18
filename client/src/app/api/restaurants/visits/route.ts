import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { MealHistory } from "@/models/MealHistory";
import { requireUserId } from "@/lib/session";

// GET /api/restaurants/visits — returns { [restaurantId]: lastVisitDate }
export async function GET() {
  const auth = await requireUserId();
  if (auth.error) return auth.error;
  try {
    await connectDB();
    const entries = await MealHistory.find({
      userId: auth.userId,
      restaurantId: { $ne: null, $exists: true },
    }).sort({ date: -1 });

    const result: Record<string, string[]> = {};
    for (const e of entries) {
      if (!e.restaurantId) continue;
      if (!result[e.restaurantId]) result[e.restaurantId] = [];
      result[e.restaurantId].push(e.date);
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("GET /api/restaurants/visits error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
