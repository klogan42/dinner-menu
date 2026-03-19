"use client";

import { X, UtensilsCrossed } from "lucide-react";
import { Recipe } from "@/lib/types";

interface LeftoversPickerDropdownProps {
  recentRecipes: { recipe: Recipe; date: string }[];
  onSelect: (recipeId: string) => void;
  onClose: () => void;
}

function formatDate(dateStr: string) {
  return new Date(dateStr + "T00:00").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function LeftoversPickerDropdown({ recentRecipes, onSelect, onClose }: LeftoversPickerDropdownProps) {
  return (
    <div className="mt-2 bg-amber-50/50 border border-amber-200/60 rounded-xl max-h-80 overflow-y-auto shadow-sm">
      <div className="p-2.5 sticky top-0 bg-amber-50/80 backdrop-blur-sm border-b border-amber-200/40">
        <div className="flex items-center justify-between">
          <span className="text-sm font-display text-amber-800 flex items-center gap-1">
            <UtensilsCrossed className="size-3.5" /> What are you reheating?
          </span>
          <button onClick={onClose} className="text-amber-400 hover:text-amber-600 p-2 -m-1">
            <X className="size-4" />
          </button>
        </div>
      </div>
      {recentRecipes.length > 0 ? (
        recentRecipes.map(({ recipe, date }) => (
          <button
            key={`${recipe.id}-${date}`}
            onClick={() => onSelect(recipe.id)}
            className="w-full text-left px-3 py-3 text-sm font-display hover:bg-amber-100/50 text-amber-900 active:bg-amber-100 min-h-[44px] transition-colors"
          >
            {recipe.title}
            <span className="text-xs text-amber-600/60 ml-2">{formatDate(date)}</span>
          </button>
        ))
      ) : (
        <div className="px-3 py-3 text-sm font-display text-amber-600/50">
          No recent meals in the last 7 days
        </div>
      )}
    </div>
  );
}
