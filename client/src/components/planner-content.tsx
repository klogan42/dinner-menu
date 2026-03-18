"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { Shuffle, Trash2, Clock, ShoppingCart, ClipboardCopy, ChevronDown, ChevronRight, RefreshCw, Dices, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useRecipes, useRestaurants, useMealHistory, useSetMealHistory, useRecipeCooked } from "@/lib/hooks";
import { api } from "@/lib/api";
import { DAYS } from "@/lib/types";
import { theme } from "@/lib/styles";
import { toDateKey } from "@/lib/utils";
import { MealCalendar } from "@/components/meal-calendar";
import { RecipePickerDropdown } from "@/components/recipe-picker-dropdown";
import { RestaurantPickerDropdown } from "@/components/restaurant-picker-dropdown";

const SHORT_DAYS: Record<string, string> = {
  Sunday: "Sun", Monday: "Mon", Tuesday: "Tue", Wednesday: "Wed",
  Thursday: "Thu", Friday: "Fri", Saturday: "Sat",
};

function getWeekDays() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayKey = toDateKey(today);

  // Past days: start of this calendar week (Sunday) up to yesterday
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay()); // Sunday
  const past: { day: (typeof DAYS)[number]; date: Date; dateKey: string; isToday: boolean; isPast: boolean }[] = [];
  for (let d = new Date(weekStart); d < today; d.setDate(d.getDate() + 1)) {
    const date = new Date(d);
    past.push({ day: DAYS[date.getDay()], date, dateKey: toDateKey(date), isToday: false, isPast: true });
  }

  // Current days: today + next 6 days (always 7 forward-looking days)
  const current = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateKey = toDateKey(date);
    return { day: DAYS[date.getDay()], date, dateKey, isToday: dateKey === todayKey, isPast: false };
  });

  return { past, current };
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function PlannerContent() {
  const { update } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();

  // After Stripe checkout, refresh the JWT to pick up "active" status
  useEffect(() => {
    if (searchParams.get("paid") === "1") {
      update().then(() => {
        window.location.href = "/";
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { data: recipes } = useRecipes();
  const { data: cooked = {} } = useRecipeCooked();
  const { past: pastDays, current: currentDays } = getWeekDays();

  const todayStr = toDateKey(new Date());
  const formatLastAte = (recipeId: string) => {
    const last = cooked[recipeId]?.[0];
    if (!last || last > todayStr) return null;
    return new Date(last + "T00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  };

  // Fetch months needed to cover all visible days
  const now = new Date();
  const allDates = [...pastDays, ...currentDays];
  const firstDate = allDates[0]?.date ?? now;
  const lastDate = allDates[allDates.length - 1]?.date ?? now;
  const m1 = { year: firstDate.getFullYear(), month: firstDate.getMonth() + 1 };
  const m2 = { year: lastDate.getFullYear(), month: lastDate.getMonth() + 1 };
  const m2Needed = m1.year !== m2.year || m1.month !== m2.month;
  const { data: history1 = {} } = useMealHistory(m1.year, m1.month);
  const { data: history2 = {} } = useMealHistory(m2Needed ? m2.year : m1.year, m2Needed ? m2.month : m1.month);
  const history = m2Needed ? { ...history1, ...history2 } : history1;

  const { data: restaurants } = useRestaurants();
  const setMealHistory = useSetMealHistory();
  const [showPast, setShowPast] = useState(false);
  const [openDay, setOpenDay] = useState<string | null>(null);
  const [shoppingList, setShoppingList] = useState("");
  const [showShoppingList, setShowShoppingList] = useState(false);
  const [restaurantPickerDay, setRestaurantPickerDay] = useState<string | null>(null);

  const getRestaurant = (id: string | null | undefined) =>
    id ? restaurants?.find((r) => r.id === id) : undefined;

  const assignRestaurant = (dateKey: string, restaurantId: string) => {
    const entry = history[dateKey];
    const recipeId = entry?.recipeId ?? recipes?.find((r) => r.isEatOut)?.id;
    if (recipeId) {
      setMealHistory.mutate({ date: dateKey, recipeId, restaurantId });
    }
    setRestaurantPickerDay(null);
  };

  const assignRecipe = (dateKey: string, recipeId: string) => {
    setMealHistory.mutate({ date: dateKey, recipeId });
    setOpenDay(null);
  };

  const randomizeWeek = async () => {
    const random = await api.getRandomRecipes();
    for (let i = 0; i < currentDays.length; i++) {
      const recipeId = random[i]?.id ?? null;
      setMealHistory.mutate({ date: currentDays[i].dateKey, recipeId });
    }
  };

  const randomizeDay = (dateKey: string) => {
    if (!recipes?.length) return;
    const pick = recipes[Math.floor(Math.random() * recipes.length)];
    setMealHistory.mutate({ date: dateKey, recipeId: pick.id });
  };

  const clearWeek = () => {
    for (const d of currentDays) {
      setMealHistory.mutate({ date: d.dateKey, recipeId: null });
    }
  };

  const getRecipe = (id: string | null) =>
    id ? recipes?.find((r) => r.id === id) : undefined;

  const generateShoppingList = () => {
    const map = new Map<string, { amount: string; unit: string }[]>();
    currentDays.forEach(({ dateKey }) => {
      const recipe = getRecipe(history[dateKey]?.recipeId ?? null);
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


  return (
    <div className="w-full min-w-0">
      <h1 className={`${theme.heading} mb-4`}>What&apos;s for Dinner?</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Calendar — left on desktop, below planner on mobile */}
        <div className="lg:w-[65%] order-2 lg:order-1">
          <Card className={theme.card}>
            <CardContent className="p-3 sm:p-4">
              <MealCalendar />
            </CardContent>
          </Card>
        </div>

        {/* Planner — right on desktop, top on mobile */}
        <div className="lg:w-[35%] min-w-0 order-1 lg:order-2">
          <div className="flex gap-2 mb-3">
            <Button onClick={randomizeWeek} className={`${theme.buttonPrimary} min-h-[44px]`}>
              <Shuffle className="size-4" /> <span className="hidden sm:inline">Randomize</span>
            </Button>
            <Button variant="outline" onClick={generateShoppingList} className={`${theme.buttonOutline} min-h-[44px]`}>
              <ShoppingCart className="size-4" /> <span className="hidden sm:inline">Shopping List</span>
            </Button>
            <Button variant="outline" onClick={clearWeek} className={`${theme.buttonOutline} min-h-[44px]`}>
              <Trash2 className="size-4" /> <span className="hidden sm:inline">Clear</span>
            </Button>
          </div>

          <div className="grid gap-2">

        {/* Earlier this week — collapsible */}
        {pastDays.length > 0 && (
          <>
            <button
              onClick={() => setShowPast(!showPast)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl border border-amber-200/60 bg-amber-50/50 hover:bg-amber-100/40 transition-colors min-h-[44px]"
            >
              {showPast ? <ChevronDown className="size-4 text-amber-600 shrink-0" /> : <ChevronRight className="size-4 text-amber-600 shrink-0" />}
              <span className="text-sm font-display text-amber-700">Earlier this week</span>
              <div className="flex flex-wrap gap-1 ml-1">
                {pastDays.map(({ dateKey, day }) => {
                  const r = getRecipe(history[dateKey]?.recipeId ?? null);
                  return (
                    <span key={dateKey} className="text-xs font-display text-amber-600">
                      {SHORT_DAYS[day]}{r ? ` · ${r.title.split(" ").slice(0, 2).join(" ")}` : ""}
                    </span>
                  );
                }).reduce<React.ReactNode[]>((acc, el, i) => i === 0 ? [el] : [...acc, <span key={`sep-${i}`} className="text-amber-500">·</span>, el], [])}
              </div>
            </button>

            {showPast && pastDays.map(({ day, date, dateKey }) => {
              const recipe = getRecipe(history[dateKey]?.recipeId ?? null);
              const isEatOut = recipe?.isEatOut ?? false;
              const restaurant = getRestaurant(history[dateKey]?.restaurantId);
              return (
                <Card key={dateKey} className={`${theme.card} opacity-60`} size="sm">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-display text-amber-900 text-sm">
                        {SHORT_DAYS[day]}
                        <span className="font-normal text-amber-600/40 ml-1.5">{formatDate(date)}</span>
                      </span>
                    </div>
                    {recipe ? (
                      <div className="flex items-center gap-1 mt-0.5 min-w-0">
                        {isEatOut && <Store className="size-3.5 text-amber-600 shrink-0" />}
                        <span className="text-sm font-display text-amber-700/70 truncate">
                          {isEatOut && restaurant ? restaurant.name : recipe.title}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm font-display text-amber-400/60">—</span>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </>
        )}

        {currentDays.map(({ day, date, dateKey, isToday }) => {
          const recipe = getRecipe(history[dateKey]?.recipeId ?? null);
          const isEatOut = recipe?.isEatOut ?? false;
          const restaurant = getRestaurant(history[dateKey]?.restaurantId);
          return (
            <Card key={dateKey} className={`${theme.card} ${isToday ? "ring-2 ring-amber-400/50 bg-amber-100/50" : ""}`} size="sm">
              <CardContent className="p-3 sm:p-3">
                {recipe ? (
                  <div className="min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="font-display text-amber-900 text-sm">
                        {isToday ? "Today" : SHORT_DAYS[day]}
                        <span className="font-normal text-amber-900 ml-1.5">{formatDate(date)}</span>
                      </span>
                      {!isEatOut && (
                        <span className="text-xs text-amber-600/40 flex items-center gap-1 shrink-0">
                          <Clock className="size-3.5" /> {recipe.prepTimeMinutes + recipe.cookTimeMinutes}m
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 min-w-0">
                      {isEatOut ? (
                        <div className="flex items-center gap-1.5 flex-1 min-w-0">
                          <Store className="size-4 text-amber-600 shrink-0" />
                          {restaurant ? (
                            <button
                              onClick={() => { setRestaurantPickerDay(restaurantPickerDay === dateKey ? null : dateKey); }}
                              className="text-amber-800 hover:text-amber-600 font-display text-base font-bold truncate transition-colors"
                            >
                              {restaurant.name}
                            </button>
                          ) : (
                            <button
                              onClick={() => { setRestaurantPickerDay(restaurantPickerDay === dateKey ? null : dateKey); }}
                              className="text-amber-400 hover:text-amber-600 font-display text-sm transition-colors"
                            >
                              Pick a spot...
                            </button>
                          )}
                        </div>
                      ) : (
                        <Link href={`/recipes/${recipe.id}`} className="text-amber-800 hover:text-amber-600 font-display text-base truncate">
                          {recipe.title}
                        </Link>
                      )}
                      <button onClick={() => { setOpenDay(openDay === dateKey ? null : dateKey); }} className="text-amber-400 hover:text-amber-600 p-2 -m-1 shrink-0 transition-colors" title="Switch recipe">
                        <RefreshCw className="size-4" />
                      </button>
                      <button onClick={() => randomizeDay(dateKey)} className="text-amber-400 hover:text-amber-600 p-2 -m-1 shrink-0 transition-colors" title="Random recipe">
                        <Dices className="size-4" />
                      </button>
                    </div>
                    {restaurantPickerDay === dateKey && restaurants && (
                      <RestaurantPickerDropdown
                        restaurants={restaurants}
                        onSelect={(rid) => assignRestaurant(dateKey, rid)}
                        onClose={() => setRestaurantPickerDay(null)}
                      />
                    )}
                    {openDay === dateKey && recipes && (
                      <RecipePickerDropdown
                        recipes={recipes}
                        onSelect={(rid) => assignRecipe(dateKey, rid)}
                        onClose={() => setOpenDay(null)}
                        formatLastAte={formatLastAte}
                      />
                    )}
                  </div>
                ) : (
                  <div className="min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="font-display text-amber-900 text-sm">
                        {isToday ? "Today" : SHORT_DAYS[day]}
                        <span className="font-normal text-amber-900 ml-1.5">{formatDate(date)}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => { setOpenDay(openDay === dateKey ? null : dateKey); }}
                        className="flex-1 text-left text-amber-800 text-sm font-display py-2 px-3 rounded-xl border border-dashed border-amber-800 hover:border-amber-900 hover:text-amber-900 flex items-center justify-between min-h-[44px] transition-colors"
                      >
                        Choose a recipe...
                        <ChevronDown className="size-4" />
                      </button>
                      <button onClick={() => randomizeDay(dateKey)} className="text-amber-400 hover:text-amber-600 p-2 -m-1 shrink-0 transition-colors" title="Random recipe">
                        <Dices className="size-4" />
                      </button>
                    </div>

                    {openDay === dateKey && recipes && (
                      <RecipePickerDropdown
                        recipes={recipes}
                        onSelect={(rid) => assignRecipe(dateKey, rid)}
                        onClose={() => setOpenDay(null)}
                        formatLastAte={formatLastAte}
                      />
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
          <pre className="text-sm text-amber-900 whitespace-pre-wrap bg-amber-50 p-4 rounded-xl max-h-[60vh] overflow-y-auto">
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

