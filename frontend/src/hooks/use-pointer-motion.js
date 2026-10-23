import { useMemo } from "react";
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

// Emil Kowalski's spring for decorative mouse-tracking: keeps momentum instead of snapping to the cursor.
export const TRACKING_SPRING = { mass: 1, stiffness: 100, damping: 10 };

// True only for a real cursor (mouse/trackpad). Touch screens have nothing to track or hover.
export function useFinePointer() {
  return useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches,
    []
  );
}

/**
 * Tracks the pointer over an element as springy values from -0.5 to 0.5 on each axis
 * (0 = centered). Spread `handlers` on the tracking area. Inert for touch and reduced motion.
 */
export function usePointerParallax() {
  const reduce = useReducedMotion();
  const fine = useFinePointer();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, TRACKING_SPRING);
  const y = useSpring(rawY, TRACKING_SPRING);

  const handlers =
    fine && !reduce
      ? {
          onPointerMove: (e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            rawX.set((e.clientX - rect.left) / rect.width - 0.5);
            rawY.set((e.clientY - rect.top) / rect.height - 0.5);
          },
          onPointerLeave: () => {
            rawX.set(0);
            rawY.set(0);
          },
        }
      : {};

  return { x, y, handlers };
}

/**
 * Soft glowing border (and a faint inner wash) that follows the cursor across a card.
 * Spread `handlers` on the card, give it `group/spot relative` and a radius, and render
 * `glow` inside it. The gradient is written straight to the overlay's style through a motion
 * value, so moving the cursor re-styles one element, not the card's subtree.
 */
export function useSpotlight({ ring = "hsl(var(--primary) / 0.5)", wash = "hsl(var(--primary) / 0.06)" } = {}) {
  const fine = useFinePointer();
  const mx = useMotionValue(-1000);
  const my = useMotionValue(-1000);
  const ringBg = useMotionTemplate`radial-gradient(260px circle at ${mx}px ${my}px, ${ring}, transparent 70%)`;
  const washBg = useMotionTemplate`radial-gradient(360px circle at ${mx}px ${my}px, ${wash}, transparent 70%)`;

  const handlers = fine
    ? {
        onPointerMove: (e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          mx.set(e.clientX - rect.left);
          my.set(e.clientY - rect.top);
        },
      }
    : {};

  // Fades in on hover; the global hover gate keeps it off touch screens.
  const layer = "pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100";
  const glow = (
    <>
      <motion.span aria-hidden="true" style={{ background: washBg }} className={layer} />
      <motion.span aria-hidden="true" style={{ background: ringBg }} className={`spotlight-ring ${layer}`} />
    </>
  );

  return { handlers, glow };
}
