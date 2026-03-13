"use client";

import { useState } from "react";
import Link from "next/link";
import { Shuffle, Trash2, Clock, ShoppingCart, ClipboardCopy, ChevronDown, RefreshCw, Dices } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useRecipes, useMealHistory, useSetMealHistory } from "@/lib/hooks";
import { api } from "@/lib/api";
import { DAYS } from "@/lib/types";
import { theme } from "@/lib/styles";
import { MealCalendar } from "@/components/meal-calendar";

const SHORT_DAYS: Record<string, string> = {
  Sunday: "Sun", Monday: "Mon", Tuesday: "Tue", Wednesday: "Wed",
  Thursday: "Thu", Friday: "Fri", Saturday: "Sat",
};

function toDateKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getOrderedDays() {
  const today = new Date();
  const todayIndex = today.getDay();
  const ordered: { day: (typeof DAYS)[number]; date: Date; dateKey: string; isToday: boolean }[] = [];
  for (let i = 0; i < 7; i++) {
    const offset = (todayIndex + i) % 7;
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    ordered.push({ day: DAYS[offset], date, dateKey: toDateKey(date), isToday: i === 0 });
  }
  return ordered;
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function PlannerPage() {
  const { data: recipes } = useRecipes();
  const now = new Date();
  const { data: historyThisMonth = {} } = useMealHistory(now.getFullYear(), now.getMonth() + 1);
  // If the week spans two months, also fetch next month
  const lastDay = getOrderedDays()[6]?.date;
  const needsNextMonth = lastDay && lastDay.getMonth() !== now.getMonth();
  const nextMonth = now.getMonth() + 2 > 12 ? 1 : now.getMonth() + 2;
  const nextMonthYear = now.getMonth() + 2 > 12 ? now.getFullYear() + 1 : now.getFullYear();
  const { data: historyNextMonth = {} } = useMealHistory(nextMonthYear, nextMonth);
  const history = needsNextMonth ? { ...historyThisMonth, ...historyNextMonth } : historyThisMonth;

  const setMealHistory = useSetMealHistory();
  const [openDay, setOpenDay] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [shoppingList, setShoppingList] = useState("");
  const [showShoppingList, setShowShoppingList] = useState(false);

  const assignRecipe = (dateKey: string, recipeId: string) => {
    setMealHistory.mutate({ date: dateKey, recipeId });
    setOpenDay(null);
    setSearchTerm("");
  };

  const clearDay = (dateKey: string) => {
    setMealHistory.mutate({ date: dateKey, recipeId: null });
  };

  const randomizeWeek = async () => {
    const random = await api.getRandomRecipes();
    const days = getOrderedDays();
    for (let i = 0; i < days.length; i++) {
      const recipeId = random[i]?.id ?? null;
      setMealHistory.mutate({ date: days[i].dateKey, recipeId });
    }
  };

  const randomizeDay = (dateKey: string) => {
    if (!recipes?.length) return;
    const pick = recipes[Math.floor(Math.random() * recipes.length)];
    setMealHistory.mutate({ date: dateKey, recipeId: pick.id });
  };

  const clearWeek = () => {
    const days = getOrderedDays();
    for (const d of days) {
      setMealHistory.mutate({ date: d.dateKey, recipeId: null });
    }
  };

  const getRecipe = (id: string | null) =>
    id ? recipes?.find((r) => r.id === id) : undefined;

  const generateShoppingList = () => {
    const map = new Map<string, { amount: string; unit: string }[]>();
    const days = getOrderedDays();
    days.forEach(({ dateKey }) => {
      const recipe = getRecipe(history[dateKey] ?? null);
      recipe?.ingredients.forEach((ing) => {
        const key = ing.name.toLowerCase();
        if (!map.has(key)) map.set(key, []);
        map.get(key)!.push({ amount: ing.amount, unit: ing.unit });
      });
    });

    const lines: string[] = [];
    map.forEach((amounts, name) => {
      const parts = amounts.map((a) => `${a.amount} ${a.unit}`.trim());
      lines.push(`- ${name}: ${parts.join(" + ")}`);
    });

    setShoppingList(lines.length ? lines.sort().join("\n") : "No recipes assigned yet.");
    setShowShoppingList(true);
  };

  const filteredRecipes = recipes?.filter((r) =>
    r.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full min-w-0">
      <h1 className={`${theme.heading} mb-4`}>This Week&apos;s Dinners</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Calendar — left side on desktop, top on mobile */}
        <div className="lg:w-[65%]">
          <Card className={theme.card}>
            <CardContent className="p-3 sm:p-4">
              <MealCalendar />
            </CardContent>
          </Card>
        </div>

        {/* Planner — right side on desktop, below calendar on mobile */}
        <div className="lg:w-[35%] min-w-0">
          <div className="flex gap-2 mb-3">
            <Button onClick={randomizeWeek} className={theme.buttonPrimary} size="sm">
              <Shuffle className="size-4" /> <span className="hidden xs:inline">Randomize</span>
            </Button>
            <Button variant="outline" onClick={generateShoppingList} className={theme.buttonOutline} size="sm">
              <ShoppingCart className="size-4" /> <span className="hidden xs:inline">Shopping List</span>
            </Button>
            <Button variant="outline" onClick={clearWeek} className={theme.buttonOutline} size="sm">
              <Trash2 className="size-4" /> <span className="hidden xs:inline">Clear</span>
            </Button>
          </div>

          <div className="grid gap-1.5">
        {getOrderedDays().map(({ day, date, dateKey, isToday }) => {
          const recipe = getRecipe(history[dateKey] ?? null);
          return (
            <Card key={dateKey} className={`${theme.card} ${isToday ? "ring-2 ring-amber-400 bg-amber-100/60" : ""}`} size="sm">
              <CardContent className="p-2 sm:p-2.5">
                {recipe ? (
                  <div className="min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="font-semibold text-amber-800 text-xs">
                        {isToday ? "Today" : SHORT_DAYS[day]}
                        <span className="font-normal text-stone-400 ml-1">{formatDate(date)}</span>
                      </span>
                      <span className="text-xs text-stone-400 flex items-center gap-0.5 shrink-0">
                        <Clock className="size-3" /> {recipe.prepTimeMinutes + recipe.cookTimeMinutes}m
                      </span>
                    </div>
                    <div className="flex items-center gap-1 min-w-0">
                      <Link href={`/recipes/${recipe.id}`} className="text-stone-700 hover:text-amber-700 font-medium text-xs truncate">
                        {recipe.title}
                      </Link>
                      <button onClick={() => { setOpenDay(openDay === dateKey ? null : dateKey); setSearchTerm(""); }} className="text-stone-400 hover:text-amber-600 p-2 -m-1 shrink-0" title="Switch recipe">
                        <RefreshCw className="size-4" />
                      </button>
                      <button onClick={() => randomizeDay(dateKey)} className="text-stone-400 hover:text-amber-600 p-2 -m-1 shrink-0" title="Random recipe">
                        <Dices className="size-4" />
                      </button>
                    </div>
                    {openDay === dateKey && (
                      <div className="mt-2 bg-amber-50 border border-amber-200 rounded-lg max-h-52 overflow-y-auto">
                        <div className="p-2 sticky top-0 bg-amber-50 border-b border-amber-100">
                          <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search..."
                            className="w-full text-sm px-3 py-2.5 border border-amber-200 rounded bg-amber-50 focus:outline-none focus:ring-1 focus:ring-amber-400"
                            autoFocus
                          />
                        </div>
                        {filteredRecipes?.map((r) => (
                          <button
                            key={r.id}
                            onClick={() => assignRecipe(dateKey, r.id)}
                            className="w-full text-left px-3 py-3 text-sm hover:bg-amber-100 text-stone-700 active:bg-amber-200 min-h-[44px]"
                          >
                            {r.title}
                            <span className="text-xs text-stone-400 ml-2">
                              {r.prepTimeMinutes + r.cookTimeMinutes}m
                            </span>
                          </button>
                        ))}
                        {filteredRecipes?.length === 0 && (
                          <div className="px-3 py-2 text-sm text-stone-400">No recipes found</div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="font-semibold text-amber-800 text-xs">
                        {isToday ? "Today" : SHORT_DAYS[day]}
                        <span className="font-normal text-stone-400 ml-1">{formatDate(date)}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => { setOpenDay(openDay === dateKey ? null : dateKey); setSearchTerm(""); }}
                        className="flex-1 text-left text-stone-400 text-xs py-1 px-1.5 rounded border border-dashed border-amber-200 hover:border-amber-400 hover:text-stone-500 flex items-center justify-between"
                      >
                        Choose a recipe...
                        <ChevronDown className="size-3" />
                      </button>
                      <button onClick={() => randomizeDay(dateKey)} className="text-stone-400 hover:text-amber-600 p-2 -m-1 shrink-0" title="Random recipe">
                        <Dices className="size-4" />
                      </button>
                    </div>

                    {openDay === dateKey && (
                      <div className="mt-2 bg-amber-50 border border-amber-200 rounded-lg max-h-52 overflow-y-auto">
                        <div className="p-2 sticky top-0 bg-amber-50 border-b border-amber-100">
                          <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search..."
                            className="w-full text-sm px-3 py-2.5 border border-amber-200 rounded bg-amber-50 focus:outline-none focus:ring-1 focus:ring-amber-400"
                            autoFocus
                          />
                        </div>
                        {filteredRecipes?.map((r) => (
                          <button
                            key={r.id}
                            onClick={() => assignRecipe(dateKey, r.id)}
                            className="w-full text-left px-3 py-3 text-sm hover:bg-amber-100 text-stone-700 active:bg-amber-200 min-h-[44px]"
                          >
                            {r.title}
                            <span className="text-xs text-stone-400 ml-2">
                              {r.prepTimeMinutes + r.cookTimeMinutes}m
                            </span>
                          </button>
                        ))}
                        {filteredRecipes?.length === 0 && (
                          <div className="px-3 py-2 text-sm text-stone-400">No recipes found</div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
          </div>
        </div>
      </div>

      {/* Shopping list dialog */}
      <Dialog open={showShoppingList} onOpenChange={setShowShoppingList}>
        <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className={theme.cardTitle}>Shopping List</DialogTitle>
          </DialogHeader>
          <pre className="text-sm text-stone-700 whitespace-pre-wrap bg-amber-50 p-3 sm:p-4 rounded-lg max-h-[60vh] overflow-y-auto">
            {shoppingList}
          </pre>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => navigator.clipboard.writeText(shoppingList)} className={theme.buttonOutline} size="sm">
              <ClipboardCopy className="size-4" /> Copy
            </Button>
            <Button variant="outline" onClick={() => window.print()} className={theme.buttonOutline} size="sm">
              Print
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
