import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Restaurant } from "@/models/Restaurant";
import { requireUserId } from "@/lib/session";

// PATCH /api/restaurants/[id]/favorite — toggle isFavorite
export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireUserId();
  if (auth.error) return auth.error;
  try {
    await connectDB();
    const { id } = await params;
    const restaurant = await Restaurant.findOne({ _id: id, userId: auth.userId });
    if (!restaurant) return NextResponse.json({ error: "Not found" }, { status: 404 });
    restaurant.isFavorite = !restaurant.isFavorite;
    await restaurant.save();
    return NextResponse.json(restaurant);
  } catch (err) {
    console.error("PATCH /api/restaurants/[id]/favorite error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
