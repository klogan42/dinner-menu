"use client";

import { useState } from "react";
import Link from "next/link";
import { Store, X, Plus } from "lucide-react";
import { Restaurant } from "@/lib/types";

interface RestaurantPickerDropdownProps {
  restaurants: Restaurant[];
  onSelect: (restaurantId: string) => void;
  onClose: () => void;
}

export function RestaurantPickerDropdown({ restaurants, onSelect, onClose }: RestaurantPickerDropdownProps) {
  const [search, setSearch] = useState("");

  const filtered = restaurants.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mt-2 bg-amber-50/50 border border-amber-200/60 rounded-xl max-h-80 overflow-y-auto shadow-sm">
      <div className="p-2.5 sticky top-0 bg-amber-50/80 backdrop-blur-sm border-b border-amber-200/40">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-display text-amber-800 flex items-center gap-1">
            <Store className="size-3.5" /> Pick a restaurant
          </span>
          <button onClick={onClose} className="text-amber-400 hover:text-amber-600 p-2 -m-1">
            <X className="size-4" />
          </button>
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search restaurants..."
          className="w-full font-display text-base sm:text-sm px-3 py-2.5 border border-amber-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400"
        />
      </div>
      {filtered.map((r) => (
        <button
          key={r.id}
          onClick={() => onSelect(r.id)}
          className="w-full text-left px-3 py-3 text-sm font-display hover:bg-amber-100/50 text-amber-900 active:bg-amber-100 min-h-[44px] transition-colors"
        >
          {r.name}
          {r.cuisine && <span className="text-xs text-amber-600/60 ml-2">{r.cuisine}</span>}
        </button>
      ))}
      {filtered.length === 0 && restaurants.length === 0 && (
        <Link href="/add?type=restaurant" className="flex items-center gap-1.5 px-3 py-3 text-sm font-display text-amber-600 hover:bg-amber-100/50 min-h-[44px] transition-colors">
          <Plus className="size-4" /> Add your first spot
        </Link>
      )}
      {filtered.length === 0 && restaurants.length > 0 && (
        <div className="px-3 py-2 text-sm font-display text-amber-600/50">No restaurants found</div>
      )}
    </div>
  );
}
