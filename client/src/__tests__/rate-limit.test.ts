import { describe, it, expect, vi, beforeEach } from "vitest";
import { isRateLimited } from "@/lib/rate-limit";

describe("isRateLimited", () => {
  beforeEach(() => {
    // Reset by using unique keys per test
  });

  it("allows requests under the limit", () => {
    const key = `test-${Date.now()}-1`;
    expect(isRateLimited(key, 3, 60000)).toBe(false);
    expect(isRateLimited(key, 3, 60000)).toBe(false);
    expect(isRateLimited(key, 3, 60000)).toBe(false);
  });

  it("blocks requests over the limit", () => {
    const key = `test-${Date.now()}-2`;
    expect(isRateLimited(key, 2, 60000)).toBe(false);
    expect(isRateLimited(key, 2, 60000)).toBe(false);
    expect(isRateLimited(key, 2, 60000)).toBe(true); // 3rd request blocked
  });

  it("resets after window expires", () => {
    const key = `test-${Date.now()}-3`;
    // Use a very short window
    expect(isRateLimited(key, 1, 1)).toBe(false);
    // Wait for window to expire
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        expect(isRateLimited(key, 1, 1)).toBe(false); // Should be reset
        resolve();
      }, 10);
    });
  });

  it("tracks different keys independently", () => {
    const key1 = `test-${Date.now()}-4a`;
    const key2 = `test-${Date.now()}-4b`;
    expect(isRateLimited(key1, 1, 60000)).toBe(false);
    expect(isRateLimited(key1, 1, 60000)).toBe(true); // blocked
    expect(isRateLimited(key2, 1, 60000)).toBe(false); // different key, still allowed
  });
});
