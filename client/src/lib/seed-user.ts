import { Db } from "mongodb";

const SEED_RECIPES = [
  {
    title: "Eat Out",
    tags: ["eat out"],
    isEatOut: true,
    isLeftovers: false,
  },
  {
    title: "Leftovers",
    tags: ["leftovers"],
    isEatOut: false,
    isLeftovers: true,
  },
];

// Creates default system recipes for a new user
export async function seedNewUser(db: Db, userId: string) {
  for (const seed of SEED_RECIPES) {
    const filter = seed.isEatOut
      ? { userId, isEatOut: true }
      : { userId, isLeftovers: true };

    const existing = await db.collection("recipes").findOne(filter);
    if (existing) continue;

    await db.collection("recipes").insertOne({
      userId,
      description: "",
      ingredients: [],
      steps: [],
      prepTimeMinutes: 0,
      cookTimeMinutes: 0,
      servings: 1,
      isFavorite: false,
      createdAt: new Date(),
      ...seed,
    });
  }
}
