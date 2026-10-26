import { HEIGHT, layoutFlow, REST_S, stageAt, START_S, STEP_S, WIDTH } from "./flow-layout";

const node = (label) => ({ label });

test("fans out from one node into a branch and back in, every connector live", () => {
  const { nodes, edges, steps } = layoutFlow([[node("a")], [node("b1"), node("b2"), node("b3")], [node("c")]]);
  expect(nodes).toHaveLength(5);
  expect(steps).toBe(2);
  expect(edges).toHaveLength(6); // 1→3 and 3→1
});

test("equal-sized columns run lane by lane, like a menu into its sub-menus", () => {
  const { edges } = layoutFlow([[node("1"), node("2"), node("3")], [node("1.1"), node("2.1"), node("3.1")]]);
  expect(edges).toHaveLength(3);
});

test("nodes stay inside the canvas and never overlap their neighbours", () => {
  const stages = Array.from({ length: 5 }, (_, k) => [node(`s${k}a`), node(`s${k}b`), node(`s${k}c`)]);
  const { nodes } = layoutFlow(stages);
  nodes.forEach((n) => {
    expect(n.x - n.w / 2).toBeGreaterThanOrEqual(0);
    expect(n.x + n.w / 2).toBeLessThanOrEqual(WIDTH);
    expect(n.y - n.h / 2).toBeGreaterThanOrEqual(0);
    expect(n.y + n.h / 2).toBeLessThanOrEqual(HEIGHT);
  });
  const col0 = nodes.filter((n) => n.stage === 0);
  const col1 = nodes.filter((n) => n.stage === 1);
  expect(col1[0].x - col1[0].w / 2).toBeGreaterThan(col0[0].x + col0[0].w / 2);
  expect(col0[1].y - col0[1].h / 2).toBeGreaterThan(col0[0].y + col0[0].h / 2);
});

test("the caption follows the light: start, each connector, then rest on the last step and loop", () => {
  const steps = 3;
  expect(stageAt(0, steps)).toBe(0);
  expect(stageAt(START_S + 0.1, steps)).toBe(0);
  expect(stageAt(START_S + STEP_S + 0.1, steps)).toBe(1);
  expect(stageAt(START_S + 3 * STEP_S + 0.1, steps)).toBe(3);
  expect(stageAt(START_S + 3 * STEP_S + REST_S + 0.1, steps)).toBe(0);
});
