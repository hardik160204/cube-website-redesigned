// How each festival looks: its colours, what drifts across the page, what hangs under the header, the pattern
// behind the page heroes and what travels along with the visitor's scrolling.

const svg = (w, h, body) => `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'>${body}</svg>`)}")`;

// --- What hangs under the header ---------------------------------------------------------------------------------
const flower = (x, y, r, a, b) =>
  `<g transform='translate(${x} ${y})'>${Array.from({ length: 8 }, (_, i) => `<ellipse cx='0' cy='${-r * 0.62}' rx='${r * 0.42}' ry='${r * 0.62}' fill='${i % 2 ? a : b}' transform='rotate(${i * 45})'/>`).join("")}<circle r='${r * 0.34}' fill='#7C2D12'/></g>`;
const leaf = (x, y, rot) => `<path d='M0 0 C5 5 5 14 0 20 C-5 14 -5 5 0 0Z' fill='#3F8F3A' stroke='#2B6B2A' stroke-width='.6' transform='translate(${x} ${y}) rotate(${rot})'/>`;
const marigold = (a, b) =>
  svg(
    120,
    50,
    `<path d='M0 4 Q30 16 60 4 T120 4' fill='none' stroke='#8A4B12' stroke-width='1.6'/>${leaf(14, 8, 10)}${leaf(46, 8, -10)}${leaf(74, 8, 10)}${leaf(106, 8, -10)}${flower(30, 11, 10, a, b)}${flower(90, 11, 10, a, b)}${flower(60, 5, 7, b, a)}${flower(0, 5, 7, b, a)}${flower(120, 5, 7, b, a)}<line x1='30' y1='20' x2='30' y2='32' stroke='#8A4B12'/><circle cx='30' cy='35' r='3.4' fill='${a}'/><line x1='90' y1='20' x2='90' y2='32' stroke='#8A4B12'/><circle cx='90' cy='35' r='3.4' fill='${a}'/>`
  );
const bunting = (colors) => {
  const n = colors.length;
  const w = 44;
  return svg(
    n * w,
    34,
    `<path d='M0 3 ${colors.map((_, i) => `Q${i * w + w / 2} 11 ${(i + 1) * w} 3`).join(" ")}' fill='none' stroke='rgb(0 0 0 / .35)' stroke-width='1.2'/>${colors
      .map((c, i) => `<path d='M${i * w + 5} 5.5 L${i * w + w - 5} 5.5 L${i * w + w / 2} 29Z' fill='${c}'/>`)
      .join("")}`
  );
};
const lights = (colors) => {
  const n = colors.length;
  const w = 46;
  return svg(
    n * w,
    34,
    `<path d='M0 3 ${colors.map((_, i) => `Q${i * w + w / 2} 15 ${(i + 1) * w} 3`).join(" ")}' fill='none' stroke='#1F2937' stroke-width='1.4'/>${colors
      .map((c, i) => `<circle cx='${i * w + w / 2}' cy='19' r='9' fill='${c}' opacity='.28'/><rect x='${i * w + w / 2 - 2}' y='7.5' width='4' height='4' fill='#1F2937'/><path d='M${i * w + w / 2 - 4} 12 h8 q2 9 -4 11 q-6 -2 -4 -11Z' fill='${c}'/>`)
      .join("")}`
  );
};
const lanterns = (a, b) =>
  svg(
    130,
    50,
    `<path d='M0 3 Q65 13 130 3' fill='none' stroke='${a}' stroke-width='1.2'/><line x1='32' y1='7' x2='32' y2='16' stroke='${a}'/><path d='M26 16 h12 l3 5 v11 l-3 5 h-12 l-3 -5 v-11Z' fill='${b}' stroke='${a}' stroke-width='1.2'/><path d='M32 21 v11' stroke='${a}'/><line x1='98' y1='8' x2='98' y2='17' stroke='${a}'/><path d='M104 20 a10 10 0 1 0 0 15 a8 8 0 1 1 0 -15Z' fill='${a}'/><path d='M65 8 l1.5 3.8 4 .3 -3 2.6 .9 4 -3.4 -2.2 -3.4 2.2 .9 -4 -3 -2.6 4 -.3Z' fill='${a}'/>`
  );

