import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Restaurant } from "@/models/Restaurant";

// PATCH /api/restaurants/[id]/favorite — toggle isFavorite
export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) return NextResponse.json({ error: "Not found" }, { status: 404 });
    restaurant.isFavorite = !restaurant.isFavorite;
    await restaurant.save();
    return NextResponse.json(restaurant);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
