"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Restaurant } from "@/lib/types";
import { useCreateRestaurant, useUpdateRestaurant } from "@/lib/hooks";
import { theme } from "@/lib/styles";

interface RestaurantFormProps {
  restaurant?: Restaurant;
}

export function RestaurantForm({ restaurant }: RestaurantFormProps) {
  const router = useRouter();
  const createRestaurant = useCreateRestaurant();
  const updateRestaurant = useUpdateRestaurant();

  const [name, setName] = useState(restaurant?.name ?? "");
  const [cuisine, setCuisine] = useState(restaurant?.cuisine ?? "");
  const [rating, setRating] = useState(restaurant?.rating ?? 0);
  const [notes, setNotes] = useState(restaurant?.notes ?? "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name,
      cuisine,
      rating,
      notes,
      isFavorite: restaurant?.isFavorite ?? false,
    };

    if (restaurant) {
      await updateRestaurant.mutateAsync({ id: restaurant.id, restaurant: data });
      router.push(`/restaurants/${restaurant.id}`);
    } else {
      const created = await createRestaurant.mutateAsync(data);
      router.push(`/restaurants/${created.id}`);
    }
  };

  const isSubmitting = createRestaurant.isPending || updateRestaurant.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className={theme.card}>
        <CardHeader>
          <CardTitle className={theme.cardTitle}>Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name" className="font-display">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Restaurant name"
              required
              className={theme.input}
            />
          </div>
          <div>
            <Label htmlFor="cuisine" className="font-display">Cuisine</Label>
            <Input
              id="cuisine"
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
              placeholder="Italian, Mexican, etc."
              className={theme.input}
            />
          </div>
          <div>
            <Label className="font-display">Rating</Label>
            <div className="flex items-center gap-1 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star === rating ? 0 : star)}
                  className="p-1 min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <Star
                    className={`size-6 transition-colors ${star <= rating ? "text-amber-400 fill-amber-400" : "text-amber-200 hover:text-amber-300"}`}
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="notes" className="font-display">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What do you like to order here?"
              rows={3}
              className={theme.input}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting} className={`${theme.buttonPrimary} min-h-[44px] px-6`}>
          {isSubmitting ? "Saving..." : restaurant ? "Update Restaurant" : "Add Restaurant"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()} className={`${theme.buttonOutline} min-h-[44px] px-6`}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
