// Lays out a left-to-right flowchart in a fixed SVG coordinate space, and keeps the clock of the light that
// runs through it. `stages` is an array of columns; each column holds one node or several that run side by
// side. Every node and every connector is live on every run: nothing in a chart sits idle.
export const WIDTH = 1000;
export const HEIGHT = 460;
export const NODE_H = 104;
const PAD = 24;
const ROW_GAP = 14;

const nodeWidth = (stageCount) => (stageCount >= 5 ? 168 : 196);

export function layoutFlow(stages) {
  const n = stages.length;
  const w = nodeWidth(n);
  const span = n > 1 ? (WIDTH - 2 * PAD - w) / (n - 1) : 0;

  const columns = stages.map((stage, k) => {
    const total = stage.length * NODE_H + (stage.length - 1) * ROW_GAP;
    const top = (HEIGHT - total) / 2 + NODE_H / 2;
    return stage.map((node, j) => ({ ...node, stage: k, x: PAD + w / 2 + k * span, y: top + j * (NODE_H + ROW_GAP), w, h: NODE_H }));
  });

  const edges = [];
  for (let k = 0; k < n - 1; k += 1) {
    const from = columns[k];
    const to = columns[k + 1];
    // Equal-sized columns run lane by lane (a menu option into its own sub-menu); otherwise every node fans
    // out to, or in from, every node in the next column.
    const pairs = from.length > 1 && from.length === to.length ? from.map((a, i) => [a, to[i]]) : from.flatMap((a) => to.map((b) => [a, b]));
    pairs.forEach(([a, b]) => {
      const x1 = a.x + a.w / 2;
      const x2 = b.x - b.w / 2;
      const mx = (x1 + x2) / 2;
      edges.push({ stage: k, d: `M${x1} ${a.y} C${mx} ${a.y}, ${mx} ${b.y}, ${x2} ${b.y}`, end: [x2, b.y] });
    });
  }

  return { nodes: columns.flat(), edges, steps: n - 1 };
}

// Timing of the light (the SVG animation and the caption share this clock).
export const STEP_S = 0.9; // seconds on each connector
export const REST_S = 0.8; // pause at the end of each run
export const START_S = 1.2; // the first run waits for the chart to draw in

// The stage the light has most recently reached after `elapsedS` seconds; it rests on the last stage.
export function stageAt(elapsedS, steps) {
  if (elapsedS < START_S) return 0;
  const cycle = steps * STEP_S + REST_S;
  return Math.min(Math.floor(((elapsedS - START_S) % cycle) / STEP_S), steps);
}
