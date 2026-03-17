"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "./api";
import { Recipe, Restaurant } from "./types";

export function useRecipes() {
  return useQuery({ queryKey: ["recipes"], queryFn: api.getRecipes });
}

export function useRecipe(id: string) {
  return useQuery({
    queryKey: ["recipes", id],
    queryFn: () => api.getRecipe(id),
    enabled: !!id,
  });
}

export function useCreateRecipe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (recipe: Omit<Recipe, "id" | "createdAt">) =>
      api.createRecipe(recipe),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["recipes"] }),
  });
}

export function useUpdateRecipe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      recipe,
    }: {
      id: string;
      recipe: Omit<Recipe, "id" | "createdAt">;
    }) => api.updateRecipe(id, recipe),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["recipes"] }),
  });
}

export function useDeleteRecipe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteRecipe(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["recipes"] }),
  });
}

export function useToggleFavorite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.toggleFavorite(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["recipes"] }),
  });
}

export function useMealHistory(year: number, month: number) {
  return useQuery({
    queryKey: ["mealhistory", year, month],
    queryFn: () => api.getMealHistory(year, month),
  });
}

export function useRecipeCooked() {
  return useQuery({ queryKey: ["recipe-cooked"], queryFn: api.getRecipeCooked });
}

export function useRecipeHistory(id: string) {
  return useQuery({
    queryKey: ["recipe-history", id],
    queryFn: () => api.getRecipeHistory(id),
    enabled: !!id,
  });
}

export function useSetMealHistory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ date, recipeId, restaurantId }: { date: string; recipeId: string | null; restaurantId?: string | null }) =>
      api.setMealHistory(date, recipeId, restaurantId),
    onMutate: async ({ date, recipeId, restaurantId }) => {
      // Optimistically update all cached mealhistory queries that contain this date
      const [year, month] = date.split("-").map(Number);
      const queryKey = ["mealhistory", year, month];
      await qc.cancelQueries({ queryKey });
      const previous = qc.getQueryData<Record<string, { recipeId: string; restaurantId?: string }>>(queryKey);
      if (previous) {
        const updated = { ...previous };
        if (recipeId === null) {
          delete updated[date];
        } else {
          updated[date] = { recipeId, ...(restaurantId ? { restaurantId } : {}) };
        }
        qc.setQueryData(queryKey, updated);
      }
      return { previous, queryKey };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        qc.setQueryData(context.queryKey, context.previous);
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["mealhistory"] });
      qc.invalidateQueries({ queryKey: ["restaurant-visits"] });
      qc.invalidateQueries({ queryKey: ["recipe-history"] });
      qc.invalidateQueries({ queryKey: ["recipe-cooked"] });
    },
  });
}

// Restaurant hooks
export function useRestaurants() {
  return useQuery({ queryKey: ["restaurants"], queryFn: api.getRestaurants });
}

export function useRestaurant(id: string) {
  return useQuery({
    queryKey: ["restaurants", id],
    queryFn: () => api.getRestaurant(id),
    enabled: !!id,
  });
}

export function useCreateRestaurant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (restaurant: Omit<Restaurant, "id" | "createdAt">) =>
      api.createRestaurant(restaurant),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["restaurants"] }),
  });
}

export function useUpdateRestaurant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      restaurant,
    }: {
      id: string;
      restaurant: Omit<Restaurant, "id" | "createdAt">;
    }) => api.updateRestaurant(id, restaurant),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["restaurants"] }),
  });
}

export function useDeleteRestaurant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteRestaurant(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["restaurants"] }),
  });
}

export function useRestaurantVisits() {
  return useQuery({ queryKey: ["restaurant-visits"], queryFn: api.getRestaurantVisits });
}

export function useToggleRestaurantFavorite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.toggleRestaurantFavorite(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["restaurants"] }),
  });
}
