// The Cube logo mark as data: its 12 diamonds and the logo palette.
// Colours are measured from public/logo75.png. (u, v) are 45° lattice steps from the red top diamond.
export const SKY = "#00B8FF";
export const ROYAL = "#0047FF";
export const INDIGO = "#2300DC";
export const RED = "#FF0000";


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
