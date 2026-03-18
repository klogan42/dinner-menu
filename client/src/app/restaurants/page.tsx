"use client";

import { useState, useMemo } from "react";
import { Search, Star, Clock, Hourglass } from "lucide-react";
import { RestaurantCard } from "@/components/restaurant-card";
import { useRestaurants, useRestaurantVisits } from "@/lib/hooks";
import { theme } from "@/lib/styles";

type SortMode = "default" | "lastAte";

export default function RestaurantsPage() {
  const { data: restaurants, isLoading } = useRestaurants();
  const { data: visits = {} } = useRestaurantVisits();
  const [search, setSearch] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("default");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [overdue, setOverdue] = useState(false);

  const sorted = useMemo(() => {
    if (!restaurants) return [];

    let list = restaurants.filter((r) => {
      const matchesSearch =
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.cuisine.toLowerCase().includes(search.toLowerCase());
      const matchesFavorites = !favoritesOnly || r.isFavorite;
      return matchesSearch && matchesFavorites;
    });

    // Filter to places not visited in 30+ days (or never visited)
    if (overdue) {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 30);
      const cutoffStr = cutoff.toISOString().slice(0, 10);
      list = list.filter((r) => {
        const lastVisit = visits[r.id]?.[0];
        return !lastVisit || lastVisit <= cutoffStr;
      });
    }

    // Sort by last visited
    if (sortMode === "lastAte") {
      list = [...list].sort((a, b) => {
        const aVisit = visits[a.id]?.[0] ?? "";
        const bVisit = visits[b.id]?.[0] ?? "";
        if (!aVisit && !bVisit) return 0;
        if (!aVisit) return 1;
        if (!bVisit) return -1;
        return bVisit.localeCompare(aVisit);
      });
    }

    return list;
  }, [restaurants, search, sortMode, favoritesOnly, overdue, visits]);

  if (isLoading) return <div className={theme.empty}>Loading restaurants...</div>;

  return (
    <div>
      <h1 className={`${theme.heading} mb-6`}>Restaurants</h1>

      <div className="mb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-stone-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search restaurants..."
            className={`w-full pl-9 pr-4 py-2.5 ${theme.input} border text-sm`}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setSortMode(sortMode === "lastAte" ? "default" : "lastAte")}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-display rounded-full border transition-colors ${
            sortMode === "lastAte"
              ? "bg-amber-500 text-white border-amber-500"
              : "border-amber-200 text-amber-800 hover:bg-amber-50"
          }`}
        >
          <Clock className="size-3.5" />
          Last Ate
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
          Overdue a Visit
        </button>
      </div>

      {sorted.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {sorted.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              visits={visits[restaurant.id]}
            />
          ))}
        </div>
      ) : (
        <div className={theme.empty}>
          No restaurants found. Add your favorite spots!
        </div>
      )}
    </div>
  );
}
