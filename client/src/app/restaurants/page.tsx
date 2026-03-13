"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { RestaurantCard } from "@/components/restaurant-card";
import { useRestaurants, useRestaurantVisits } from "@/lib/hooks";
import { theme } from "@/lib/styles";

export default function RestaurantsPage() {
  const { data: restaurants, isLoading } = useRestaurants();
  const { data: visits = {} } = useRestaurantVisits();
  const [search, setSearch] = useState("");

  const filtered = restaurants?.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.cuisine.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) return <div className={theme.empty}>Loading restaurants...</div>;

  return (
    <div>
      <h1 className={`${theme.heading} mb-6`}>Restaurants</h1>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-stone-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search restaurants..."
            className={`pl-9 ${theme.input}`}
          />
        </div>
      </div>

      {filtered && filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filtered.map((restaurant) => (
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
