"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { UtensilsCrossed, Store } from "lucide-react";
import { RecipeForm } from "@/components/recipe-form";
import { RestaurantForm } from "@/components/restaurant-form";
import { theme } from "@/lib/styles";

type Tab = "recipe" | "restaurant";

export default function AddPage() {
  const searchParams = useSearchParams();
  const initial = searchParams.get("type") === "restaurant" ? "restaurant" : "recipe";
  const [tab, setTab] = useState<Tab>(initial);

  return (
    <div>
      <h1 className={`${theme.heading} mb-4`}>
        {tab === "recipe" ? "Add New Recipe" : "Add Restaurant"}
      </h1>

      <div className="flex mb-6">
        <div className="inline-flex rounded-xl border border-amber-200 overflow-hidden">
          <button
            onClick={() => setTab("recipe")}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-display transition-colors min-h-[44px] ${
              tab === "recipe"
                ? "bg-amber-100 text-amber-700"
                : "text-amber-500/60 hover:text-amber-700 hover:bg-amber-50"
            }`}
          >
            <UtensilsCrossed className="size-4" />
            Recipe
          </button>
          <button
            onClick={() => setTab("restaurant")}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-display transition-colors min-h-[44px] ${
              tab === "restaurant"
                ? "bg-amber-100 text-amber-700"
                : "text-amber-500/60 hover:text-amber-700 hover:bg-amber-50"
            }`}
          >
            <Store className="size-4" />
            Restaurant
          </button>
        </div>
      </div>

      {tab === "recipe" ? <RecipeForm /> : <RestaurantForm />}
    </div>
  );
}
