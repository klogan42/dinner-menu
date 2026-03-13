import { Recipe } from "./types";

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  if (res.status === 204) return undefined as T;
  const text = await res.text();
  if (!text) return undefined as T;
  return JSON.parse(text);
}

export const api = {
  getRecipes: () => fetchJson<Recipe[]>("/api/recipes"),

  getRecipe: (id: string) => fetchJson<Recipe>(`/api/recipes/${id}`),

  createRecipe: (recipe: Omit<Recipe, "id" | "createdAt">) =>
    fetchJson<Recipe>("/api/recipes", {
      method: "POST",
      body: JSON.stringify(recipe),
    }),

  updateRecipe: (id: string, recipe: Omit<Recipe, "id" | "createdAt">) =>
    fetchJson<Recipe>(`/api/recipes/${id}`, {
      method: "PUT",
      body: JSON.stringify(recipe),
    }),

  deleteRecipe: (id: string) =>
    fetchJson<void>(`/api/recipes/${id}`, { method: "DELETE" }),

  toggleFavorite: (id: string) =>
    fetchJson<Recipe>(`/api/recipes/${id}/favorite`, { method: "PATCH" }),

  getRandomRecipes: () => fetchJson<Recipe[]>("/api/recipes/random"),

  getMealHistory: (year: number, month: number) =>
    fetchJson<Record<string, string>>(`/api/mealhistory?year=${year}&month=${month}`),

  setMealHistory: (date: string, recipeId: string | null) =>
    fetchJson<void>(`/api/mealhistory/${date}`, {
      method: "PUT",
      body: JSON.stringify({ recipeId }),
    }),
};
