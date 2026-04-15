"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Coffee, X } from "lucide-react";

const FIRST_SEEN_KEY = "dinner-table-first-seen";
const LAST_PROMPT_KEY = "dinner-table-support-prompt";
const DAYS = 14;

function daysSince(iso: string) {
  return (Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24);
}

export function SupportPrompt() {
  const { data: session } = useSession();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!session) return;

    // Record first visit
    if (!localStorage.getItem(FIRST_SEEN_KEY)) {
      localStorage.setItem(FIRST_SEEN_KEY, new Date().toISOString());
    }

    // Don't show until 14 days after first visit
    const firstSeen = localStorage.getItem(FIRST_SEEN_KEY)!;
    if (daysSince(firstSeen) < DAYS) return;

    // Don't show again within 14 days of last dismissal
    const lastPrompt = localStorage.getItem(LAST_PROMPT_KEY);
    if (lastPrompt && daysSince(lastPrompt) < DAYS) return;

    const t = setTimeout(() => setVisible(true), 3000);
    return () => clearTimeout(t);
  }, [session]);

  const dismiss = () => {
    localStorage.setItem(LAST_PROMPT_KEY, new Date().toISOString());
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm">
      <div className="bg-white border border-amber-200 rounded-2xl shadow-lg p-5">
        <div className="flex items-start justify-between mb-3">
          <p className="font-display text-amber-900 text-base leading-snug pr-4">
            Enjoying Dinner Table?
          </p>
          <button
            onClick={dismiss}
            className="text-amber-400 hover:text-amber-600 transition-colors shrink-0 mt-0.5"
            aria-label="Dismiss"
          >
            <X className="size-4" />
          </button>
        </div>
        <p className="font-display text-sm text-amber-700/60 mb-4">
          A quick review or coffee goes a long way.
        </p>
        <a
          href="https://buymeacoffee.com/kylelogan"
          target="_blank"
          rel="noopener noreferrer"
          onClick={dismiss}
          className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-display text-sm rounded-xl transition-colors"
        >
          <Coffee className="size-4" /> Buy me a coffee
        </a>
      </div>
    </div>
  );
}
