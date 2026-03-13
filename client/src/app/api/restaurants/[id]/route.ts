import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Restaurant } from "@/models/Restaurant";
import { restaurantSchema } from "@/lib/validations";

// GET /api/restaurants/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(restaurant);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT /api/restaurants/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();
    const parsed = restaurantSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const restaurant = await Restaurant.findByIdAndUpdate(id, parsed.data, { new: true });
    if (!restaurant) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(restaurant);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/restaurants/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const deleted = await Restaurant.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
