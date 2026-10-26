import { DELETE_MS, GAP_MS, HOLD_MS, initialType, TYPE_MS, typeDelay, typeStep } from "./typewriter";

const WORDS = ["ab", "c"];

test("types a word one letter at a time", () => {
  const one = typeStep(initialType, WORDS);
  expect(one).toEqual({ word: 0, length: 1, deleting: false });
  expect(typeStep(one, WORDS).length).toBe(2);
  expect(typeDelay(one, WORDS)).toBe(TYPE_MS);
});

test("holds a finished word, then deletes it", () => {
  const full = { word: 0, length: 2, deleting: false };
  expect(typeDelay(full, WORDS)).toBe(HOLD_MS);
  const deleting = typeStep(full, WORDS);
  expect(deleting).toEqual({ word: 0, length: 2, deleting: true });
  expect(typeStep(deleting, WORDS).length).toBe(1);
  expect(typeDelay({ word: 0, length: 1, deleting: true }, WORDS)).toBe(DELETE_MS);
});

test("moves to the next word and wraps around", () => {
  const empty = { word: 0, length: 0, deleting: true };
  expect(typeDelay(empty, WORDS)).toBe(GAP_MS);
  expect(typeStep(empty, WORDS)).toEqual({ word: 1, length: 0, deleting: false });
  expect(typeStep({ word: 1, length: 0, deleting: true }, WORDS).word).toBe(0);
});
