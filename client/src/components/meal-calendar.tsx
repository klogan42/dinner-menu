"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useMealHistory, useRecipes, useSetMealHistory } from "@/lib/hooks";

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);
  return days;
}

function formatKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function MealCalendar() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const { data: history = {} } = useMealHistory(year, month + 1);
  const { data: recipes } = useRecipes();
  const setMealHistory = useSetMealHistory();

  const days = getCalendarDays(year, month);
  const todayKey = formatKey(now.getFullYear(), now.getMonth(), now.getDate());

  const getRecipeName = (recipeId: string) =>
    recipes?.find((r) => r.id === recipeId)?.title;

  const prev = () => {
    if (month === 0) { setYear(year - 1); setMonth(11); }
    else setMonth(month - 1);
    setSelectedDate(null);
  };

  const next = () => {
    if (month === 11) { setYear(year + 1); setMonth(0); }
    else setMonth(month + 1);
    setSelectedDate(null);
  };

  const assignMeal = (recipeId: string) => {
    if (!selectedDate) return;
    setMealHistory.mutate({ date: selectedDate, recipeId });
    setSelectedDate(null);
    setSearch("");
  };

  const clearMeal = (dateKey: string) => {
    setMealHistory.mutate({ date: dateKey, recipeId: null });
  };

  const filteredRecipes = recipes?.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase())
  );

  const monthLabel = new Date(year, month).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="w-full">
      {/* Month nav */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={prev} className="p-2 text-stone-400 hover:text-amber-700 min-h-[44px] min-w-[44px] flex items-center justify-center">
          <ChevronLeft className="size-5" />
        </button>
        <h2 className="text-sm font-semibold text-amber-900">{monthLabel}</h2>
        <button onClick={next} className="p-2 text-stone-400 hover:text-amber-700 min-h-[44px] min-w-[44px] flex items-center justify-center">
          <ChevronRight className="size-5" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-px mb-1">
        {DAY_LABELS.map((d, i) => (
          <div key={i} className="text-center text-xs font-medium text-stone-400 py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-px">
        {days.map((day, i) => {
          if (day === null) return <div key={i} />;

          const key = formatKey(year, month, day);
          const isToday = key === todayKey;
          const isFuture = key > todayKey;
          const recipeId = history[key];
          const recipeName = recipeId ? getRecipeName(recipeId) : undefined;
          const isSelected = key === selectedDate;

          return (
            <div
              key={i}
              onClick={() => { setSelectedDate(isSelected ? null : key); setSearch(""); }}
              className={`
                relative min-h-[3.5rem] sm:min-h-[4.5rem] p-1 rounded-md text-xs border
                cursor-pointer transition-colors hover:bg-amber-100/40
                ${isSelected ? "border-amber-500 bg-amber-100/80 ring-1 ring-amber-400" : ""}
                ${isToday && !isSelected ? "border-amber-400 bg-amber-100/60" : ""}
                ${!isToday && !isSelected ? "border-transparent" : ""}
                ${recipeName && !isSelected && !isFuture ? "bg-amber-50" : ""}
              `}
            >
              <div className="flex items-start justify-between">
                <span className={`font-medium ${isToday ? "text-amber-700" : "text-stone-500"}`}>
                  {day}
                </span>
                {recipeName && (
                  <button
                    onClick={(e) => { e.stopPropagation(); clearMeal(key); }}
                    className="text-stone-300 hover:text-red-400 p-1.5 -mr-1 -mt-1"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>
              {recipeName && (
                <div className={`mt-0.5 text-xs leading-tight line-clamp-2 ${isFuture ? "text-stone-400 italic" : "text-stone-600"}`}>
                  {recipeName}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Recipe picker for selected date */}
      {selectedDate && (
        <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg max-h-52 overflow-y-auto">
          <div className="p-2 sticky top-0 bg-amber-50 border-b border-amber-100">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-amber-800">
                {new Date(selectedDate + "T00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
              </span>
              <button onClick={() => { setSelectedDate(null); setSearch(""); }} className="text-stone-400 hover:text-stone-600">
                <X className="size-3.5" />
              </button>
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search recipes..."
              className="w-full text-sm px-3 py-2.5 border border-amber-200 rounded bg-amber-50 focus:outline-none focus:ring-1 focus:ring-amber-400"
              autoFocus
            />
          </div>
          {filteredRecipes?.map((r) => (
            <button
              key={r.id}
              onClick={() => assignMeal(r.id)}
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
  );
}
