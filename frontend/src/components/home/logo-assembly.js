// Geometry for the homepage's brand moment: the logo mark, rebuilt from its 12 diamonds.
// Colours are measured from public/logo75.png. (u, v) are 45° lattice steps from the red top diamond.
export const SKY = "#00B8FF";
export const ROYAL = "#0047FF";
export const INDIGO = "#2300DC";
export const RED = "#FF0000";

export const STEP = 56; // px between neighbouring diamond centres on the lattice

export const DIAMONDS = [
  { u: 0, v: 0, color: RED },
  { u: -1, v: 1, color: SKY },
  { u: 1, v: 1, color: SKY },
  { u: -2, v: 2, color: SKY },
  { u: 0, v: 2, color: ROYAL },
  { u: 2, v: 2, color: SKY },
  { u: -3, v: 3, color: SKY },
  { u: -1, v: 3, color: ROYAL },
  { u: 1, v: 3, color: ROYAL },
  { u: 3, v: 3, color: SKY },
  { u: -2, v: 4, color: INDIGO },
  { u: 2, v: 4, color: INDIGO },
];

// Where diamond `i` starts before it flies home: spread on a golden-angle spiral, pushed back in depth
// and tumbled. Deterministic, so the scene is the same on every load.
export function scatter(i) {
  const angle = i * 2.39996;
  const radius = 300 + (i % 3) * 110;
  return {
    x: Math.round(Math.cos(angle) * radius),
    y: Math.round(Math.sin(angle) * radius * 0.7),
    z: -500 + (i % 4) * 220,
    rotateX: (i % 2 ? 1 : -1) * (70 + i * 6),
    rotateY: ((i * 53) % 140) - 70,
    rotate: ((i * 47) % 200) - 100,
  };
}

// The slice of section scroll progress during which diamond `i` flies home: the top row lands first.
export function flight(i) {
  const start = 0.04 + DIAMONDS[i].v * 0.05 + (i % 2) * 0.02;
  return [start, start + 0.3];
}

// Tagline words light up one after another while the mark assembles; the closing line follows.
export const WORD_WINDOW = (k) => [0.18 + k * 0.11, 0.26 + k * 0.11];
export const OUTRO = [0.62, 0.72];
