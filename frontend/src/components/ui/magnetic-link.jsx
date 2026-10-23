import * as React from "react"
import { Link } from "react-router-dom"
import { useReducedMotion, useSpring } from "framer-motion"

import { cn } from "@/lib/utils"
import { MotionButton } from "./button"
import { TRACKING_SPRING, useFinePointer } from "@/hooks/use-pointer-motion"

/**
 * Primary CTA link: a gentle magnetic pull toward the cursor plus a light sheen that
 * sweeps across on hover. `pull` is how much of the cursor's offset from center the
 * button follows (0.2 ≈ 16px at the edge of a 175px CTA). Extra Framer Motion props
 * (variants etc.) pass through.
 */
export function MagneticLink({ to, pull = 0.2, className, children, ...motionProps }) {
  const reduce = useReducedMotion()
  const fine = useFinePointer()
  const x = useSpring(0, TRACKING_SPRING)
  const y = useSpring(0, TRACKING_SPRING)
  const magnetic = fine && !reduce

  return (
    <MotionButton
      asChild
      style={{ x, y }}
      onPointerMove={
        magnetic
          ? (e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              x.set((e.clientX - rect.left - rect.width / 2) * pull)
              y.set((e.clientY - rect.top - rect.height / 2) * pull)
            }
          : undefined
      }
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
      className={cn("group relative overflow-hidden", className)}
      {...motionProps}
    >
      <Link to={to}>
        {/* Sweeps across on hover (700ms), snaps back invisibly on leave (0ms) */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-0 motion-safe:group-hover:translate-x-full motion-safe:group-hover:duration-700 motion-safe:group-hover:ease-out-expo"
        />
        {children}
      </Link>
    </MotionButton>
  )
}
