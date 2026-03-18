"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Recipe } from "@/lib/types";

interface RecipePickerDropdownProps {
  recipes: Recipe[];
  onSelect: (recipeId: string) => void;
  onClose: () => void;
  formatLastAte?: (recipeId: string) => string | null;
}

export function RecipePickerDropdown({ recipes, onSelect, onClose, formatLastAte }: RecipePickerDropdownProps) {
  const [search, setSearch] = useState("");

  const filtered = recipes.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mt-2 bg-amber-50/50 border border-amber-200/60 rounded-xl max-h-80 overflow-y-auto shadow-sm">
      <div className="p-2.5 sticky top-0 bg-amber-50/80 backdrop-blur-sm border-b border-amber-200/40">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-display text-amber-800">Pick a recipe</span>
          <button onClick={onClose} className="text-amber-400 hover:text-amber-600 p-2 -m-1">
            <X className="size-4" />
          </button>
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          className="w-full font-display text-base sm:text-sm px-3 py-2.5 border border-amber-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400"
        />
      </div>
      {filtered.map((r) => (
        <button
          key={r.id}
          onClick={() => onSelect(r.id)}
          className="w-full text-left px-3 py-3 text-sm font-display hover:bg-amber-100/50 text-amber-900 active:bg-amber-100 min-h-[44px] transition-colors"
        >
          {r.title}
          <span className="text-xs text-amber-600/60 ml-2">
            {formatLastAte ? (formatLastAte(r.id) ?? "New") : `${r.prepTimeMinutes + r.cookTimeMinutes}m`}
          </span>
        </button>
      ))}
      {filtered.length === 0 && (
        <div className="px-3 py-2 text-sm font-display text-amber-600/50">No recipes found</div>
      )}
    </div>
  );
}
