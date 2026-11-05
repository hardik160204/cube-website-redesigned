// The festivals the website can dress up for, and the greeting each one opens with. Their looks are in
// festival/themes.js, which only loads when a festival is on. The server keeps the same keys (routes/admin.js).
export const FESTIVAL_LIST = [
  { key: "diwali", name: "Diwali", when: "October – November", greeting: "Happy Diwali! Wishing you light, joy and prosperity." },
  { key: "holi", name: "Holi", when: "March", greeting: "Happy Holi! May your year be full of colour." },
  { key: "navratri", name: "Navratri & Dussehra", when: "September – October", greeting: "Happy Navratri and Dussehra! Wishing you strength and success." },
  { key: "ganesh", name: "Ganesh Chaturthi", when: "August – September", greeting: "Happy Ganesh Chaturthi! May every new beginning go well." },
  { key: "rakhi", name: "Raksha Bandhan", when: "August", greeting: "Happy Raksha Bandhan! Celebrating the bonds that keep us connected." },
  { key: "independence", name: "Independence Day", when: "15 August", greeting: "Happy Independence Day! Proudly built in India since 1990." },
  { key: "republic", name: "Republic Day", when: "26 January", greeting: "Happy Republic Day! Proudly built in India since 1990." },
  { key: "sankranti", name: "Makar Sankranti & Pongal", when: "January", greeting: "Happy Makar Sankranti and Pongal! Here's to a bright harvest." },
  { key: "eid", name: "Eid", when: "Changes each year", greeting: "Eid Mubarak! Wishing you peace, happiness and togetherness." },
  { key: "christmas", name: "Christmas", when: "December", greeting: "Merry Christmas! Wishing you warmth and good cheer." },
  { key: "newyear", name: "New Year", when: "31 December – 1 January", greeting: "Happy New Year! Here's to clearer conversations ahead." },
];

// A festival can be previewed without switching it on: /?festival=diwali (kept while the page stays open).
let preview = null;
try {
  preview = new URLSearchParams(window.location.search).get("festival");
} catch {
  /* no address to read */
}
const known = (key) => FESTIVAL_LIST.find((f) => f.key === key) || null;

// The festival showing now, with its greeting: { key, name, greeting, scroll, effects, popup } or null.
export function currentFestival(saved) {
  const f = known(preview) || known(saved?.active);
  if (!f) return null;
  return { ...f, greeting: saved?.greetings?.[f.key] || f.greeting, scroll: saved?.scroll !== false, effects: saved?.effects !== false, popup: saved?.popup !== false };
}
