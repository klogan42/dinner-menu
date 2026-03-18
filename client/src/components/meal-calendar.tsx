"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, X, CalendarDays, CalendarRange, Store } from "lucide-react";
import { useMealHistory, useRecipes, useRestaurants, useSetMealHistory } from "@/lib/hooks";

const DAY_NAMES_FULL = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DAY_NAMES_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_LETTERS = ["S", "M", "T", "W", "T", "F", "S"];

function toDateKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getWeekStart(date: Date) {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay());
  d.setHours(0, 0, 0, 0);
  return d;
}

function getTwoWeeks(weekStart: Date) {
  const days: Date[] = [];
  for (let i = 0; i < 14; i++) {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    days.push(d);
  }
  return days;
}

function getMonthDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: (Date | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(new Date(year, month, d));
  return days;
}

type ViewMode = "2week" | "month";

export function MealCalendar() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const [view, setView] = useState<ViewMode>("2week");
  const [weekOffset, setWeekOffset] = useState(0);
  const [monthYear, setMonthYear] = useState(now.getFullYear());
  const [monthMonth, setMonthMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [restaurantPickerDate, setRestaurantPickerDate] = useState<string | null>(null);
  const [restaurantSearch, setRestaurantSearch] = useState("");

  const windowStart = useMemo(() => {
    const start = new Date(now);
    start.setDate(start.getDate() - 4 + weekOffset * 14);
    return start;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekOffset]);

  const twoWeekDays = useMemo(() => getTwoWeeks(windowStart), [windowStart]);
  const monthDays = useMemo(() => getMonthDays(monthYear, monthMonth), [monthYear, monthMonth]);

  const months = useMemo(() => {
    const activeDays = view === "2week" ? twoWeekDays : monthDays.filter((d): d is Date => d !== null);
    const set = new Set<string>();
    for (const d of activeDays) {
      set.add(`${d.getFullYear()}-${d.getMonth() + 1}`);
    }
    return [...set].map((s) => {
      const [y, m] = s.split("-").map(Number);
      return { year: y, month: m };
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, weekOffset, monthYear, monthMonth]);

  const { data: history1 = {} } = useMealHistory(months[0]?.year ?? now.getFullYear(), months[0]?.month ?? now.getMonth() + 1);
  const { data: history2 = {} } = useMealHistory(months[1]?.year ?? months[0]?.year ?? now.getFullYear(), months[1]?.month ?? months[0]?.month ?? now.getMonth() + 1);
  const history = { ...history1, ...history2 };

  const { data: recipes } = useRecipes();
  const { data: restaurants } = useRestaurants();
  const setMealHistory = useSetMealHistory();

  const todayKey = toDateKey(now);

  const getRecipeName = (recipeId: string) =>
    recipes?.find((r) => r.id === recipeId)?.title;

  const getRestaurantName = (restaurantId: string) =>
    restaurants?.find((r) => r.id === restaurantId)?.name;

  // Check if a recipe is the "Eat Out" recipe
  const isEatOutRecipe = (recipeId: string) => {
    const recipe = recipes?.find((r) => r.id === recipeId);
    return recipe?.tags.includes("eat out") || recipe?.title.toLowerCase().includes("eat out");
  };

  const prev = () => {
    if (view === "2week") { setWeekOffset(weekOffset - 1); }
    else {
      if (monthMonth === 0) { setMonthYear(monthYear - 1); setMonthMonth(11); }
      else setMonthMonth(monthMonth - 1);
    }
    setSelectedDate(null);
  };
  const next = () => {
    if (view === "2week") { setWeekOffset(weekOffset + 1); }
    else {
      if (monthMonth === 11) { setMonthYear(monthYear + 1); setMonthMonth(0); }
      else setMonthMonth(monthMonth + 1);
    }
    setSelectedDate(null);
  };
  const goToday = () => {
    setWeekOffset(0);
    setMonthYear(now.getFullYear());
    setMonthMonth(now.getMonth());
    setSelectedDate(null);
  };

  const assignMeal = (recipeId: string) => {
    if (!selectedDate) return;
    const recipe = recipes?.find((r) => r.id === recipeId);
    const isEatOut = recipe?.tags.includes("eat out") || recipe?.title.toLowerCase().includes("eat out");
    setMealHistory.mutate({ date: selectedDate, recipeId });
    if (isEatOut && restaurants?.length) {
      setRestaurantPickerDate(selectedDate);
      setRestaurantSearch("");
    }
    setSelectedDate(null);
    setSearch("");
  };

  const assignRestaurant = (dateKey: string, restaurantId: string) => {
    const entry = history[dateKey];
    const recipeId = entry?.recipeId ?? recipes?.find((r) => r.tags.includes("eat out") || r.title.toLowerCase().includes("eat out"))?.id;
    if (recipeId) {
      setMealHistory.mutate({ date: dateKey, recipeId, restaurantId });
    }
    setRestaurantPickerDate(null);
    setRestaurantSearch("");
  };

  const clearMeal = (dateKey: string) => {
    setMealHistory.mutate({ date: dateKey, recipeId: null });
  };

  const filteredRecipes = recipes?.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase())
  );

  const filteredRestaurants = restaurants?.filter((r) =>
    r.name.toLowerCase().includes(restaurantSearch.toLowerCase())
  );

  const headerLabel = view === "2week"
    ? (() => {
        const first = twoWeekDays[0];
        const last = twoWeekDays[twoWeekDays.length - 1];
        const sameMonth = first.getMonth() === last.getMonth();
        return sameMonth
          ? `${first.toLocaleDateString("en-US", { month: "short" })} ${first.getDate()} – ${last.getDate()}, ${first.getFullYear()}`
          : `${first.toLocaleDateString("en-US", { month: "short" })} ${first.getDate()} – ${last.toLocaleDateString("en-US", { month: "short" })} ${last.getDate()}, ${last.getFullYear()}`;
      })()
    : new Date(monthYear, monthMonth).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const showBackToToday = view === "2week" ? weekOffset !== 0 : (monthYear !== now.getFullYear() || monthMonth !== now.getMonth());

  // Recipe picker (shared between views)
  const recipePicker = selectedDate && (
    <div className="mt-3 bg-amber-50/50 border border-amber-200/60 rounded-xl max-h-80 overflow-y-auto shadow-sm">
      <div className="p-2.5 sticky top-0 bg-amber-50/80 backdrop-blur-sm border-b border-amber-200/40">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-display text-amber-800">
            {new Date(selectedDate + "T00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
          </span>
          <button onClick={() => { setSelectedDate(null); setSearch(""); }} className="text-amber-400 hover:text-amber-600 p-2 -m-1">
            <X className="size-4" />
          </button>
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search recipes..."
          className="w-full font-display text-base sm:text-sm px-3 py-2.5 border border-amber-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400"
        />
      </div>
      {filteredRecipes?.map((r) => (
        <button
          key={r.id}
          onClick={() => assignMeal(r.id)}
          className="w-full text-left px-3 py-3 text-sm font-display hover:bg-amber-100/50 text-amber-900 active:bg-amber-100 min-h-[44px] transition-colors"
        >
          {r.title}
          <span className="text-xs text-amber-600/60 ml-2">
            {r.prepTimeMinutes + r.cookTimeMinutes}m
          </span>
        </button>
      ))}
      {filteredRecipes?.length === 0 && (
        <div className="px-3 py-2 text-sm text-amber-600/50">No recipes found</div>
      )}
    </div>
  );

  // Restaurant picker — shows after selecting "Eat Out"
  const restaurantPicker = (dateKey: string) =>
    restaurantPickerDate === dateKey && (
      <div className="mt-2 bg-amber-50/50 border border-amber-200/60 rounded-xl max-h-80 overflow-y-auto shadow-sm">
        <div className="p-2.5 sticky top-0 bg-amber-50/80 backdrop-blur-sm border-b border-amber-200/40">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-display text-amber-800 flex items-center gap-1">
              <Store className="size-3.5" /> Pick a restaurant
            </span>
            <button onClick={() => { setRestaurantPickerDate(null); setRestaurantSearch(""); }} className="text-amber-400 hover:text-amber-600 p-2 -m-1">
              <X className="size-4" />
            </button>
          </div>
          <input
            type="text"
            value={restaurantSearch}
            onChange={(e) => setRestaurantSearch(e.target.value)}
            placeholder="Search restaurants..."
            className="w-full font-display text-base sm:text-sm px-3 py-2.5 border border-amber-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400"
          />
        </div>
        {filteredRestaurants?.map((r) => (
          <button
            key={r.id}
            onClick={() => assignRestaurant(dateKey, r.id)}
            className="w-full text-left px-3 py-3 text-sm font-display hover:bg-amber-100/50 text-amber-900 active:bg-amber-100 min-h-[44px] transition-colors"
          >
            {r.name}
            {r.cuisine && (
              <span className="text-xs text-amber-600/60 ml-2">{r.cuisine}</span>
            )}
          </button>
        ))}
        {filteredRestaurants?.length === 0 && (
          <div className="px-3 py-2 text-sm text-amber-600/50">No restaurants found</div>
        )}
      </div>
    );

  return (
    <div className="w-full">
      {/* Nav */}
      <div className="flex items-center justify-center gap-1 mb-3">
        <button onClick={prev} className="p-2 text-amber-400 hover:text-amber-600 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors">
          <ChevronLeft className="size-5" />
        </button>
        <div className="text-center min-w-[160px]">
          <h2 className="text-sm font-display text-amber-900">{headerLabel}</h2>
          {showBackToToday && (
            <button onClick={goToday} className="text-xs font-display text-amber-500 hover:text-amber-600 mt-0.5 transition-colors">
              Back to today
            </button>
          )}
        </div>
        <button onClick={next} className="p-2 text-amber-400 hover:text-amber-600 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors">
          <ChevronRight className="size-5" />
        </button>
      </div>

      {/* View toggle */}
      <div className="flex justify-end mb-2">
        <div className="inline-flex rounded-lg border border-amber-200 overflow-hidden">
          <button
            onClick={() => setView("2week")}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-display transition-colors min-h-[36px] ${view === "2week" ? "bg-amber-100 text-amber-700" : "text-amber-500/60 hover:text-amber-700 hover:bg-amber-50"}`}
          >
            <CalendarRange className="size-3.5" />
            2 Week
          </button>
          <button
            onClick={() => setView("month")}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-display transition-colors min-h-[36px] ${view === "month" ? "bg-amber-100 text-amber-700" : "text-amber-500/60 hover:text-amber-700 hover:bg-amber-50"}`}
          >
            <CalendarDays className="size-3.5" />
            Month
          </button>
        </div>
      </div>

      {view === "2week" ? (
        <>
          {/* MOBILE: list layout with inline picker */}
          <div className="sm:hidden space-y-1.5">
            {twoWeekDays.map((date) => {
              const key = toDateKey(date);
              const isToday = key === todayKey;
              const isPast = key < todayKey;
              const entry = history[key];
              const recipeId = entry?.recipeId;
              const restaurantId = entry?.restaurantId;
              const recipeName = recipeId ? getRecipeName(recipeId) : undefined;
              const restaurantName = restaurantId ? getRestaurantName(restaurantId) : undefined;
              const isEatOut = recipeId ? isEatOutRecipe(recipeId) : false;
              const isSelected = key === selectedDate;

              return (
                <div key={key}>
                  <div
                    onClick={() => { setSelectedDate(isSelected ? null : key); setSearch(""); }}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-xl border cursor-pointer transition-colors min-h-[52px] shadow-sm
                      ${isSelected ? "border-amber-400 bg-white ring-1 ring-amber-400/30" : ""}
                      ${isToday && !isSelected ? "border-amber-400/60 bg-white shadow-amber-200/50" : ""}
                      ${!isToday && !isSelected ? "border-amber-300/60 bg-white hover:shadow-md" : ""}
                      ${isPast && !isToday && !isSelected ? "opacity-50" : ""}
                    `}
                  >
                    {/* Date column */}
                    <div className="w-12 shrink-0 text-center">
                      <div className={`text-lg font-display leading-tight ${isToday ? "text-amber-600" : "text-amber-800/60"}`}>
                        {date.getDate()}
                      </div>
                      <div className={`text-[11px] leading-tight ${isToday ? "text-amber-500" : "text-amber-600/40"}`}>
                        {DAY_NAMES_SHORT[date.getDay()]}
                      </div>
                    </div>

                    {/* Recipe name */}
                    <div className="flex-1 min-w-0">
                      {recipeName ? (
                        <div>
                          <span className={`text-base font-display ${isPast && !isToday ? "text-amber-700/50" : "text-amber-900"}`}>
                            {recipeName}
                          </span>
                          {restaurantName && (
                            <button
                              onClick={(e) => { e.stopPropagation(); setRestaurantPickerDate(restaurantPickerDate === key ? null : key); setRestaurantSearch(""); }}
                              className="flex items-center gap-1.5 mt-1 text-left"
                            >
                              <Store className="size-3.5 text-amber-600" />
                              <span className="text-sm font-display text-amber-800 font-bold transition-colors">
                                {restaurantName}
                              </span>
                            </button>
                          )}
                        </div>
                      ) : restaurantName ? (
                        <div>
                          <button
                            onClick={(e) => { e.stopPropagation(); setRestaurantPickerDate(restaurantPickerDate === key ? null : key); setRestaurantSearch(""); }}
                            className="flex items-center gap-1.5 text-left"
                          >
                            <Store className="size-3.5 text-amber-600" />
                            <span className="text-sm font-display text-amber-800 font-bold">
                              {restaurantName}
                            </span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-sm font-display text-amber-400">
                          {isPast ? "—" : "Tap to add..."}
                        </span>
                      )}
                    </div>

                    {/* Clear button */}
                    {recipeName && (
                      <button
                        onClick={(e) => { e.stopPropagation(); clearMeal(key); }}
                        className="text-amber-300 hover:text-red-400 p-2 -mr-1 transition-colors shrink-0"
                      >
                        <X className="size-4" />
                      </button>
                    )}
                  </div>

                  {/* Inline recipe picker for this day */}
                  {isSelected && recipePicker}
                  {restaurantPicker(key)}
                </div>
              );
            })}
          </div>

          {/* DESKTOP: 7-column grid */}
          <div className="hidden sm:block">
            <div className="grid grid-cols-7 gap-1 mb-1">
              {twoWeekDays.slice(0, 7).map((date) => (
                <div key={date.getDay()} className="text-center text-xs font-display text-amber-600/50 py-1">
                  {DAY_NAMES_SHORT[date.getDay()]}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {twoWeekDays.map((date) => {
                const key = toDateKey(date);
                const isToday = key === todayKey;
                const isPast = key < todayKey;
                const entry = history[key];
                const recipeId = entry?.recipeId;
                const restaurantId = entry?.restaurantId;
                const recipeName = recipeId ? getRecipeName(recipeId) : undefined;
                const restaurantName = restaurantId ? getRestaurantName(restaurantId) : undefined;
                const isEatOut = recipeId ? isEatOutRecipe(recipeId) : false;
                const isSelected = key === selectedDate;

                return (
                  <div
                    key={key}
                    onClick={() => { setSelectedDate(isSelected ? null : key); setSearch(""); }}
                    className={`
                      relative min-h-[5.5rem] p-2 rounded-xl border
                      cursor-pointer transition-colors hover:bg-amber-50/60
                      ${isSelected ? "border-amber-400 bg-amber-100/60 ring-1 ring-amber-400/30" : ""}
                      ${isToday && !isSelected ? "border-amber-400/60 bg-amber-100/40" : ""}
                      ${!isToday && !isSelected ? "border-amber-200/40" : ""}
                      ${isPast && !isToday && !isSelected ? "opacity-60" : ""}
                    `}
                  >
                    <div className="flex items-start justify-between">
                      <span className={`text-lg font-display leading-tight ${isToday ? "text-amber-600" : "text-amber-800/60"}`}>
                        {date.getDate()}
                      </span>
                      {recipeName && (
                        <button
                          onClick={(e) => { e.stopPropagation(); clearMeal(key); }}
                          className="text-amber-300 hover:text-red-400 p-1 -mr-1 -mt-1 transition-colors min-h-[28px] min-w-[28px] flex items-center justify-center"
                        >
                          <X className="size-3.5" />
                        </button>
                      )}
                    </div>
                    {recipeName && (
                      <div className={`mt-1 text-sm leading-snug line-clamp-2 font-display ${isPast && !isToday ? "text-amber-700/50" : "text-amber-900"}`}>
                        {recipeName}
                      </div>
                    )}
                    {restaurantName && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <Store className="size-3 text-amber-600" />
                        <span className="text-xs line-clamp-1 font-display text-amber-800 font-bold">
                          {restaurantName}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        /* MONTH VIEW — compact grid for both mobile and desktop */
        <>
          <div className="grid grid-cols-7 gap-1 mb-1">
            {DAY_LETTERS.map((d, i) => (
              <div key={i} className="text-center text-xs font-display text-amber-600/50 py-1">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {monthDays.map((date, i) => {
              if (date === null) return <div key={`empty-${i}`} />;

              const key = toDateKey(date);
              const isToday = key === todayKey;
              const isPast = key < todayKey;
              const entry = history[key];
              const recipeId = entry?.recipeId;
              const restaurantId = entry?.restaurantId;
              const recipeName = recipeId ? getRecipeName(recipeId) : undefined;
              const restaurantName = restaurantId ? getRestaurantName(restaurantId) : undefined;
              const isEatOut = recipeId ? isEatOutRecipe(recipeId) : false;
              const isSelected = key === selectedDate;

              return (
                <div
                  key={key}
                  onClick={() => { setSelectedDate(isSelected ? null : key); setSearch(""); }}
                  className={`
                    relative min-h-[3.25rem] sm:min-h-[4rem] p-1.5 rounded-md border
                    cursor-pointer transition-colors hover:bg-amber-50/60
                    ${isSelected ? "border-amber-400 bg-amber-100/60 ring-1 ring-amber-400/30" : ""}
                    ${isToday && !isSelected ? "border-amber-400/60 bg-amber-100/40" : ""}
                    ${!isToday && !isSelected ? "border-amber-200/40" : ""}
                    ${isPast && !isToday && !isSelected ? "opacity-60" : ""}
                  `}
                >
                  <span className={`text-xs sm:text-sm font-display leading-tight ${isToday ? "text-amber-600" : "text-amber-800/60"}`}>
                    {date.getDate()}
                  </span>
                  {recipeName && (
                    <div className={`mt-0.5 text-[10px] sm:text-xs leading-snug line-clamp-2 font-display ${isPast && !isToday ? "text-amber-700/50" : "text-amber-900"}`}>
                      {recipeName}
                    </div>
                  )}
                  {restaurantName && (
                    <div className="text-[9px] sm:text-[10px] line-clamp-1 mt-0.5 font-display text-amber-800 font-bold">
                      {restaurantName}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Picker for desktop grid / month view (mobile 2-week uses inline picker above) */}
      <div className={view === "2week" ? "hidden sm:block" : ""}>
        {recipePicker}
      </div>

      {/* Restaurant picker for desktop / month view */}
      {restaurantPickerDate && (
        <div className={view === "2week" ? "hidden sm:block" : ""}>
          {restaurantPicker(restaurantPickerDate)}
        </div>
      )}
    </div>
  );
}
