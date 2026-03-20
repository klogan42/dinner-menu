import { describe, it, expect } from "vitest";

// Test the date range logic used in /api/mealhistory
function getMonthDateRange(year: number, month: number) {
  const lastDay = new Date(year, month, 0).getDate();
  const from = `${year}-${String(month).padStart(2, "0")}-01`;
  const to = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
  return { from, to };
}

describe("meal history date range", () => {
  it("handles January (31 days)", () => {
    const { from, to } = getMonthDateRange(2026, 1);
    expect(from).toBe("2026-01-01");
    expect(to).toBe("2026-01-31");
  });

  it("handles February non-leap year (28 days)", () => {
    const { from, to } = getMonthDateRange(2026, 2);
    expect(from).toBe("2026-02-01");
    expect(to).toBe("2026-02-28");
  });

  it("handles February leap year (29 days)", () => {
    const { from, to } = getMonthDateRange(2028, 2);
    expect(from).toBe("2028-02-01");
    expect(to).toBe("2028-02-29");
  });

  it("handles April (30 days)", () => {
    const { from, to } = getMonthDateRange(2026, 4);
    expect(from).toBe("2026-04-01");
    expect(to).toBe("2026-04-30");
  });

  it("handles September (30 days)", () => {
    const { from, to } = getMonthDateRange(2026, 9);
    expect(from).toBe("2026-09-01");
    expect(to).toBe("2026-09-30");
  });

  it("handles December (31 days)", () => {
    const { from, to } = getMonthDateRange(2026, 12);
    expect(from).toBe("2026-12-01");
    expect(to).toBe("2026-12-31");
  });
});
