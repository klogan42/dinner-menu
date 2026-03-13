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
    <header className="border-b border-amber-200 bg-amber-50 w-full overflow-hidden">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 flex items-center justify-between h-14">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-amber-900 text-lg"
        >
          <UtensilsCrossed className="size-5" />
          Our Table
        </Link>

        <nav className="flex items-center gap-1">
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
                  "flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                  active
                    ? "bg-amber-200 text-amber-900"
                    : "text-amber-700 hover:bg-amber-100"
                )}
              >
                <Icon className="size-4" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
