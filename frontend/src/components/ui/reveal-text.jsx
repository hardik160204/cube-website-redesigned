import * as React from "react"
import { motion, useReducedMotion } from "framer-motion"

import { ease, inView, revealSpring } from "@/lib/motion"
import { lineIndexes } from "@/lib/utils"

// Lines start 80ms apart (top of Emil Kowalski's 30–80ms stagger range).
const LINE_STEP = 0.08

/**
 * Reveals text line by line: each word rises out of its own mask, and every word that
 * renders on the same line shares one delay. Lines are measured after layout (and again
 * once web fonts load), so the grouping matches the real wrap at any width.
 * Screen readers get the plain string; the split copy is aria-hidden.
 */
export function RevealText({ text, as: Tag = "span", className, delay = 0 }) {
  const reduce = useReducedMotion()
  const ref = React.useRef(null)
  const words = text.split(" ")
  const [lineOf, setLineOf] = React.useState(() => words.map(() => 0))

  React.useLayoutEffect(() => {
    const measure = () => {
      if (!ref.current) return
      setLineOf(lineIndexes([...ref.current.querySelectorAll("[data-word]")].map((el) => el.offsetTop)))
    }
    measure()
    document.fonts?.ready.then(measure)
  }, [text])

  const word = {
    hidden: reduce ? { opacity: 0 } : { transform: "translateY(110%)" },
    show: (wait) =>
      reduce
        ? { opacity: 1, transition: { duration: 0.4, ease, delay: wait } }
        : { transform: "translateY(0%)", transition: { ...revealSpring, delay: wait } },
  }

  return (
    <Tag className={className}>
      <span className="sr-only">{text}</span>
      <motion.span ref={ref} aria-hidden="true" {...inView}>
        {words.map((w, i) => (
          <React.Fragment key={i}>
            {/* Mask per word; the padding keeps descenders inside it */}
            <span data-word className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-top">
              <motion.span variants={word} custom={delay + lineOf[i] * LINE_STEP} className="inline-block">
                {w}
              </motion.span>
            </span>
            {i < words.length - 1 && " "}
          </React.Fragment>
        ))}
      </motion.span>
    </Tag>
  )
}