// A small lit clay lamp, drawn at 40 × 42.
const diya = (x, y, s = 1) =>
  `<g transform='translate(${x} ${y}) scale(${s})'><ellipse cx='20' cy='13' rx='10' ry='13' fill='#FFC53D' opacity='.32'/><path d='M20 1C24 8 26 13 24 18 22 22 18 22 16 18 14 13 16 8 20 1Z' fill='#FF9F1C'/><path d='M20 8C22 12 23 15 22 18 21 20 19 20 18 18 17 15 18 12 20 8Z' fill='#FFF3B0'/><path d='M2 25C3 36 12 41 20 41 28 41 37 36 38 25 32 22 30 28 20 28 10 28 8 22 2 25Z' fill='#B4471A'/><path d='M2 25C8 22 10 28 20 28 30 28 32 22 38 25 33 30 27 31 20 31 13 31 7 30 2 25Z' fill='#FFB547'/><circle cx='12' cy='35' r='1.400' fill='#FFE6A8'/><circle cx='20' cy='37' r='1.400' fill='#FFE6A8'/><circle cx='28' cy='35' r='1.400' fill='#FFE6A8'/></g>`;
// The marigold string with a lamp hanging from every other dip.
const marigoldWithDiyas = (a, b) =>
  svg(
    240,
    80,
    `<path d='M0 4 Q30 16 60 4 T120 4 T180 4 T240 4' fill='none' stroke='#8A4B12' stroke-width='1.600'/>${[0, 120]
      .map((o) => `<g transform='translate(${o} 0)'>${leaf(14, 8, 10)}${leaf(46, 8, -10)}${leaf(74, 8, 10)}${leaf(106, 8, -10)}${flower(30, 11, 10, a, b)}${flower(90, 11, 10, a, b)}${flower(0, 5, 7, b, a)}${flower(120, 5, 7, b, a)}<line x1='90' y1='20' x2='90' y2='32' stroke='#8A4B12'/><circle cx='90' cy='35' r='3.400' fill='${a}'/></g>`)
      .join("")}${flower(60, 5, 7, b, a)}${flower(180, 5, 7, b, a)}<line x1='30' y1='20' x2='30' y2='40' stroke='#8A4B12'/>${diya(16, 38, 0.72)}<line x1='150' y1='20' x2='150' y2='32' stroke='#8A4B12'/><circle cx='150' cy='35' r='3.400' fill='${a}'/>`
  );
// A row of lamps along the top of the footer.
const diyaRow = svg(170, 48, diya(65, 2, 1));

// --- The pattern behind page heroes --------------------------------------------------------------------------------
const rangoli = (a, b, c) => {
  const ring = (r, n, rx, ry, fill) => Array.from({ length: n }, (_, i) => `<ellipse cx='0' cy='${-r}' rx='${rx}' ry='${ry}' fill='${fill}' transform='rotate(${(i * 360) / n})'/>`).join("");
  return svg(
    600,
    600,
    `<g transform='translate(300 300)'>${ring(250, 24, 20, 44, a)}${ring(190, 16, 24, 50, b)}${ring(128, 12, 22, 46, c)}${ring(66, 8, 18, 36, a)}<circle r='24' fill='${b}'/><circle r='286' fill='none' stroke='${a}' stroke-width='3' stroke-dasharray='4 14' stroke-linecap='round'/></g>`
  );
};
const blots = (colors) => {
  const blob = (x, y, s, c) => `<path transform='translate(${x} ${y}) scale(${s})' fill='${c}' d='M0-48C20-58 34-34 52-34 70-34 74-10 60 2 72 22 58 44 36 38 24 62-10 60-18 40-42 48-62 28-48 8-66-10-50-36-28-30-22-44-12-44 0-48Z'/>`;
  const dots = Array.from({ length: 34 }, (_, i) => `<circle cx='${(i * 173) % 600}' cy='${(i * 97) % 600}' r='${3 + (i % 5) * 2}' fill='${colors[i % colors.length]}'/>`).join("");
  return svg(600, 600, `${blob(170, 170, 2.1, colors[0])}${blob(440, 240, 1.6, colors[1])}${blob(260, 430, 1.8, colors[2])}${blob(490, 480, 1.1, colors[3] || colors[0])}${dots}`);
};
const stars = (a, b) => {
  const star = (x, y, r, c) => `<path transform='translate(${x} ${y}) scale(${r})' fill='${c}' d='M0-10 2.4-3.2 9.5-3.1 3.8 1.2 5.9 8 0 4 -5.9 8 -3.8 1.2 -9.5-3.1 -2.4-3.2Z'/>`;
  return svg(600, 600, Array.from({ length: 30 }, (_, i) => star((i * 211) % 600, (i * 137) % 600, 0.8 + (i % 4) * 0.9, i % 3 ? a : b)).join(""));
};

