"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { RecipeCard } from "@/components/recipe-card";
import { useRecipes } from "@/lib/hooks";
import { theme } from "@/lib/styles";
import { cn } from "@/lib/utils";

const ALL_TAGS = ["quick", "crockpot", "grill", "pasta", "soup"];

export default function RecipesPage() {
  const { data: recipes, isLoading } = useRecipes();
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (tag: string) =>
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );

  const filtered = recipes?.filter((r) => {
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase());
    const matchesTags =
      selectedTags.length === 0 || selectedTags.some((t) => r.tags.includes(t));
    return matchesSearch && matchesTags;
  });

  if (isLoading) return <div className={theme.empty}>Loading recipes...</div>;

  return (
    <div>
      <h1 className={`${theme.heading} mb-6`}>Recipes</h1>

      <div className="mb-6 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-stone-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search recipes..."
            className={`pl-9 ${theme.input}`}
          />
        </div>
        <div className="flex flex-wrap gap-2">
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
      </div>

      {filtered && filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filtered.map((recipe) => (
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
