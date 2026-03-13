"use client";

import Link from "next/link";
import { Clock, Star, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Recipe } from "@/lib/types";
import { useToggleFavorite } from "@/lib/hooks";
import { theme } from "@/lib/styles";

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  const toggleFav = useToggleFavorite();
  const totalTime = recipe.prepTimeMinutes + recipe.cookTimeMinutes;

  return (
    <Card className={`${theme.card} hover:shadow-md transition-shadow`}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/recipes/${recipe.id}`} className="flex-1">
            <CardTitle className={`${theme.cardTitle} hover:text-amber-700 transition-colors text-base font-display`}>
              {recipe.title}
            </CardTitle>
          </Link>
          <button
            onClick={() => toggleFav.mutate(recipe.id)}
            className="text-amber-400 hover:text-amber-500 transition-colors shrink-0 p-2 -m-1 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <Star className="size-5" fill={recipe.isFavorite ? "currentColor" : "none"} />
          </button>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className={`text-sm ${theme.muted} mb-3 line-clamp-2`}>
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

        <div className="flex flex-wrap gap-1">
          {recipe.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className={theme.tag}>
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
