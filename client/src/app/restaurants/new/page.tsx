"use client";

import { RestaurantForm } from "@/components/restaurant-form";
import { theme } from "@/lib/styles";

export default function NewRestaurantPage() {
  return (
    <div>
      <h1 className={`${theme.heading} mb-6`}>Add Restaurant</h1>
      <RestaurantForm />
    </div>
  );
}
