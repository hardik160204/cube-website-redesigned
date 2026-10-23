// Shared motion tokens: one easing, small distances, no scroll-jacking.
// Emil Kowalski's strong ease-out, cubic-bezier(0.23, 1, 0.32, 1).
export const ease = [0.23, 1, 0.32, 1];

export const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

// Bento cards travel a little further so the "slide into place" reads on scroll.
export const slideUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

export const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

// Usage: <motion.div {...inView} variants={fadeUp}>
export const inView = {
  initial: "hidden",
  whileInView: "show",
  viewport: { once: true, margin: "-80px" },
};

// Emil Kowalski's Apple-style spring (bounce inside his 0.1–0.3 range); marketing reveals may run longer than UI.
export const revealSpring = { type: "spring", duration: 0.8, bounce: 0.2 };

/**
 * Scroll reveal from one transform to another, as hardware-accelerated transform strings.
 * `from` and `to` must list the same functions. Pass the item index as `custom` to stagger
 * by `step` seconds. Reduced motion keeps only the fade. Once settled the transform is
 * dropped, so text never stays on a 3D layer (Chrome renders it soft) and CSS hover
 * `translate`/`scale` keep working.
 */
export const reveal = (reduce, from, to, step = 0.06) => ({
  hidden: reduce ? { opacity: 0 } : { opacity: 0, transform: from },
  show: (i = 0) =>
    reduce
      ? { opacity: 1, transition: { duration: 0.4, ease, delay: i * step } }
      : { opacity: 1, transform: to, transition: { ...revealSpring, delay: i * step }, transitionEnd: { transform: "none" } },
});

// Gentle spring lift for buttons: <MotionButton {...springHover}>
export const springHover = {
  whileHover: { y: -2 },
  transition: { type: "spring", stiffness: 400, damping: 25 },
};
