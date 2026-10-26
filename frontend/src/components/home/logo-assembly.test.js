import { DIAMONDS, flight, OUTRO, RED, scatter, WORD_WINDOW } from "./logo-assembly";

test("the mark has the logo's 12 diamonds, one red, on distinct lattice spots", () => {
  expect(DIAMONDS).toHaveLength(12);
  expect(DIAMONDS.filter((d) => d.color === RED)).toEqual([{ u: 0, v: 0, color: RED }]);
  expect(new Set(DIAMONDS.map((d) => `${d.u},${d.v}`)).size).toBe(12);
});

test("every diamond lands before the closing line appears", () => {
  DIAMONDS.forEach((_, i) => {
    const [start, end] = flight(i);
    expect(start).toBeGreaterThan(0);
    expect(end).toBeLessThanOrEqual(OUTRO[0]);
  });
  expect(WORD_WINDOW(3)[1]).toBeLessThanOrEqual(OUTRO[0]);
});

test("scatter is deterministic and starts away from home", () => {
  expect(scatter(5)).toEqual(scatter(5));
  DIAMONDS.forEach((_, i) => expect(Math.hypot(scatter(i).x, scatter(i).y)).toBeGreaterThan(200));
});
