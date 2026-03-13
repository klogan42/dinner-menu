// Shared styling constants for a consistent warm kitchen look.
// Use these instead of sprinkling one-off color classes everywhere.

export const theme = {
  // Page headings
  heading: "text-2xl font-bold text-amber-900",

  // Cards
  card: "border-amber-200 bg-amber-50/50",

  // Card section titles
  cardTitle: "text-amber-900",

  // Inputs and textareas
  input: "border-amber-200 focus-visible:ring-amber-400",

  // Primary button (filled)
  buttonPrimary: "bg-amber-600 hover:bg-amber-700 text-white",

  // Secondary button (outline)
  buttonOutline: "border-amber-300 text-amber-700",

  // Tag badges
  tag: "bg-amber-100 text-amber-800 text-xs",
  tagActive: "bg-amber-600 text-white",

  // Muted helper text
  muted: "text-stone-500",

  // Empty/loading states
  empty: "text-center py-12 text-stone-400",
} as const;