const SPLASH = ["#FF2D87", "#FFB300", "#22C55E", "#06B6D4", "#7C3AED"];

export const THEMES = {
  diwali: {
    primary: "17 88% 40%", primaryHex: "#C2410C", hover: "#9A3412", ink: "#22070E", accent: "#FFC53D", accent2: "#FF8A1F", accent3: "#FF5A5A", tint: "#FFF7EC", foot: "#FFE2B8", hue: "175deg",
    grad: "linear-gradient(110deg,#7F1D1D 0%,#C2410C 55%,#F59E0B 100%)",
    particles: "ember", burst: true, rider: "diya", garland: marigoldWithDiyas("#F59E0B", "#FB923C"), garlandHeight: 80, diyas: diyaRow, motif: rangoli("#FFC53D", "#FF8A1F", "#FF5A5A"), swatch: ["#7F1D1D", "#C2410C", "#F59E0B", "#FFC53D"],
  },
  holi: {
    primary: "333 78% 42%", primaryHex: "#BE185D", hover: "#9D174D", ink: "#1E0B36", accent: "#FFD23F", accent2: "#FF4FA3", accent3: "#2DD4BF", tint: "#FFF4FA", foot: "#F5D0FE", hue: "100deg",
    grad: "linear-gradient(110deg,#7C3AED 0%,#DB2777 55%,#F59E0B 100%)",
    particles: "gulal", rider: "pichkari", top: true, garland: bunting(SPLASH), garlandHeight: 34, motif: blots(SPLASH), swatch: SPLASH,
  },
  navratri: {
    primary: "0 72% 42%", primaryHex: "#B91C1C", hover: "#991B1B", ink: "#2B0A1E", accent: "#FFB703", accent2: "#FB5607", accent3: "#C77DFF", tint: "#FFF6F0", foot: "#FFE1D0", hue: "150deg",
    grad: "linear-gradient(110deg,#7E22CE 0%,#B91C1C 55%,#F97316 100%)",
    particles: "petal", rider: "dandiya", garland: marigold("#FB5607", "#FFB703"), garlandHeight: 50, motif: rangoli("#FFB703", "#FB5607", "#C77DFF"), swatch: ["#7E22CE", "#B91C1C", "#FB5607", "#FFB703"],
  },
  ganesh: {
    primary: "24 90% 38%", primaryHex: "#B9500A", hover: "#92400E", ink: "#2A1305", accent: "#FFB000", accent2: "#FF7A1A", accent3: "#F43F5E", tint: "#FFF8EB", foot: "#FFE7BF", hue: "178deg",
    grad: "linear-gradient(110deg,#92400E 0%,#D97706 55%,#FBBF24 100%)",
    particles: "petal", rider: "lotus", garland: marigold("#FBBF24", "#F97316"), garlandHeight: 50, motif: rangoli("#FFB000", "#FF7A1A", "#F43F5E"), swatch: ["#92400E", "#D97706", "#FBBF24", "#F43F5E"],
  },
  rakhi: {
    primary: "347 77% 40%", primaryHex: "#B4163F", hover: "#9F1239", ink: "#2A0A1C", accent: "#FBB6CE", accent2: "#FDBA74", accent3: "#FDE68A", tint: "#FFF5F7", foot: "#FFD9E6", hue: "110deg",
    grad: "linear-gradient(110deg,#9F1239 0%,#E11D48 55%,#FB923C 100%)",
    particles: "petal", rider: "rakhi", garland: bunting(["#E11D48", "#FB923C", "#FBBF24", "#F472B6"]), garlandHeight: 34, motif: rangoli("#FBB6CE", "#FDBA74", "#FDE68A"), swatch: ["#9F1239", "#E11D48", "#FB923C", "#FBB6CE"],
  },
  independence: {
    primary: "24 88% 38%", primaryHex: "#B8540B", hover: "#9A4408", ink: "#0B1F3A", accent: "#FF9933", accent2: "#FFFFFF", accent3: "#4ADE80", tint: "#FFF9F2", foot: "#E2ECF8", hue: "175deg",
    grad: "linear-gradient(110deg,#C2570C 0%,#1E3A5F 50%,#15803D 100%)",
    particles: "tricolor", rider: "flag", up: true, garland: bunting(["#FF9933", "#FFFFFF", "#138808"]), garlandHeight: 34, motif: rangoli("#FF9933", "#FFFFFF", "#4ADE80"), swatch: ["#FF9933", "#FFFFFF", "#138808", "#0B1F3A"],
  },
  republic: {
    primary: "24 88% 38%", primaryHex: "#B8540B", hover: "#9A4408", ink: "#0B1F3A", accent: "#FF9933", accent2: "#FFFFFF", accent3: "#4ADE80", tint: "#F5FAF5", foot: "#E2ECF8", hue: "175deg",
    grad: "linear-gradient(110deg,#15803D 0%,#1E3A5F 50%,#C2570C 100%)",
    particles: "tricolor", rider: "flag", up: true, garland: bunting(["#FF9933", "#FFFFFF", "#138808"]), garlandHeight: 34, motif: rangoli("#4ADE80", "#FFFFFF", "#FF9933"), swatch: ["#138808", "#FFFFFF", "#FF9933", "#0B1F3A"],
  },
  sankranti: {
    primary: "192 82% 31%", primaryHex: "#0E7490", hover: "#155E75", ink: "#08293B", accent: "#FFC53D", accent2: "#FB7185", accent3: "#34D399", tint: "#F0FAFF", foot: "#D3F1FF", hue: "0deg",
    grad: "linear-gradient(110deg,#0E7490 0%,#0EA5E9 55%,#FBBF24 100%)",
    particles: "kite", rider: "kite", up: true, garland: bunting(["#FB7185", "#FBBF24", "#34D399", "#38BDF8"]), garlandHeight: 34, motif: rangoli("#FFC53D", "#FB7185", "#34D399"), swatch: ["#0E7490", "#FBBF24", "#FB7185", "#34D399"],
  },
  eid: {
    primary: "164 86% 25%", primaryHex: "#097A5C", hover: "#065F46", ink: "#06231F", accent: "#F5D67A", accent2: "#A7F3D0", accent3: "#FFFFFF", tint: "#F2FBF7", foot: "#D4F5E6", hue: "183deg",
    grad: "linear-gradient(110deg,#064E3B 0%,#047857 55%,#CA8A04 100%)",
    particles: "star", rider: "crescent", garland: lanterns("#D4AF37", "#0F766E"), garlandHeight: 50, motif: stars("#F5D67A", "#A7F3D0"), swatch: ["#064E3B", "#047857", "#D4AF37", "#F5D67A"],
  },
  christmas: {
    primary: "0 72% 40%", primaryHex: "#B01B1B", hover: "#7F1D1D", ink: "#0E2A1E", accent: "#FCD34D", accent2: "#F87171", accent3: "#86EFAC", tint: "#FDF6F3", foot: "#DDF5E5", hue: "150deg",
    grad: "linear-gradient(110deg,#14532D 0%,#B91C1C 60%,#DC2626 100%)",
    particles: "snow", rider: "bauble", garland: lights(["#EF4444", "#FCD34D", "#22C55E", "#38BDF8"]), garlandHeight: 34, motif: stars("#FCD34D", "#FFFFFF"), swatch: ["#14532D", "#B91C1C", "#FCD34D", "#FFFFFF"],
  },
  newyear: {
    primary: "36 90% 30%", primaryHex: "#92600A", hover: "#78500A", ink: "#0B0B22", accent: "#FDE68A", accent2: "#F472B6", accent3: "#60A5FA", tint: "#FBF9F1", foot: "#FBF3C8", hue: "183deg",
    grad: "linear-gradient(110deg,#1E1B4B 0%,#6D28D9 50%,#D97706 100%)",
    particles: "confetti", burst: true, rider: "rocket", up: true, garland: lights(["#FDE68A", "#F472B6", "#60A5FA", "#A78BFA"]), garlandHeight: 34, motif: stars("#FDE68A", "#F472B6"), swatch: ["#1E1B4B", "#6D28D9", "#D97706", "#FDE68A"],
  },
};
