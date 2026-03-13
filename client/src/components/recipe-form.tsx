"use client";

import { useState, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Recipe, Ingredient } from "@/lib/types";
import { useCreateRecipe, useUpdateRecipe } from "@/lib/hooks";
import { theme } from "@/lib/styles";

interface RecipeFormProps {
  recipe?: Recipe;
}

const emptyIngredient = (): Ingredient => ({ name: "", amount: "", unit: "" });

export function RecipeForm({ recipe }: RecipeFormProps) {
  const router = useRouter();
  const createRecipe = useCreateRecipe();
  const updateRecipe = useUpdateRecipe();

  const [title, setTitle] = useState(recipe?.title ?? "");
  const [description, setDescription] = useState(recipe?.description ?? "");
  const [tags, setTags] = useState<string[]>(recipe?.tags ?? []);
  const [tagInput, setTagInput] = useState("");
  const [ingredients, setIngredients] = useState<Ingredient[]>(
    recipe?.ingredients?.length ? recipe.ingredients : [emptyIngredient()]
  );
  const [steps, setSteps] = useState<string[]>(
    recipe?.steps?.length ? recipe.steps : [""]
  );
  const [prepTime, setPrepTime] = useState(recipe?.prepTimeMinutes ?? 0);
  const [cookTime, setCookTime] = useState(recipe?.cookTimeMinutes ?? 0);
  const [servings, setServings] = useState(recipe?.servings ?? 4);

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (!tags.includes(newTag)) setTags([...tags, newTag]);
      setTagInput("");
    }
  };

  const updateIngredient = (i: number, field: keyof Ingredient, value: string) => {
    const updated = [...ingredients];
    updated[i] = { ...updated[i], [field]: value };
    setIngredients(updated);
  };

  const updateStep = (i: number, value: string) => {
    const updated = [...steps];
    updated[i] = value;
    setSteps(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      title,
      description,
      tags,
      ingredients: ingredients.filter((i) => i.name.trim()),
      steps: steps.filter((s) => s.trim()),
      prepTimeMinutes: prepTime,
      cookTimeMinutes: cookTime,
      servings,
      isFavorite: recipe?.isFavorite ?? false,
    };

    if (recipe) {
      await updateRecipe.mutateAsync({ id: recipe.id, recipe: data });
      router.push(`/recipes/${recipe.id}`);
    } else {
      const created = await createRecipe.mutateAsync(data);
      router.push(`/recipes/${created.id}`);
    }
  };

  const isSubmitting = createRecipe.isPending || updateRecipe.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Details */}
      <Card className={theme.card}>
        <CardHeader>
          <CardTitle className={theme.cardTitle}>Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's for dinner?"
              required
              className={theme.input}
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A short description..."
              rows={2}
              className={theme.input}
            />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            <div>
              <Label htmlFor="prepTime">Prep (min)</Label>
              <Input id="prepTime" type="number" min={0} value={prepTime} onChange={(e) => setPrepTime(Number(e.target.value))} className={theme.input} />
            </div>
            <div>
              <Label htmlFor="cookTime">Cook (min)</Label>
              <Input id="cookTime" type="number" min={0} value={cookTime} onChange={(e) => setCookTime(Number(e.target.value))} className={theme.input} />
            </div>
            <div>
              <Label htmlFor="servings">Servings</Label>
              <Input id="servings" type="number" min={1} value={servings} onChange={(e) => setServings(Number(e.target.value))} className={theme.input} />
            </div>
          </div>
          <div>
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {tags.map((tag) => (
                <Badge key={tag} className="bg-amber-100 text-amber-800 gap-1 px-2.5 py-1 text-sm">
                  {tag}
                  <button type="button" onClick={() => setTags(tags.filter((t) => t !== tag))} className="p-0.5">
                    <X className="size-3.5" />
                  </button>
                </Badge>
              ))}
            </div>
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="Type a tag and press Enter"
              className={theme.input}
            />
          </div>
        </CardContent>
      </Card>

      {/* Ingredients */}
      <Card className={theme.card}>
        <CardHeader>
          <CardTitle className={theme.cardTitle}>Ingredients</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {ingredients.map((ing, i) => (
            <div key={i} className="flex flex-col sm:flex-row gap-2 sm:items-end border-b border-amber-100 pb-3 sm:border-0 sm:pb-0 last:border-0 last:pb-0">
              <div className="flex-1">
                <Label className="sm:hidden">Name</Label>
                {i === 0 && <Label className="hidden sm:block">Name</Label>}
                <Input value={ing.name} onChange={(e) => updateIngredient(i, "name", e.target.value)} placeholder="Ingredient" className={theme.input} />
              </div>
              <div className="flex gap-2 items-end">
                <div className="flex-1 sm:w-20 sm:flex-none">
                  <Label className="sm:hidden">Amount</Label>
                  {i === 0 && <Label className="hidden sm:block">Amt</Label>}
                  <Input value={ing.amount} onChange={(e) => updateIngredient(i, "amount", e.target.value)} placeholder="1" className={theme.input} />
                </div>
                <div className="flex-1 sm:w-20 sm:flex-none">
                  <Label className="sm:hidden">Unit</Label>
                  {i === 0 && <Label className="hidden sm:block">Unit</Label>}
                  <Input value={ing.unit} onChange={(e) => updateIngredient(i, "unit", e.target.value)} placeholder="cup" className={theme.input} />
                </div>
                {ingredients.length > 1 && (
                  <Button type="button" variant="ghost" size="icon" onClick={() => setIngredients(ingredients.filter((_, j) => j !== i))} className="text-stone-400 hover:text-red-500 shrink-0 min-h-[44px] min-w-[44px]">
                    <Trash2 className="size-5" />
                  </Button>
                )}
              </div>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={() => setIngredients([...ingredients, emptyIngredient()])} className={`${theme.buttonOutline} min-h-[44px]`}>
            <Plus className="size-4" /> Add Ingredient
          </Button>
        </CardContent>
      </Card>

      {/* Steps */}
      <Card className={theme.card}>
        <CardHeader>
          <CardTitle className={theme.cardTitle}>Steps</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-2 items-start">
              <span className="text-base font-display text-amber-600 mt-2.5 w-6 text-right shrink-0">
                {i + 1}.
              </span>
              <Textarea value={step} onChange={(e) => updateStep(i, e.target.value)} placeholder="Describe this step..." rows={2} className={`flex-1 text-base ${theme.input}`} />
              {steps.length > 1 && (
                <Button type="button" variant="ghost" size="icon" onClick={() => setSteps(steps.filter((_, j) => j !== i))} className="text-stone-400 hover:text-red-500 shrink-0 mt-1 min-h-[44px] min-w-[44px]">
                  <Trash2 className="size-5" />
                </Button>
              )}
            </div>
          ))}
          <Button type="button" variant="outline" onClick={() => setSteps([...steps, ""])} className={`${theme.buttonOutline} min-h-[44px]`}>
            <Plus className="size-4" /> Add Step
          </Button>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting} className={`${theme.buttonPrimary} min-h-[44px] px-6`}>
          {isSubmitting ? "Saving..." : recipe ? "Update Recipe" : "Create Recipe"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()} className={`${theme.buttonOutline} min-h-[44px] px-6`}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
