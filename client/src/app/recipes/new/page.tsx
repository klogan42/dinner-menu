"use client";

import { RecipeForm } from "@/components/recipe-form";
import { theme } from "@/lib/styles";

export default function NewRecipePage() {
  return (
    <div>
      <h1 className={`${theme.heading} mb-6`}>Add New Recipe</h1>
      <RecipeForm />
    </div>
  );
}
