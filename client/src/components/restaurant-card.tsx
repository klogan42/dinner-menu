"use client";

import Link from "next/link";
import { Star, MapPin, CalendarDays } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Restaurant } from "@/lib/types";
import { useToggleRestaurantFavorite } from "@/lib/hooks";
import { theme } from "@/lib/styles";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`size-3.5 ${star <= rating ? "text-amber-400 fill-amber-400" : "text-amber-200"}`}
        />
      ))}
    </div>
  );
}

function formatVisitDate(dateStr: string) {
  const date = new Date(dateStr + "T00:00");
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

interface RestaurantCardProps {
  restaurant: Restaurant;
  visits?: string[];
}

export function RestaurantCard({ restaurant, visits }: RestaurantCardProps) {
  const toggleFav = useToggleRestaurantFavorite();
  const lastVisit = visits?.[0];
  const visitCount = visits?.length ?? 0;

  return (
    <Card className={`${theme.card} hover:shadow-md transition-shadow`}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/restaurants/${restaurant.id}`} className="flex-1">
            <CardTitle className={`${theme.cardTitle} hover:text-amber-700 transition-colors text-base font-display`}>
              {restaurant.name}
            </CardTitle>
          </Link>
          <button
            onClick={() => toggleFav.mutate(restaurant.id)}
            className="text-amber-400 hover:text-amber-500 transition-colors shrink-0 p-2 -m-1 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <Star className="size-5" fill={restaurant.isFavorite ? "currentColor" : "none"} />
          </button>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {restaurant.cuisine && (
          <div className="flex items-center gap-1 text-xs font-display text-amber-900 mb-2">
            <MapPin className="size-3.5" /> {restaurant.cuisine}
          </div>
        )}

        {restaurant.rating > 0 && (
          <div className="mb-2">
            <StarRating rating={restaurant.rating} />
          </div>
        )}

        {lastVisit ? (
          <div className="flex items-center gap-1 text-xs font-display text-amber-900 mb-2">
            <CalendarDays className="size-3.5" />
            <span>
              Last visited {formatVisitDate(lastVisit)}
              {visitCount > 1 && <span> · {visitCount} visits</span>}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-xs font-display text-amber-900 mb-2">
            <CalendarDays className="size-3.5" />
            <span>No visits yet</span>
          </div>
        )}

        {restaurant.notes && (
          <p className="text-sm font-display text-amber-900 line-clamp-2">
            {restaurant.notes}
          </p>
        )}

        {restaurant.cuisine && (
          <div className="flex flex-wrap gap-1 mt-2">
            <Badge variant="secondary" className={theme.tag}>
              {restaurant.cuisine}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
