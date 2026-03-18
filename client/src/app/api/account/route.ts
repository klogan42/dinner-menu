import { NextRequest, NextResponse } from "next/server";
import { clientPromise } from "@/lib/mongodb";
import { requireUserId } from "@/lib/session";
import { ObjectId } from "mongodb";
import { connectDB } from "@/lib/mongodb";
import { Recipe } from "@/models/Recipe";
import { Restaurant } from "@/models/Restaurant";
import { MealHistory } from "@/models/MealHistory";

// PATCH /api/account — update name
export async function PATCH(req: NextRequest) {
  const auth = await requireUserId();
  if (auth.error) return auth.error;

  try {
    const { name } = await req.json();
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "Name required" }, { status: 400 });
    }

    const db = (await clientPromise).db();
    await db.collection("users").updateOne(
      { _id: new ObjectId(auth.userId) },
      { $set: { name: name.trim() } }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PATCH /api/account error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/account — delete account and all data
export async function DELETE() {
  const auth = await requireUserId();
  if (auth.error) return auth.error;

  try {
    await connectDB();
    const db = (await clientPromise).db();

    // Delete all user data
    await Promise.all([
      Recipe.deleteMany({ userId: auth.userId }),
      Restaurant.deleteMany({ userId: auth.userId }),
      MealHistory.deleteMany({ userId: auth.userId }),
      db.collection("accounts").deleteMany({ userId: new ObjectId(auth.userId) }),
      db.collection("sessions").deleteMany({ userId: new ObjectId(auth.userId) }),
      db.collection("users").deleteOne({ _id: new ObjectId(auth.userId) }),
    ]);

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error("DELETE /api/account error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
