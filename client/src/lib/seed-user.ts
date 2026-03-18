import { Db } from "mongodb";

// Creates the default "Eat Out" recipe for a new user (if it doesn't already exist)
export async function seedNewUser(db: Db, userId: string) {
  const existing = await db.collection("recipes").findOne({ userId, isEatOut: true });
  if (existing) return;

  await db.collection("recipes").insertOne({
    userId,
    title: "Eat Out",
    description: "",
    tags: ["eat out"],
    ingredients: [],
    steps: [],
    prepTimeMinutes: 0,
    cookTimeMinutes: 0,
    servings: 1,
    isFavorite: false,
    isEatOut: true,
    createdAt: new Date(),
  });
}
