import { describe, it, expect } from "vitest";
import { DAYS } from "@/lib/types";

describe("DAYS constant", () => {
  it("has 7 days", () => {
    expect(DAYS).toHaveLength(7);
  });

  it("starts with Sunday", () => {
    expect(DAYS[0]).toBe("Sunday");
  });

  it("ends with Saturday", () => {
    expect(DAYS[6]).toBe("Saturday");
  });

  it("matches JavaScript Date.getDay() order", () => {
    // Date.getDay() returns 0 for Sunday, 6 for Saturday
    const sunday = new Date(2026, 2, 15); // Mar 15, 2026 is a Sunday
    expect(DAYS[sunday.getDay()]).toBe("Sunday");

    const wednesday = new Date(2026, 2, 18);
    expect(DAYS[wednesday.getDay()]).toBe("Wednesday");
  });
});
