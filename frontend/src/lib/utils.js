import { clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge"

// Register our custom shadows (tailwind.config.js) so `shadow-glow` replaces `shadow-sm`
// instead of being mistaken for a shadow color and losing to it on CSS order.
const twMerge = extendTailwindMerge({
  extend: { classGroups: { shadow: [{ shadow: ["card", "elevated", "glow"] }] } },
});

// Line number (0 = first) for each element's offsetTop, so words on one rendered line share a number.
export function lineIndexes(tops) {
  const rows = [...new Set(tops)].sort((a, b) => a - b);
  return tops.map((top) => rows.indexOf(top));
}

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
