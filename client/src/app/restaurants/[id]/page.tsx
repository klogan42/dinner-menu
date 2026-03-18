"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, Pencil, Trash2, ArrowLeft, MapPin, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRestaurant, useDeleteRestaurant, useToggleRestaurantFavorite, useRestaurantVisits } from "@/lib/hooks";
import { theme } from "@/lib/styles";

function formatVisitDate(dateStr: string) {
  const date = new Date(dateStr + "T00:00");
  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

export default function RestaurantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: restaurant, isLoading } = useRestaurant(id);
  const deleteRestaurant = useDeleteRestaurant();
  const toggleFav = useToggleRestaurantFavorite();
  const { data: allVisits = {} } = useRestaurantVisits();
  const visits = allVisits[id] ?? [];

  if (isLoading) return <div className={theme.empty}>Loading restaurant...</div>;
  if (!restaurant) return <div className={theme.empty}>Restaurant not found.</div>;

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this restaurant?")) {
      await deleteRestaurant.mutateAsync(restaurant.id);
      router.push("/restaurants");
    }
  };

  return (
    <div className="w-full min-w-0">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4 font-display text-amber-700 hover:text-amber-900 min-h-[44px]">
        <ArrowLeft className="size-4" /> Back
      </Button>

      {/* Title + favorite */}
      <div className="mb-4">
        <div className="flex items-start gap-2 mb-1">
          <h1 className="text-2xl font-display text-amber-900 break-words min-w-0">
            {restaurant.name}
          </h1>
          <button onClick={() => toggleFav.mutate(restaurant.id)} className="text-amber-400 hover:text-amber-500 shrink-0 p-2 -m-1 min-h-[44px] min-w-[44px] flex items-center justify-center">
            <Star className="size-5 sm:size-6" fill={restaurant.isFavorite ? "currentColor" : "none"} />
          </button>
        </div>
        {restaurant.cuisine && (
          <div className={`flex items-center gap-1 text-base ${theme.muted}`}>
            <MapPin className="size-4" /> {restaurant.cuisine}
          </div>
        )}
      </div>

      {/* Rating */}
      {restaurant.rating > 0 && (
        <div className="flex items-center gap-1 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`size-5 ${star <= restaurant.rating ? "text-amber-400 fill-amber-400" : "text-amber-200"}`}
            />
          ))}
        </div>
      )}

      {/* Visit stats */}
      <div className="flex items-center gap-3 text-base text-amber-800/70 mb-4">
        <span className="flex items-center gap-1 font-display">
          <CalendarDays className="size-4" />
          {visits.length} {visits.length === 1 ? "visit" : "visits"}
        </span>
        {visits.length > 0 && (
          <span className="font-display text-amber-700">
            Last: {formatVisitDate(visits[0])}
          </span>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Link href={`/restaurants/${restaurant.id}/edit`}>
          <Button variant="outline" className={`${theme.buttonOutline} font-display min-h-[44px]`}>
            <Pencil className="size-4" /> Edit
          </Button>
        </Link>
        <Button variant="destructive" onClick={handleDelete} className="font-display min-h-[44px]">
          <Trash2 className="size-4" /> Delete
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 md:gap-6">
        {/* Notes */}
        {restaurant.notes && (
          <Card className={theme.card}>
            <CardHeader className="pb-2">
              <CardTitle className={`${theme.cardTitle} text-base`}>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base font-display text-amber-900 whitespace-pre-wrap">{restaurant.notes}</p>
            </CardContent>
          </Card>
        )}

        {/* Visit history */}
        {visits.length > 0 && (
          <Card className={theme.card}>
            <CardHeader className="pb-2">
              <CardTitle className={`${theme.cardTitle} text-base`}>Visit History</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {visits.map((date) => (
                  <li key={date} className="flex items-center gap-2 text-sm text-amber-900">
                    <CalendarDays className="size-3.5 text-amber-500 shrink-0" />
                    <span className="font-display">{formatVisitDate(date)}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
