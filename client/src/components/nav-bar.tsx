"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UtensilsCrossed, CalendarDays, Store, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "next-auth/react";

const links = [
  { href: "/", label: "This Week", icon: CalendarDays },
  { href: "/recipes", label: "Recipes", icon: UtensilsCrossed },
  { href: "/restaurants", label: "Spots", icon: Store },
];

export function NavBar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    if (!showMenu) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showMenu]);

  // Close menu on navigation
  useEffect(() => {
    setShowMenu(false);
  }, [pathname]);

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

        {session ? (
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
                    "flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-display transition-all min-h-[44px]",
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

            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-display transition-all min-h-[44px]",
                  showMenu || pathname === "/account"
                    ? "bg-amber-100/70 text-amber-700"
                    : "text-amber-600/50 hover:text-amber-800 hover:bg-amber-100/40"
                )}
              >
                <User className="size-5" />
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-1 w-44 bg-white border border-amber-200 rounded-xl shadow-lg overflow-hidden z-50">
                  <Link
                    href="/account"
                    className="flex items-center gap-2 px-4 py-3 text-sm font-display text-amber-900 hover:bg-amber-50 transition-colors min-h-[44px]"
                  >
                    <User className="size-4" /> Account
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm font-display text-amber-900 hover:bg-amber-50 transition-colors min-h-[44px] border-t border-amber-100"
                  >
                    <LogOut className="size-4" /> Sign out
                  </button>
                </div>
              )}
            </div>
          </nav>
        ) : (
          <Link
            href="/signin"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-display bg-amber-500 hover:bg-amber-600 text-white transition-colors min-h-[44px]"
          >
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
}
