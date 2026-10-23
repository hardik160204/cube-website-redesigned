import * as React from "react"
import { motion, useTransform } from "framer-motion"

import { cn } from "@/lib/utils"
import { usePointerParallax, useSpotlight } from "@/hooks/use-pointer-motion"

// Max tilt in degrees at the card's edge.
const TILT = 5

/**
 * Card that tilts toward the cursor in 3D on a spring, with the cursor-following glow border.
 * Perspective sits on the wrapper, so at rest the card itself is `transform: none` and its text
 * stays crisp. Inert for touch and reduced motion (the pointer hook returns no handlers).
 */
export function TiltCard({ className, children }) {
  const pointer = usePointerParallax()
  const spot = useSpotlight()
  const rotateX = useTransform(pointer.y, (v) => v * -TILT * 2)
  const rotateY = useTransform(pointer.x, (v) => v * TILT * 2)

  return (
    <div className="h-full [perspective:900px]">
      <motion.div
        style={{ rotateX, rotateY }}
        onPointerMove={(e) => {
          pointer.handlers.onPointerMove?.(e)
          spot.handlers.onPointerMove?.(e)
        }}
        onPointerLeave={pointer.handlers.onPointerLeave}
        className={cn("group/spot relative h-full", className)}
      >
        {spot.glow}
        {children}
      </motion.div>
    </div>
  )
}
