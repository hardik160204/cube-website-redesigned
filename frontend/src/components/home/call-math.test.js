import { formatClock, stageAt, stageProgress, waveHeights } from "./call-math";

test("formatClock renders mm:ss and clamps", () => {
  expect(formatClock(0)).toBe("00:00");
  expect(formatClock(253)).toBe("04:13");
  expect(formatClock(59.6)).toBe("01:00");
  expect(formatClock(-3)).toBe("00:00");
});

test("stageAt maps scroll progress to a stage index", () => {
  expect(stageAt(0, 6)).toBe(0);
  expect(stageAt(0.17, 6)).toBe(1);
  expect(stageAt(0.999, 6)).toBe(5);
  expect(stageAt(1, 6)).toBe(5);
  expect(stageAt(-0.2, 6)).toBe(0);
});

test("stageProgress is the progress inside the current stage", () => {
  expect(stageProgress(0, 6)).toBe(0);
  expect(stageProgress(0.25, 4)).toBe(0);
  expect(stageProgress(0.375, 4)).toBeCloseTo(0.5);
  expect(stageProgress(1, 6)).toBe(1);
});

test("waveHeights is deterministic and in range", () => {
  const h = waveHeights(96);
  expect(h).toHaveLength(96);
  expect(Math.min(...h)).toBeGreaterThanOrEqual(0.12);
  expect(Math.max(...h)).toBeLessThanOrEqual(1);
  expect(waveHeights(96)).toEqual(h);
});
