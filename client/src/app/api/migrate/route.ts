import { NextResponse } from "next/server";
import { connectDB, clientPromise } from "@/lib/mongodb";
import { Recipe } from "@/models/Recipe";
import { Restaurant } from "@/models/Restaurant";
import { MealHistory } from "@/models/MealHistory";
import { requireUserId } from "@/lib/session";

// POST /api/migrate — assign all unowned data to the authenticated user
// Run this once after signing in for the first time to claim existing data
export async function POST() {
  const auth = await requireUserId();
  if (auth.error) return auth.error;

  try {
    await connectDB();

    // Drop the old unique index on date (if it exists) so compound index can work
    try {
      const db = (await clientPromise).db();
      await db.collection("mealhistories").dropIndex("date_1");
    } catch {
      // Index may not exist — that's fine
    }

    const [recipes, restaurants, meals] = await Promise.all([
      Recipe.updateMany({ userId: null }, { $set: { userId: auth.userId } }),
      Restaurant.updateMany({ userId: null }, { $set: { userId: auth.userId } }),
      MealHistory.updateMany({ userId: null }, { $set: { userId: auth.userId } }),
    ]);

    return NextResponse.json({
      recipes: recipes.modifiedCount,
      restaurants: restaurants.modifiedCount,
      meals: meals.modifiedCount,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Migration failed", detail: String(err) },
      { status: 500 }
    );
  }
}
