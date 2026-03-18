// Shared styling constants — warm amber kitchen feel.

export const theme = {
  // Page headings
  heading: "text-2xl font-display text-amber-900 tracking-tight",

  // Cards — warm with amber border
  card: "border border-amber-300 bg-amber-50/30 rounded-2xl",

  // Card section titles
  cardTitle: "text-amber-900 font-display",

  // Inputs and textareas
  input: "font-display border-amber-200 bg-white focus-visible:ring-amber-400/50 focus-visible:border-amber-400 rounded-xl",

  // Primary button (filled)
  buttonPrimary: "bg-amber-500 hover:bg-amber-600 text-white shadow-sm rounded-xl",

  // Secondary button (outline)
  buttonOutline: "border-amber-200 text-amber-800 hover:bg-amber-50 hover:text-amber-900 rounded-xl",

  // Tag badges
  tag: "bg-amber-100 text-amber-800 text-xs rounded-full",
  tagActive: "bg-amber-500 text-white rounded-full",

  // Muted helper text
  muted: "font-display text-amber-700/60",

  // Empty/loading states
  empty: "font-display text-center py-12 text-amber-700/50",
} as const;
