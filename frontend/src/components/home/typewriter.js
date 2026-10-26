// Typewriter for the hero's audience word: type, hold, delete, move to the next word.
export const TYPE_MS = 90;
export const DELETE_MS = 45;
export const HOLD_MS = 2000;
export const GAP_MS = 300;

export const initialType = { word: 0, length: 0, deleting: false };

export function typeStep(state, words) {
  const full = words[state.word];
  if (!state.deleting && state.length === full.length) return { ...state, deleting: true };
  if (state.deleting && state.length === 0) return { word: (state.word + 1) % words.length, length: 0, deleting: false };
  return { ...state, length: state.length + (state.deleting ? -1 : 1) };
}

// How long to wait before the next step from this state.
export function typeDelay(state, words) {
  if (!state.deleting && state.length === words[state.word].length) return HOLD_MS;
  if (state.deleting && state.length === 0) return GAP_MS;
  return state.deleting ? DELETE_MS : TYPE_MS;
}
