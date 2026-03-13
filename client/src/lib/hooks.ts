"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "./api";
import { Recipe } from "./types";

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

export function useSetMealHistory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ date, recipeId }: { date: string; recipeId: string | null }) =>
      api.setMealHistory(date, recipeId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["mealhistory"] }),
  });
}
