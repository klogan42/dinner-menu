import { NextResponse } from "next/server";
import { connectDB, clientPromise } from "@/lib/mongodb";
import { requireUserId } from "@/lib/session";

const unowned = { $or: [{ userId: null }, { userId: { $exists: false } }] };

// POST /api/migrate — assign all unowned data to the authenticated user
export async function POST() {
  const auth = await requireUserId();
  if (auth.error) return auth.error;

  try {
    await connectDB();
    const db = (await clientPromise).db();

    // Drop the old unique index on date (if it exists) so compound index can work
    try {
      await db.collection("mealhistories").dropIndex("date_1");
    } catch {
      // Index may not exist — that's fine
    }

    const [recipes, restaurants, meals] = await Promise.all([
      db.collection("recipes").updateMany(unowned, { $set: { userId: auth.userId } }),
      db.collection("restaurants").updateMany(unowned, { $set: { userId: auth.userId } }),
      db.collection("mealhistories").updateMany(unowned, { $set: { userId: auth.userId } }),
    ]);

    return NextResponse.json({
      migrated: {
        recipes: recipes.modifiedCount,
        restaurants: restaurants.modifiedCount,
        meals: meals.modifiedCount,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Migration failed", detail: String(err) },
      { status: 500 }
    );
  }
}
