"use client";

import Link from "next/link";
import { UtensilsCrossed, CalendarDays, BookOpen, Store, ShoppingCart, Shuffle, History, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: CalendarDays,
    title: "Meal Planning",
    description: "Plan your week at a glance with a two-week or monthly calendar view. Assign, swap, and shuffle meals with one tap.",
  },
  {
    icon: BookOpen,
    title: "Recipe Library",
    description: "Store all your family favorites with ingredients, steps, and tags. Filter by quick meals, crockpot, grill, and more.",
  },
  {
    icon: Store,
    title: "Restaurant Tracker",
    description: "Keep a list of go-to spots and log each visit. See when you last ate out and rediscover places you love.",
  },
  {
    icon: ShoppingCart,
    title: "Shopping List",
    description: "Generate a grocery list from the week's meals in one click. Copy or print it before you head to the store.",
  },
  {
    icon: History,
    title: "Meal Tracker",
    description: "See when you last made each recipe. Know at a glance what you haven't cooked in a while and keep things fresh.",
  },
  {
    icon: Shuffle,
    title: "Randomize Your Week",
    description: "Stuck on what to make? Let Dinner Table pick a week of meals from your recipe collection instantly.",
  },
  {
    icon: ShieldCheck,
    title: "No Tracking, No Ads",
    description: "We don't track you, sell your data, or show ads.",
  },
];

export function LandingPage() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-amber-50/30">
      {/* Hero */}
      <div className="max-w-2xl mx-auto px-4 pt-16 pb-12 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <UtensilsCrossed className="size-10 text-amber-500" />
          <h1 className="text-5xl font-display text-amber-900 tracking-tight">Dinner Table</h1>
        </div>
        <p className="text-xl font-display text-amber-700/70 mb-8 leading-relaxed">
          The simple family meal planner. Plan the week, manage recipes, and never ask &ldquo;what&rsquo;s for dinner?&rdquo; again.
        </p>
        <Link
          href="/signin"
          className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-display text-base px-8 py-3 rounded-xl shadow-sm transition-colors"
        >
          Start Your 30-Day Free Trial
        </Link>
        <p className="mt-4 text-base font-display text-amber-700/70">
          Then $9.99 one-time for lifetime access. No subscription.
        </p>
      </div>

      {/* Features */}
      <div className="max-w-3xl mx-auto px-4 pb-20">
        <div className="grid sm:grid-cols-2 gap-4">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="bg-white border border-amber-200/70 rounded-2xl p-5 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="size-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                  <Icon className="size-5 text-amber-600" />
                </div>
                <h3 className="font-display text-amber-900 text-base">{title}</h3>
              </div>
              <p className="font-display text-sm text-amber-700/70 leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
