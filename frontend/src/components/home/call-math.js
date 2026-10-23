// Pure helpers behind the Home page's call motifs. No React here, so they're unit-testable.

// "mm:ss" for a number of seconds (negatives clamp to 00:00).
export function formatClock(seconds) {
  const s = Math.max(0, Math.round(seconds));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

// Which of `count` equal scroll segments `progress` (0–1) is in; the very end belongs to the last one.
export function stageAt(progress, count) {
  return Math.min(count - 1, Math.max(0, Math.floor(progress * count)));
}

// How far through its own segment `progress` is (0–1), e.g. how much of the "Record" stage has played.
export function stageProgress(progress, count) {
  if (progress >= 1) return 1;
  if (progress <= 0) return 0;
  return (progress * count) % 1;
}

// Deterministic, speech-like bar heights in 0.12–1: words as bursts, short pauses, tapered ends.
export function waveHeights(count) {
  return Array.from({ length: count }, (_, i) => {
    const t = count === 1 ? 0.5 : i / (count - 1);
    const words = Math.abs(Math.sin(i * 0.55) * Math.sin(i * 0.13 + 0.8));
    const syllables = 0.5 + 0.5 * Math.sin(i * 1.7);
    const taper = Math.sin(Math.PI * t) ** 0.6;
    return +(0.12 + 0.88 * taper * (0.35 * syllables + 0.65 * words)).toFixed(3);
  });
}
