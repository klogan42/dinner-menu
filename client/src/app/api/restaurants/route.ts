import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Restaurant } from "@/models/Restaurant";
import { restaurantSchema } from "@/lib/validations";
import { requireUserId } from "@/lib/session";

// GET /api/restaurants
export async function GET() {
  const auth = await requireUserId();
  if (auth.error) return auth.error;
  try {
    await connectDB();
    const restaurants = await Restaurant.find({ userId: auth.userId }).sort({ createdAt: -1 });
    return NextResponse.json(restaurants);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/restaurants
export async function POST(req: NextRequest) {
  const auth = await requireUserId();
  if (auth.error) return auth.error;
  try {
    await connectDB();
    const body = await req.json();
    const parsed = restaurantSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const restaurant = await Restaurant.create({ ...parsed.data, userId: auth.userId });
    return NextResponse.json(restaurant, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
