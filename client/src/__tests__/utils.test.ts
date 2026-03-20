import { describe, it, expect } from "vitest";
import { toDateKey } from "@/lib/utils";

describe("toDateKey", () => {
  it("formats a date as YYYY-MM-DD", () => {
    const date = new Date(2026, 2, 19); // March 19, 2026
    expect(toDateKey(date)).toBe("2026-03-19");
  });

  it("pads single-digit months and days", () => {
    const date = new Date(2026, 0, 5); // Jan 5, 2026
    expect(toDateKey(date)).toBe("2026-01-05");
  });

  it("handles December correctly", () => {
    const date = new Date(2026, 11, 31); // Dec 31, 2026
    expect(toDateKey(date)).toBe("2026-12-31");
  });

  it("handles leap year", () => {
    const date = new Date(2028, 1, 29); // Feb 29, 2028
    expect(toDateKey(date)).toBe("2028-02-29");
  });
});
