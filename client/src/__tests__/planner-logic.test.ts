import { describe, it, expect } from "vitest";
import { toDateKey } from "@/lib/utils";
import { DAYS } from "@/lib/types";

// Replicate getWeekDays logic from planner-content
function getWeekDays() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayKey = toDateKey(today);

  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  const past: { day: string; dateKey: string; isPast: boolean }[] = [];
  for (let d = new Date(weekStart); d < today; d.setDate(d.getDate() + 1)) {
    const date = new Date(d);
    past.push({ day: DAYS[date.getDay()], dateKey: toDateKey(date), isPast: true });
  }

  const current = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateKey = toDateKey(date);
    return { day: DAYS[date.getDay()], dateKey, isPast: false };
  });

  return { past, current };
}

describe("getWeekDays logic", () => {
  it("returns 7 current days starting from today", () => {
    const { current } = getWeekDays();
    expect(current).toHaveLength(7);
    expect(current[0].dateKey).toBe(toDateKey(new Date()));
    expect(current[0].isPast).toBe(false);
  });

  it("past days are all before today", () => {
    const { past } = getWeekDays();
    const todayKey = toDateKey(new Date());
    for (const d of past) {
      expect(d.dateKey < todayKey).toBe(true);
      expect(d.isPast).toBe(true);
    }
  });

  it("past + current covers from Sunday to today+6", () => {
    const { past, current } = getWeekDays();
    const total = past.length + current.length;
    // Should be between 7 (Sunday) and 13 (Saturday + 7 forward)
    expect(total).toBeGreaterThanOrEqual(7);
    expect(total).toBeLessThanOrEqual(13);
  });

  it("first past day is a Sunday", () => {
    const { past } = getWeekDays();
    if (past.length > 0) {
      expect(past[0].day).toBe("Sunday");
    }
  });
});

// Replicate formatLastAte logic
function formatLastAte(cooked: Record<string, string[]>, recipeId: string, todayStr: string) {
  const last = cooked[recipeId]?.[0];
  if (!last || last > todayStr) return null;
  return new Date(last + "T00:00").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

describe("formatLastAte logic", () => {
  const today = "2026-03-19";

  it("returns null if never cooked", () => {
    expect(formatLastAte({}, "recipe1", today)).toBeNull();
  });

  it("returns null if only future dates", () => {
    expect(formatLastAte({ recipe1: ["2026-03-25"] }, "recipe1", today)).toBeNull();
  });

  it("returns formatted date for past cook", () => {
    const result = formatLastAte({ recipe1: ["2026-03-15"] }, "recipe1", today);
    expect(result).toBeTruthy();
    expect(result).toContain("Mar");
    expect(result).toContain("15");
  });

  it("returns today's date if cooked today", () => {
    const result = formatLastAte({ recipe1: ["2026-03-19"] }, "recipe1", today);
    expect(result).toBeTruthy();
    expect(result).toContain("19");
  });
});
