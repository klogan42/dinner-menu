"use client";

import Link from "next/link";
import { Clock, Star, Users, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Recipe } from "@/lib/types";
import { useToggleFavorite, useDeleteRecipe } from "@/lib/hooks";
import { theme } from "@/lib/styles";

function formatDate(dateStr: string) {
  return new Date(dateStr + "T00:00").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function RecipeCard({ recipe, cookedDates }: { recipe: Recipe; cookedDates?: string[] }) {
  const toggleFav = useToggleFavorite();
  const deleteRecipe = useDeleteRecipe();
  const totalTime = recipe.prepTimeMinutes + recipe.cookTimeMinutes;
  const today = new Date().toISOString().slice(0, 10);
  const recentDates = cookedDates?.filter((d) => d <= today).slice(0, 5) ?? [];

  return (
    <Card className={`${theme.card} hover:shadow-md transition-shadow`}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/recipes/${recipe.id}`} className="flex-1">
            <CardTitle className={`${theme.cardTitle} hover:text-amber-700 transition-colors text-base font-display`}>
              {recipe.title}
            </CardTitle>
          </Link>
          <div className="flex items-center shrink-0">
            <button
              onClick={() => toggleFav.mutate(recipe.id)}
              className="text-amber-400 hover:text-amber-500 transition-colors p-2 -m-1 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <Star className="size-5" fill={recipe.isFavorite ? "currentColor" : "none"} />
            </button>
            {!recipe.isEatOut && !recipe.isLeftovers && (
            <button
              onClick={() => { if (confirm(`Delete "${recipe.title}"?`)) deleteRecipe.mutate(recipe.id); }}
              className="text-amber-900 hover:text-red-500 transition-colors p-2 -m-1 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <Trash2 className="size-4" />
            </button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-sm font-display text-amber-900 mb-3 line-clamp-2">
          {recipe.description}
        </p>

        <div className={`flex items-center gap-3 text-xs ${theme.muted} mb-3`}>
          <span className="flex items-center gap-1">
            <Clock className="size-3.5" /> {totalTime} min
          </span>
          <span className="flex items-center gap-1">
            <Users className="size-3.5" /> {recipe.servings}
          </span>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {recipe.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className={theme.tag}>
              {tag}
            </Badge>
          ))}
        </div>

        {recentDates.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {recentDates.map((date) => (
              <span key={date} className="text-xs text-amber-700 bg-amber-100/50 px-2 py-0.5 rounded-md font-display">
                {formatDate(date)}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
