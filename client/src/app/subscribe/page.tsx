"use client";

import { UtensilsCrossed } from "lucide-react";
import Link from "next/link";

export default function SubscribePage() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center bg-amber-50/40 px-4">
      <div className="w-full max-w-sm text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <UtensilsCrossed className="size-7 text-amber-600" />
          <h1 className="text-3xl font-display text-amber-900">Dinner Table</h1>
        </div>
        <p className="font-display text-amber-700/70 mb-6">
          Dinner Table is free to use.
        </p>
        <Link
          href="/"
          className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-display px-6 py-3 rounded-xl transition-colors"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
