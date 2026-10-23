import { cn, lineIndexes } from "./utils";

test("lineIndexes groups word tops into line numbers", () => {
  expect(lineIndexes([0, 0, 0, 48, 48, 96])).toEqual([0, 0, 0, 1, 1, 2]);
  expect(lineIndexes([12])).toEqual([0]);
  expect(lineIndexes([])).toEqual([]);
});

test("cn lets custom shadows replace the default one", () => {
  expect(cn("shadow-sm", "shadow-glow")).toBe("shadow-glow");
  expect(cn("hover:shadow-glow", "hover:shadow-[0_0_0_1px_red]")).toBe("hover:shadow-[0_0_0_1px_red]");
});
