import { DIAMONDS, RED } from "./cube-diamonds";

test("the mark has the logo's 12 diamonds, one red, on distinct lattice spots", () => {
  expect(DIAMONDS).toHaveLength(12);
  expect(DIAMONDS.filter((d) => d.color === RED)).toEqual([{ u: 0, v: 0, color: RED }]);
  expect(new Set(DIAMONDS.map((d) => `${d.u},${d.v}`)).size).toBe(12);
});
