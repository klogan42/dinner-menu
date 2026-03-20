import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the DB
const mockFindOne = vi.fn();
const mockInsertOne = vi.fn();
const mockCollection = vi.fn(() => ({
  findOne: mockFindOne,
  insertOne: mockInsertOne,
}));
const mockDb = { collection: mockCollection } as any;

// Import after mocking
import { seedNewUser } from "@/lib/seed-user";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("seedNewUser", () => {
  it("creates Eat Out and Leftovers recipes for new user", async () => {
    mockFindOne.mockResolvedValue(null); // no existing recipes

    await seedNewUser(mockDb, "user123");

    expect(mockInsertOne).toHaveBeenCalledTimes(2);

    const eatOutCall = mockInsertOne.mock.calls[0][0];
    expect(eatOutCall.title).toBe("Eat Out");
    expect(eatOutCall.isEatOut).toBe(true);
    expect(eatOutCall.userId).toBe("user123");

    const leftoversCall = mockInsertOne.mock.calls[1][0];
    expect(leftoversCall.title).toBe("Leftovers");
    expect(leftoversCall.isLeftovers).toBe(true);
    expect(leftoversCall.userId).toBe("user123");
  });

  it("skips Eat Out if already exists", async () => {
    mockFindOne
      .mockResolvedValueOnce({ title: "Eat Out" }) // Eat Out exists
      .mockResolvedValueOnce(null); // Leftovers doesn't

    await seedNewUser(mockDb, "user123");

    expect(mockInsertOne).toHaveBeenCalledTimes(1);
    expect(mockInsertOne.mock.calls[0][0].title).toBe("Leftovers");
  });

  it("skips Leftovers if already exists", async () => {
    mockFindOne
      .mockResolvedValueOnce(null) // Eat Out doesn't exist
      .mockResolvedValueOnce({ title: "Leftovers" }); // Leftovers exists

    await seedNewUser(mockDb, "user123");

    expect(mockInsertOne).toHaveBeenCalledTimes(1);
    expect(mockInsertOne.mock.calls[0][0].title).toBe("Eat Out");
  });

  it("skips both if both already exist", async () => {
    mockFindOne.mockResolvedValue({ title: "exists" });

    await seedNewUser(mockDb, "user123");

    expect(mockInsertOne).not.toHaveBeenCalled();
  });

  it("sets correct default fields on seeded recipes", async () => {
    mockFindOne.mockResolvedValue(null);

    await seedNewUser(mockDb, "user123");

    for (const call of mockInsertOne.mock.calls) {
      const doc = call[0];
      expect(doc.description).toBe("");
      expect(doc.ingredients).toEqual([]);
      expect(doc.steps).toEqual([]);
      expect(doc.prepTimeMinutes).toBe(0);
      expect(doc.cookTimeMinutes).toBe(0);
      expect(doc.servings).toBe(1);
      expect(doc.isFavorite).toBe(false);
      expect(doc.createdAt).toBeInstanceOf(Date);
    }
  });
});
