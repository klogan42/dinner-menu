"use client";

import { use } from "react";
import { RestaurantForm } from "@/components/restaurant-form";
import { useRestaurant } from "@/lib/hooks";
import { theme } from "@/lib/styles";

export default function EditRestaurantPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: restaurant, isLoading } = useRestaurant(id);

  if (isLoading) return <div className={theme.empty}>Loading...</div>;
  if (!restaurant) return <div className={theme.empty}>Restaurant not found.</div>;

  return (
    <div>
      <h1 className={`${theme.heading} mb-6`}>Edit Restaurant</h1>
      <RestaurantForm restaurant={restaurant} />
    </div>
  );
}
