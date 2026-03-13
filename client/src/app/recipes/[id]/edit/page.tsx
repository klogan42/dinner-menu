"use client";

import { use } from "react";
import { RecipeForm } from "@/components/recipe-form";
import { useRecipe } from "@/lib/hooks";
import { theme } from "@/lib/styles";

export default function EditRecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: recipe, isLoading } = useRecipe(id);

  if (isLoading) return <div className={theme.empty}>Loading recipe...</div>;
  if (!recipe) return <div className={theme.empty}>Recipe not found.</div>;

  return (
    <div>
      <h1 className={`${theme.heading} mb-6`}>Edit Recipe</h1>
      <RecipeForm recipe={recipe} />
    </div>
  );
}
