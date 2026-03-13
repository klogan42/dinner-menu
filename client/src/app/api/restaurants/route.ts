import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Restaurant } from "@/models/Restaurant";
import { restaurantSchema } from "@/lib/validations";

// GET /api/restaurants
export async function GET() {
  try {
    await connectDB();
    const restaurants = await Restaurant.find().sort({ createdAt: -1 });
    return NextResponse.json(restaurants);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/restaurants
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const parsed = restaurantSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const restaurant = await Restaurant.create(parsed.data);
    return NextResponse.json(restaurant, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
