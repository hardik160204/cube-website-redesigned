import { FEATURE_FLOWS } from "./feature-flows";

test("there is a flow for all 24 feature cards", () => {
  expect(Object.keys(FEATURE_FLOWS)).toHaveLength(24);
});

test("every flow has 3–5 stages, at most 3 lanes, and unique labels per stage", () => {
  Object.entries(FEATURE_FLOWS).forEach(([title, stages]) => {
    expect([title, stages.length >= 3 && stages.length <= 5]).toEqual([title, true]);
    stages.forEach((stage) => {
      expect(stage.length).toBeLessThanOrEqual(3);
      expect(new Set(stage.map((x) => x.label)).size).toBe(stage.length);
    });
  });
});

test("labels and sub-lines are short enough to fit inside a node, and every node has an icon", () => {
  Object.entries(FEATURE_FLOWS).forEach(([title, stages]) =>
    stages.flat().forEach((node) => {
      expect([title, node.label, node.label.length <= 15]).toEqual([title, node.label, true]);
      if (node.sub) expect([title, node.sub, node.sub.length <= 23]).toEqual([title, node.sub, true]);
      expect(node.icon).toBeTruthy();
    })
  );
});

test("the IVR flow is multi-level: a main menu, options, then a sub-menu for each option", () => {
  const ivr = FEATURE_FLOWS["IVR menus"];
  expect(ivr[2]).toHaveLength(3);
  expect(ivr[3]).toHaveLength(3);
  expect(ivr[3].every((x) => /menu/i.test(x.label))).toBe(true);
});
