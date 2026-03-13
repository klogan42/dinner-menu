import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Recipe } from "@/models/Recipe";
import { MealHistory } from "@/models/MealHistory";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function toDateKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// GET /api/planner/current-week — requires x-api-key header
export async function GET(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key");
  const secret = process.env.API_SECRET_KEY;

  if (!secret || apiKey !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();

    const today = new Date();
    const todayDow = today.getDay(); // 0 = Sunday
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - todayDow);

    const week: { day: string; date: string; recipe: unknown }[] = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(sunday);
      date.setDate(sunday.getDate() + i);
      const dateKey = toDateKey(date);

      const entry = await MealHistory.findOne({ date: dateKey });
      let recipe = null;

      if (entry) {
        const r = await Recipe.findById(entry.recipeId);
        if (r) {
          recipe = {
            title: r.title,
            prepTimeMinutes: r.prepTimeMinutes,
            cookTimeMinutes: r.cookTimeMinutes,
            ingredients: r.ingredients,
          };
        }
      }

      week.push({ day: DAY_NAMES[i], date: dateKey, recipe });
    }

    return NextResponse.json(week);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
