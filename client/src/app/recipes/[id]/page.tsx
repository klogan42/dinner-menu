"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Clock, Users, Star, Pencil, Trash2, ArrowLeft, CalendarPlus, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRecipe, useDeleteRecipe, useToggleFavorite, useMealHistory, useSetMealHistory, useRecipeHistory } from "@/lib/hooks";
import { theme } from "@/lib/styles";
import { toDateKey } from "@/lib/utils";

function getWeekDateKeys() {
  const today = new Date();
  const keys: string[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    keys.push(toDateKey(date));
  }
  return keys;
}

export default function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: recipe, isLoading } = useRecipe(id);
  const deleteRecipe = useDeleteRecipe();
  const toggleFav = useToggleFavorite();
  const now = new Date();
  const { data: history = {} } = useMealHistory(now.getFullYear(), now.getMonth() + 1);
  const setMealHistory = useSetMealHistory();
  const { data: recipeHistory } = useRecipeHistory(id);

  if (isLoading) return <div className={theme.empty}>Loading recipe...</div>;
  if (!recipe) return <div className={theme.empty}>Recipe not found.</div>;

  const totalTime = recipe.prepTimeMinutes + recipe.cookTimeMinutes;

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this recipe?")) {
      await deleteRecipe.mutateAsync(recipe.id);
      router.push("/recipes");
    }
  };

  const handleAddToWeek = () => {
    const weekKeys = getWeekDateKeys();
    const emptyDate = weekKeys.find((k) => !history[k]?.recipeId);
    if (emptyDate) {
      setMealHistory.mutate({ date: emptyDate, recipeId: recipe.id });
      router.push("/");
    } else {
      alert("All days are filled! Clear a day first.");
    }
  };

  return (
    <div className="w-full min-w-0">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4 font-display text-amber-700 hover:text-amber-900 min-h-[44px]">
        <ArrowLeft className="size-4" /> Back
      </Button>

      {/* Title + favorite */}
      <div className="mb-4">
        <div className="flex items-start gap-2 mb-1">
          <h1 className="text-2xl font-display text-amber-900 break-words min-w-0">
            {recipe.title}
          </h1>
          <button onClick={() => toggleFav.mutate(recipe.id)} className="text-amber-400 hover:text-amber-500 shrink-0 p-2 -m-1 min-h-[44px] min-w-[44px] flex items-center justify-center">
            <Star className="size-5 sm:size-6" fill={recipe.isFavorite ? "currentColor" : "none"} />
          </button>
        </div>
        <p className={`text-base ${theme.muted}`}>{recipe.description}</p>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {recipe.tags.map((tag) => (
            <Badge key={tag} className={theme.tag}>{tag}</Badge>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Button variant="outline" onClick={handleAddToWeek} className={`${theme.buttonOutline} font-display min-h-[44px]`}>
          <CalendarPlus className="size-4" /> Add to Week
        </Button>
        <Link href={`/recipes/${recipe.id}/edit`}>
          <Button variant="outline" className={`${theme.buttonOutline} font-display min-h-[44px]`}>
            <Pencil className="size-4" /> Edit
          </Button>
        </Link>
        <Button variant="destructive" onClick={handleDelete} className="font-display min-h-[44px]">
          <Trash2 className="size-4" /> Delete
        </Button>
      </div>

      {/* Time + servings */}
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3 sm:gap-4 font-display text-base sm:text-sm text-amber-800/70 mb-6">
        <span className="flex items-center gap-1"><Clock className="size-3.5" /> Prep: {recipe.prepTimeMinutes}m</span>
        <span className="flex items-center gap-1"><Clock className="size-3.5" /> Cook: {recipe.cookTimeMinutes}m</span>
        <span className="font-display text-amber-700">Total: {totalTime}m</span>
        <span className="flex items-center gap-1"><Users className="size-3.5" /> {recipe.servings} servings</span>
      </div>

      {/* Ingredients + Steps */}
      <div className="grid gap-4 md:grid-cols-2 md:gap-6">
        <Card className={theme.card}>
          <CardHeader className="pb-2">
            <CardTitle className={`${theme.cardTitle} text-base`}>Ingredients</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {recipe.ingredients.map((ing, i) => (
                <li key={i} className="text-base text-amber-900">
                  <span className="font-display">{ing.amount} {ing.unit}</span> {ing.name}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className={theme.card}>
          <CardHeader className="pb-2">
            <CardTitle className={`${theme.cardTitle} text-base`}>Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3">
              {recipe.steps.map((step, i) => (
                <li key={i} className="flex gap-2 text-base text-amber-900">
                  <span className="font-display text-amber-600 shrink-0">{i + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>

      {/* Cooking History */}
      {recipeHistory && recipeHistory.length > 0 && (
        <Card className={`${theme.card} mt-4 md:mt-6`}>
          <CardHeader className="pb-2">
            <CardTitle className={`${theme.cardTitle} text-base flex items-center gap-2`}>
              <History className="size-4" /> History
              <span className="text-sm font-normal text-amber-600/60">
                ({recipeHistory.length} time{recipeHistory.length !== 1 ? "s" : ""})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {recipeHistory.map((entry) => (
                <span
                  key={entry.date}
                  className="text-sm text-amber-800 bg-amber-100/60 px-2.5 py-1 rounded-lg font-display"
                >
                  {new Date(entry.date + "T00:00").toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
