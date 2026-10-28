// Demo availability. Opening hours are set in India Standard Time (UTC+05:30, no daylight saving); slots
// are returned as UTC ISO strings so each visitor's browser can show them in any time zone.
// On top of the weekly hours the admin can block single slots or open extra ones (rules: Map iso -> "block" |
// "open"). A slot closes by itself once it is less than `minNoticeHours` away, and once someone books it.
const IST_OFFSET_MIN = 330;
const DAY = 86_400_000;

const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

// The IST calendar date ("YYYY-MM-DD") a UTC instant falls on.
const istDate = (ms) => new Date(ms + IST_OFFSET_MIN * 60_000).toISOString().slice(0, 10);

// The weekly-hours slots for an IST date, ignoring bookings, rules and time.
function grid(date, demo) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!m) return [];
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const hours = demo.hours[new Date(Date.UTC(y, mo - 1, d)).getUTCDay()];
  if (!hours) return [];
  const out = [];
  for (let t = toMinutes(hours[0]); t + demo.slotMinutes <= toMinutes(hours[1]); t += demo.slotMinutes) {
    out.push(new Date(Date.UTC(y, mo - 1, d, 0, t) - IST_OFFSET_MIN * 60_000).toISOString());
  }
  return out;
}

const extrasOn = (date, rules) => [...rules].filter(([iso, a]) => a === "open" && istDate(Date.parse(iso)) === date).map(([iso]) => iso);

function slotsForDate(date, demo, booked, now, rules = new Map()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return [];
  const earliest = now + demo.minNoticeHours * 3_600_000;
  const latest = now + demo.horizonDays * DAY;
  const regular = demo.blockedDates.includes(date) ? [] : grid(date, demo);
  return [...new Set([...regular, ...extrasOn(date, rules)])].sort().filter((iso) => {
    const ms = Date.parse(iso);
    return ms >= earliest && ms <= latest && !booked.has(iso) && rules.get(iso) !== "block";
  });
}

// Open slots for `days` IST dates starting at `from` ("YYYY-MM-DD").
function availability(from, days, demo, booked, now, rules = new Map()) {
  const start = Date.parse(`${from}T00:00:00Z`);
  if (Number.isNaN(start)) return [];
  const out = [];
  for (let i = 0; i < days; i++) out.push(...slotsForDate(new Date(start + i * DAY).toISOString().slice(0, 10), demo, booked, now, rules));
  return out;
}

const isBookable = (iso, demo, booked, now, rules = new Map()) => slotsForDate(istDate(Date.parse(iso)), demo, booked, now, rules).includes(iso);

// The admin's view of one IST date: every slot with its state and the reason it is (not) bookable.
// bookings: Map iso -> booking row (live bookings only).
function daySchedule(date, demo, bookings, now, rules = new Map()) {
  const earliest = now + demo.minNoticeHours * 3_600_000;
  const latest = now + demo.horizonDays * DAY;
  const dayClosed = demo.blockedDates.includes(date);
  const regular = new Set(grid(date, demo));
  const booked = [...bookings.keys()].filter((iso) => istDate(Date.parse(iso)) === date);
  const all = [...new Set([...regular, ...extrasOn(date, rules), ...booked])].sort();
  const slots = all.map((start) => {
    const ms = Date.parse(start);
    const extra = !regular.has(start);
    const booking = bookings.get(start);
    let state = "open";
    let reason = "";
    if (booking) state = "booked";
    else if (ms < now) [state, reason] = ["closed", "Time has passed"];
    else if (ms < earliest) [state, reason] = ["closed", `Less than ${demo.minNoticeHours} h away`];
    else if (rules.get(start) === "block") state = "blocked";
    else if (dayClosed && !extra) [state, reason] = ["closed", "Day is closed"];
    else if (ms > latest) [state, reason] = ["closed", `More than ${demo.horizonDays} days ahead`];
    return { start, extra, state, reason, booking: booking ? { id: booking.id, name: booking.name, company: booking.company } : null };
  });
  return { date, dayClosed, slots };
}

module.exports = { slotsForDate, availability, isBookable, daySchedule, istDate, IST_OFFSET_MIN };
