import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Recipe } from "@/models/Recipe";
import { MealHistory } from "@/models/MealHistory";

const seedRecipes = [
  {
    title: "Spaghetti and Meatballs",
    description: "Classic spaghetti with homemade meatballs in marinara sauce",
    tags: ["pasta", "quick"],
    ingredients: [
      { name: "spaghetti", amount: "1", unit: "lb" },
      { name: "ground beef", amount: "1", unit: "lb" },
      { name: "marinara sauce", amount: "24", unit: "oz" },
      { name: "breadcrumbs", amount: "1/2", unit: "cup" },
      { name: "egg", amount: "1", unit: "" },
      { name: "parmesan cheese", amount: "1/4", unit: "cup" },
    ],
    ingredients_list: true,
    steps: [
      "Mix ground beef, breadcrumbs, egg, and parmesan; form into meatballs",
      "Brown meatballs in a skillet over medium-high heat",
      "Add marinara sauce and simmer 15 minutes",
      "Cook spaghetti according to package directions",
      "Serve meatballs and sauce over spaghetti",
    ],
    prepTimeMinutes: 15,
    cookTimeMinutes: 30,
    servings: 6,
    isFavorite: true,
  },
  {
    title: "Taco Night",
    description: "Seasoned ground beef tacos with all the fixings",
    tags: ["quick"],
    ingredients: [
      { name: "ground beef", amount: "1", unit: "lb" },
      { name: "taco seasoning", amount: "1", unit: "packet" },
      { name: "taco shells", amount: "12", unit: "" },
      { name: "shredded cheese", amount: "1", unit: "cup" },
      { name: "lettuce", amount: "2", unit: "cups" },
      { name: "tomato", amount: "2", unit: "" },
      { name: "sour cream", amount: "1/2", unit: "cup" },
    ],
    steps: [
      "Brown ground beef and drain",
      "Add taco seasoning and water per package directions",
      "Warm taco shells in oven",
      "Set up toppings bar and let everyone build their tacos",
    ],
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    servings: 6,
    isFavorite: false,
  },
  {
    title: "Homemade Pizza",
    description: "Easy homemade pizza with your favorite toppings",
    tags: ["quick"],
    ingredients: [
      { name: "pizza dough", amount: "1", unit: "lb" },
      { name: "pizza sauce", amount: "1/2", unit: "cup" },
      { name: "mozzarella cheese", amount: "2", unit: "cups" },
      { name: "pepperoni", amount: "1/2", unit: "cup" },
    ],
    steps: [
      "Preheat oven to 450F",
      "Roll out dough on a floured surface",
      "Spread sauce, add cheese and toppings",
      "Bake 12-15 minutes until crust is golden",
    ],
    prepTimeMinutes: 15,
    cookTimeMinutes: 15,
    servings: 4,
    isFavorite: true,
  },
  {
    title: "Mac and Cheese with Hot Dogs",
    description: "Creamy mac and cheese with sliced hot dogs mixed in",
    tags: ["pasta", "quick"],
    ingredients: [
      { name: "elbow macaroni", amount: "1", unit: "lb" },
      { name: "cheddar cheese", amount: "2", unit: "cups" },
      { name: "milk", amount: "1", unit: "cup" },
      { name: "butter", amount: "2", unit: "tbsp" },
      { name: "hot dogs", amount: "4", unit: "" },
    ],
    steps: [
      "Cook macaroni according to package directions",
      "Slice hot dogs and pan fry until browned",
      "Melt butter, add milk and cheese to make sauce",
      "Combine pasta, sauce, and hot dogs",
    ],
    prepTimeMinutes: 10,
    cookTimeMinutes: 20,
    servings: 6,
    isFavorite: false,
  },
  {
    title: "Slow Cooker Chicken Noodle Soup",
    description: "Comforting chicken noodle soup made easy in the slow cooker",
    tags: ["soup", "crockpot"],
    ingredients: [
      { name: "chicken breasts", amount: "2", unit: "lbs" },
      { name: "egg noodles", amount: "8", unit: "oz" },
      { name: "chicken broth", amount: "8", unit: "cups" },
      { name: "carrots", amount: "3", unit: "" },
      { name: "celery", amount: "3", unit: "stalks" },
      { name: "onion", amount: "1", unit: "" },
    ],
    steps: [
      "Add chicken, broth, carrots, celery, and onion to slow cooker",
      "Cook on low 6-8 hours or high 3-4 hours",
      "Remove chicken and shred with forks",
      "Add noodles and shredded chicken back, cook 20 more minutes",
    ],
    prepTimeMinutes: 15,
    cookTimeMinutes: 360,
    servings: 8,
    isFavorite: true,
  },
  {
    title: "Grilled Chicken with Buttered Rice",
    description: "Simple grilled chicken breast served with buttery rice",
    tags: ["grill", "quick"],
    ingredients: [
      { name: "chicken breasts", amount: "4", unit: "" },
      { name: "rice", amount: "2", unit: "cups" },
      { name: "butter", amount: "3", unit: "tbsp" },
      { name: "garlic powder", amount: "1", unit: "tsp" },
      { name: "salt and pepper", amount: "", unit: "to taste" },
    ],
    steps: [
      "Season chicken with garlic powder, salt, and pepper",
      "Grill chicken 6-7 minutes per side until done",
      "Cook rice according to package directions",
      "Stir butter into hot rice and serve with chicken",
    ],
    prepTimeMinutes: 20,
    cookTimeMinutes: 25,
    servings: 6,
    isFavorite: false,
  },
  {
    title: "Brats",
    description: "Grilled bratwursts with mustard and buns",
    tags: ["grilling", "quick"],
    ingredients: [
      { name: "bratwursts", amount: "6", unit: "links" },
      { name: "hot dog buns", amount: "6", unit: "" },
      { name: "mustard", amount: "2", unit: "tbsp" },
    ],
    steps: [
      "Grill brats over medium heat 15-20 minutes, turning occasionally",
      "Toast buns on grill",
      "Serve with mustard",
    ],
    prepTimeMinutes: 5,
    cookTimeMinutes: 20,
    servings: 4,
    isFavorite: false,
  },
  {
    title: "Chili",
    description: "Hearty beef chili with beans",
    tags: ["comfort", "slow-cook"],
    ingredients: [
      { name: "ground beef", amount: "1.5", unit: "lbs" },
      { name: "kidney beans", amount: "2", unit: "cans" },
      { name: "diced tomatoes", amount: "2", unit: "cans" },
      { name: "onion", amount: "1", unit: "" },
      { name: "chili powder", amount: "3", unit: "tbsp" },
    ],
    steps: [
      "Brown beef with onion",
      "Add beans, tomatoes, and chili powder",
      "Simmer 30-45 minutes",
    ],
    prepTimeMinutes: 10,
    cookTimeMinutes: 45,
    servings: 6,
    isFavorite: false,
  },
  {
    title: "Grilled Cheese",
    description: "Classic grilled cheese sandwiches with tomato soup",
    tags: ["quick", "comfort"],
    ingredients: [
      { name: "bread", amount: "8", unit: "slices" },
      { name: "cheddar cheese", amount: "8", unit: "slices" },
      { name: "butter", amount: "4", unit: "tbsp" },
      { name: "tomato soup", amount: "2", unit: "cans" },
    ],
    steps: [
      "Butter bread slices",
      "Layer cheese between bread",
      "Cook in skillet until golden on both sides",
      "Heat soup and serve alongside",
    ],
    prepTimeMinutes: 5,
    cookTimeMinutes: 10,
    servings: 4,
    isFavorite: false,
  },
  {
    title: "Omelettes",
    description: "Made-to-order omelettes with your favorite fillings",
    tags: ["quick", "breakfast-for-dinner"],
    ingredients: [
      { name: "eggs", amount: "8", unit: "" },
      { name: "shredded cheese", amount: "1", unit: "cup" },
      { name: "ham", amount: "4", unit: "slices" },
      { name: "bell pepper", amount: "1", unit: "" },
      { name: "butter", amount: "2", unit: "tbsp" },
    ],
    steps: [
      "Whisk 2 eggs per omelette",
      "Melt butter in pan over medium heat",
      "Pour eggs, add fillings when edges set",
      "Fold and serve",
    ],
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    servings: 4,
    isFavorite: false,
  },
  {
    title: "Pulled Pork",
    description: "Slow-cooked pulled pork sandwiches with BBQ sauce",
    tags: ["slow-cook", "comfort"],
    ingredients: [
      { name: "pork shoulder", amount: "3", unit: "lbs" },
      { name: "BBQ sauce", amount: "1", unit: "cup" },
      { name: "hamburger buns", amount: "6", unit: "" },
      { name: "apple cider vinegar", amount: "2", unit: "tbsp" },
      { name: "brown sugar", amount: "2", unit: "tbsp" },
    ],
    steps: [
      "Season pork and place in slow cooker",
      "Add vinegar and brown sugar",
      "Cook on low 8 hours",
      "Shred with forks, mix in BBQ sauce",
      "Serve on buns",
    ],
    prepTimeMinutes: 10,
    cookTimeMinutes: 480,
    servings: 6,
    isFavorite: false,
  },
  {
    title: "Eat Out",
    description: "Night off from cooking",
    tags: ["easy"],
    ingredients: [],
    steps: ["Pick a restaurant", "Enjoy"],
    prepTimeMinutes: 0,
    cookTimeMinutes: 0,
    servings: 4,
    isFavorite: false,
  },
  {
    title: "Frozen Pizza",
    description: "Frozen pizza night",
    tags: ["quick", "easy"],
    ingredients: [{ name: "frozen pizza", amount: "2", unit: "" }],
    steps: [
      "Preheat oven per package directions",
      "Bake until golden and bubbly",
      "Slice and serve",
    ],
    prepTimeMinutes: 2,
    cookTimeMinutes: 20,
    servings: 4,
    isFavorite: false,
  },
];

// POST /api/seed — wipe and reseed (disabled in production)
export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const apiKey = req.headers.get("x-api-key");
  const secret = process.env.API_SECRET_KEY;
  if (!secret || apiKey !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    await Recipe.deleteMany({});
    await MealHistory.deleteMany({});
    const created = await Recipe.insertMany(seedRecipes);
    return NextResponse.json({
      message: `Seeded ${created.length} recipes`,
      recipes: created,
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
