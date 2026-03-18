import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Restaurant } from "@/models/Restaurant";
import { restaurantSchema } from "@/lib/validations";
import { requireUserId } from "@/lib/session";

// GET /api/restaurants/[id]
export async function GET(
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
    return NextResponse.json(restaurant);
  } catch (err) {
    console.error("GET /api/restaurants/[id] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT /api/restaurants/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireUserId();
  if (auth.error) return auth.error;
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();
    const parsed = restaurantSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const restaurant = await Restaurant.findOneAndUpdate(
      { _id: id, userId: auth.userId },
      parsed.data,
      { new: true }
    );
    if (!restaurant) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(restaurant);
  } catch (err) {
    console.error("PUT /api/restaurants/[id] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/restaurants/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireUserId();
  if (auth.error) return auth.error;
  try {
    await connectDB();
    const { id } = await params;
    const deleted = await Restaurant.findOneAndDelete({ _id: id, userId: auth.userId });
    if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error("DELETE /api/restaurants/[id] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
