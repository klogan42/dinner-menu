"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UtensilsCrossed, CalendarDays, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "This Week", icon: CalendarDays },
  { href: "/recipes", label: "Recipes", icon: UtensilsCrossed },
  { href: "/recipes/new", label: "Add", icon: Plus },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <header className="bg-amber-50/80 backdrop-blur-md border-b border-amber-200/50 fixed top-0 z-50 w-full">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-amber-900 text-lg tracking-tight"
        >
          <UtensilsCrossed className="size-5 text-amber-600" />
          Dinner Table
        </Link>

        <nav className="flex items-center gap-0.5">
          {links.map(({ href, label, icon: Icon }) => {
            const active =
              href === "/"
                ? pathname === "/"
                : pathname.startsWith(href);

            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all min-h-[44px]",
                  active
                    ? "bg-amber-100/70 text-amber-700"
                    : "text-amber-600/50 hover:text-amber-800 hover:bg-amber-100/40"
                )}
              >
                <Icon className="size-5" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
