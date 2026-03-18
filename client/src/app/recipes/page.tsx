"use client";

import { useState, useMemo } from "react";
import { Search, Clock, Star, Hourglass } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RecipeCard } from "@/components/recipe-card";
import { useRecipes, useRecipeCooked } from "@/lib/hooks";
import { theme } from "@/lib/styles";
import { cn } from "@/lib/utils";

const ALL_TAGS = ["quick", "crockpot", "grill", "pasta", "soup"];

type SortMode = "default" | "lastCooked";

export default function RecipesPage() {
  const { data: recipes, isLoading } = useRecipes();
  const { data: cooked = {} } = useRecipeCooked();
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortMode, setSortMode] = useState<SortMode>("default");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [overdue, setOverdue] = useState(false);

  const toggleTag = (tag: string) =>
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );

  const sorted = useMemo(() => {
    if (!recipes) return [];

    let list = recipes.filter((r) => {
      const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase());
      const matchesTags =
        selectedTags.length === 0 || selectedTags.some((t) => r.tags.includes(t));
      const matchesFavorites = !favoritesOnly || r.isFavorite;
      return matchesSearch && matchesTags && matchesFavorites;
    });

    // Filter to recipes not cooked in 30+ days (or never cooked)
    if (overdue) {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 30);
      const cutoffStr = cutoff.toISOString().slice(0, 10);
      list = list.filter((r) => {
        const lastCooked = cooked[r.id]?.[0];
        return !lastCooked || lastCooked <= cutoffStr;
      });
    }

    // Sort by last cooked
    if (sortMode === "lastCooked") {
      list = [...list].sort((a, b) => {
        const aDate = cooked[a.id]?.[0] ?? "";
        const bDate = cooked[b.id]?.[0] ?? "";
        if (!aDate && !bDate) return 0;
        if (!aDate) return 1;
        if (!bDate) return -1;
        return bDate.localeCompare(aDate);
      });
    }

    return list;
  }, [recipes, search, selectedTags, sortMode, favoritesOnly, overdue, cooked]);

  if (isLoading) return <div className={theme.empty}>Loading recipes...</div>;

  return (
    <div>
      <h1 className={`${theme.heading} mb-6`}>Recipes</h1>

      <div className="mb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-stone-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search recipes..."
            className={`w-full pl-9 pr-4 py-2.5 ${theme.input} border text-sm`}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <button
          onClick={() => setSortMode(sortMode === "lastCooked" ? "default" : "lastCooked")}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-display rounded-full border transition-colors ${
            sortMode === "lastCooked"
              ? "bg-amber-500 text-white border-amber-500"
              : "border-amber-200 text-amber-800 hover:bg-amber-50"
          }`}
        >
          <Clock className="size-3.5" />
          Last Cooked
        </button>
        <button
          onClick={() => setFavoritesOnly(!favoritesOnly)}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-display rounded-full border transition-colors ${
            favoritesOnly
              ? "bg-amber-500 text-white border-amber-500"
              : "border-amber-200 text-amber-800 hover:bg-amber-50"
          }`}
        >
          <Star className="size-3.5" />
          Favorites Only
        </button>
        <button
          onClick={() => setOverdue(!overdue)}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-display rounded-full border transition-colors ${
            overdue
              ? "bg-amber-500 text-white border-amber-500"
              : "border-amber-200 text-amber-800 hover:bg-amber-50"
          }`}
        >
          <Hourglass className="size-3.5" />
          Overdue a Cook
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {ALL_TAGS.map((tag) => (
          <button key={tag} onClick={() => toggleTag(tag)} className="min-h-[36px]">
            <Badge
              className={cn(
                "cursor-pointer text-sm px-3 py-1.5",
                selectedTags.includes(tag) ? theme.tagActive : `${theme.tag} hover:bg-amber-200`
              )}
            >
              {tag}
            </Badge>
          </button>
        ))}
      </div>

      {sorted.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {sorted.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <div className={theme.empty}>
          No recipes found. Try a different search or add a new one!
        </div>
      )}
    </div>
  );
}
