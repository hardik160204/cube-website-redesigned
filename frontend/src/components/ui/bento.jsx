import * as React from "react"

import { cn } from "@/lib/utils"
import { Card } from "./card"

// Static strings so Tailwind's JIT can see every span class.
const SPANS = {
  2: "lg:col-span-2",
  3: "lg:col-span-3",
  4: "lg:col-span-4",
  6: "lg:col-span-6",
}

const BentoGrid = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 auto-rows-[minmax(11rem,auto)]", className)}
    {...props} />
))
BentoGrid.displayName = "BentoGrid"

// Hover lift uses the `translate` property, not `transform`, so it still works
// when Framer Motion writes an inline transform for the scroll fade-in.
const BentoCard = React.forwardRef(({ span = 2, tall = false, className, ...props }, ref) => (
  <Card
    ref={ref}
    className={cn(
      "relative overflow-hidden p-6 bg-gradient-to-b from-white/[0.04] to-transparent transition-[translate,border-color] duration-200 ease-out-expo hover:[translate:0_-2px] hover:border-primary/40",
      SPANS[span],
      tall && "lg:row-span-2",
      className
    )}
    {...props} />
))
BentoCard.displayName = "BentoCard"

export { BentoGrid, BentoCard }
