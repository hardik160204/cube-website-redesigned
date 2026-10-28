import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, CalendarCheck2, Check, ChevronDown, ChevronLeft, ChevronRight, Clock, Globe, Phone, Search, Send, ShieldCheck, Video } from "lucide-react";
import { toast } from "sonner";
import { ease } from "../lib/motion";
import { api } from "../lib/api";
import { CONTACT, tel } from "../components/home/catalog";

// The demo booking page: pick a day and time (shown in any time zone), then share details. The server
// checks the slot is still free, stores the booking and emails the sales team with a calendar invite.

const POINTS = ["99.5% uptime SLA", "Ready. Set. Go Live!", "Voice without Limits"];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const EMPTY = { name: "", phone: "", email: "", company: "", designation: "", interest: "", users: "", message: "", company_website: "" };
const FIELD =
  "w-full rounded-xl border border-[#E5EAF4] bg-[#F7F9FD] px-4 py-3 text-[15px] text-[#0A0626] transition-[border-color,background-color,box-shadow] duration-200 placeholder:text-[#9CA3AF] focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10";

const browserZone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Kolkata";
  } catch {
    return "Asia/Kolkata";
  }
};

const offsetOf = (timeZone) => {
  try {
    return new Intl.DateTimeFormat("en-US", { timeZone, timeZoneName: "shortOffset" }).formatToParts(new Date()).find((p) => p.type === "timeZoneName").value;
  } catch {
    return "";
  }
};

const longDate = (key) => {
  const [y, m, d] = key.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", { timeZone: "UTC", weekday: "long", month: "long", day: "numeric", year: "numeric" }).format(Date.UTC(y, m - 1, d));
};

// --- Time zone picker -----------------------------------------------------------------------------------
function TimezoneSelect({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const box = useRef(null);
  const input = useRef(null);

  const zones = useMemo(() => {
    let list = [];
    try {
      list = Intl.supportedValuesOf("timeZone");
    } catch {
      list = ["Asia/Kolkata", "UTC"];
    }
    if (!list.includes(value)) list = [value, ...list];
    return list.map((z) => ({ z, label: z.replace(/_/g, " "), off: offsetOf(z) }));
  }, [value]);

  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? zones.filter((x) => x.label.toLowerCase().includes(s) || x.off.toLowerCase().includes(s)) : zones;
  }, [q, zones]);

  useEffect(() => {
    if (!open) return undefined;
    const close = (e) => !box.current?.contains(e.target) && setOpen(false);
    const esc = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    input.current?.focus();
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  return (
    <div ref={box} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex w-full items-center gap-2 rounded-xl border border-[#E5EAF4] bg-white px-3.5 py-2.5 text-left text-sm text-[#0A0626] transition-colors hover:border-primary/40"
      >
        <Globe size={16} className="shrink-0 text-primary" />
        <span className="min-w-0 flex-1 truncate">
          {value.replace(/_/g, " ")} <span className="text-[#6B6E75]">({offsetOf(value)})</span>
        </span>
        <ChevronDown size={16} className={`shrink-0 text-[#6B6E75] transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98, transition: { duration: 0.12 } }}
            transition={{ duration: 0.18, ease }}
            style={{ transformOrigin: "top" }}
            className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-xl border border-[#E5EAF4] bg-white shadow-[0_24px_48px_-20px_rgb(10_6_38/0.35)]"
          >
            <label className="flex items-center gap-2 border-b border-[#EEF1F7] px-3.5 py-2.5">
              <Search size={15} className="text-[#6B6E75]" />
              <input
                ref={input}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search city or GMT offset"
                aria-label="Search time zones"
                className="w-full bg-transparent text-sm text-[#0A0626] outline-none placeholder:text-[#9CA3AF]"
              />
            </label>
            <ul role="listbox" aria-label="Time zones" className="max-h-64 overflow-y-auto overscroll-contain py-1">
              {shown.slice(0, 200).map((x) => (
                <li key={x.z} role="option" aria-selected={x.z === value}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(x.z);
                      setOpen(false);
                      setQ("");
                    }}
                    className={`flex w-full items-center justify-between gap-3 px-3.5 py-2 text-left text-sm transition-colors hover:bg-[#F0F4FB] ${x.z === value ? "font-medium text-primary" : "text-[#0A0626]"}`}
                  >
                    <span className="truncate">{x.label}</span>
                    <span className="shrink-0 text-xs text-[#6B6E75]">{x.off}</span>
                  </button>
                </li>
              ))}
              {shown.length === 0 && <li className="px-3.5 py-3 text-sm text-[#6B6E75]">No matching time zone.</li>}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Month calendar ---------------------------------------------------------------------------------------
function Calendar({ month, setMonth, minMonth, maxMonth, available, selected, onSelect, todayKey }) {
  const [y, m] = month;
  const first = new Date(Date.UTC(y, m, 1)).getUTCDay();
  const days = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
  const label = new Intl.DateTimeFormat("en-US", { timeZone: "UTC", month: "long", year: "numeric" }).format(Date.UTC(y, m, 1));
  const idx = y * 12 + m;
  const shift = (n) => setMonth([Math.floor((idx + n) / 12), (idx + n) % 12]);
  const cells = [...Array(first).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="text-[17px] font-medium text-[#0A0626]" aria-live="polite">
          {label}
        </h3>
        <div className="flex gap-1.5">
          {[
            [-1, ChevronLeft, "Previous month", idx <= minMonth],
            [1, ChevronRight, "Next month", idx >= maxMonth],
          ].map(([n, Icon, aria, off]) => (
            <button
              key={aria}
              type="button"
              aria-label={aria}
              disabled={off}
              onClick={() => shift(n)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E5EAF4] text-[#0A0626] transition-[background-color,transform] duration-150 hover:bg-[#F0F4FB] active:scale-[0.94] disabled:pointer-events-none disabled:opacity-35"
            >
              <Icon size={17} />
            </button>
          ))}
        </div>
      </div>
      <div className="mt-5 grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((d) => (
          <div key={d} className="pb-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#8A8F98]">
            {d}
          </div>
        ))}
        {cells.map((d, i) => {
          if (!d) return <div key={`b${i}`} />;
          const key = `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
          const open = available.has(key);
          const isSel = key === selected;
          return (
            <div key={key} className="flex justify-center">
              <button
                type="button"
                disabled={!open}
                aria-pressed={isSel}
                aria-label={`${longDate(key)}${open ? "" : ", unavailable"}`}
                onClick={() => onSelect(key)}
                className={`relative flex aspect-square w-full max-w-[46px] items-center justify-center rounded-full text-[15px] transition-[background-color,color,transform,box-shadow] duration-150 active:scale-[0.92] ${
                  isSel
                    ? "bg-primary font-medium text-white shadow-[0_10px_20px_-10px_rgb(0_71_255/0.9)]"
                    : open
                      ? "bg-[#EAF0FF] font-medium text-primary hover:bg-[#D9E4FF]"
                      : "cursor-default text-[#B8BCC6]"
                }`}
              >
                {d}
                {key === todayKey && <span className={`absolute bottom-1.5 h-1 w-1 rounded-full ${isSel ? "bg-white" : "bg-[#00B8FF]"}`} />}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// --- Booking page -----------------------------------------------------------------------------------------
export default function DemoPage() {
  const reduce = useReducedMotion();
  const [info, setInfo] = useState({ slotMinutes: 30, meetingType: "Video call (Google Meet or Zoom)" });
  const [slots, setSlots] = useState(null); // UTC ISO strings; null while loading
  const [loadError, setLoadError] = useState("");
  const [tz, setTz] = useState(browserZone);
  const [hour12, setHour12] = useState(true);
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [month, setMonth] = useState(null);
  const [step, setStep] = useState("pick"); // pick | details | done
  const [form, setForm] = useState(EMPTY);
  const [sending, setSending] = useState(false);
  const top = useRef(null);

  const load = useCallback(() => {
    setLoadError("");
    return Promise.all([api("/demo-info"), api("/availability?days=62")])
      .then(([i, a]) => {
        setInfo(i);
        setSlots(a.slots);
      })
      .catch(() => {
        setSlots([]);
        setLoadError("We couldn't load the calendar right now.");
      });
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  const keyFmt = useMemo(() => new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }), [tz]);
  const hourFmt = useMemo(() => new Intl.DateTimeFormat("en-GB", { timeZone: tz, hour: "2-digit", hourCycle: "h23" }), [tz]);
  const timeFmt = useMemo(() => new Intl.DateTimeFormat("en-US", { timeZone: tz, hour: "numeric", minute: "2-digit", hour12 }), [tz, hour12]);
  const todayKey = keyFmt.format(new Date());

  // Slots grouped by calendar day in the chosen time zone.
  const byDay = useMemo(() => {
    const map = new Map();
    for (const iso of slots || []) {
      const k = keyFmt.format(new Date(iso));
      if (!map.has(k)) map.set(k, []);
      map.get(k).push(iso);
    }
    return map;
  }, [slots, keyFmt]);
  const available = useMemo(() => new Set(byDay.keys()), [byDay]);
  const firstKey = [...available].sort()[0] || todayKey;
  const lastKey = [...available].sort().at(-1) || todayKey;
  const monthIdx = (k) => Number(k.slice(0, 4)) * 12 + Number(k.slice(5, 7)) - 1;
  const minMonth = monthIdx(todayKey);
  const maxMonth = Math.max(minMonth, monthIdx(lastKey));

  // Keep a valid day selected when slots load or the time zone changes.
  useEffect(() => {
    if (!slots) return;
    const next = available.has(date) ? date : firstKey;
    setDate(next);
    if (!month || !available.has(date)) setMonth([Number(next.slice(0, 4)), Number(next.slice(5, 7)) - 1]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slots, available]);

  const groups = useMemo(() => {
    const g = { Morning: [], Afternoon: [], Evening: [] };
    for (const iso of byDay.get(date) || []) {
      const h = Number(hourFmt.format(new Date(iso)));
      g[h < 12 ? "Morning" : h < 17 ? "Afternoon" : "Evening"].push(iso);
    }
    return Object.entries(g).filter(([, list]) => list.length);
  }, [byDay, date, hourFmt]);

  const go = (next) => {
    setStep(next);
    top.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await api("/bookings", { method: "POST", body: { ...form, slot, timezone: tz, consent: true } });
      go("done");
    } catch (err) {
      toast.error(err.message);
      if (err.status === 409) {
        setSlot("");
        await load();
        go("pick");
      }
    } finally {
      setSending(false);
    }
  };

  const when = slot ? `${longDate(keyFmt.format(new Date(slot)))}, ${timeFmt.format(new Date(slot))}` : "";
  const panel = {
    initial: reduce ? false : { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.32, ease } },
    exit: reduce ? { opacity: 0 } : { opacity: 0, y: -6, transition: { duration: 0.15, ease } },
  };

  return (
    <>
      <section className="relative isolate overflow-hidden bg-[#0A0626] px-4 pb-40 pt-10 text-white md:pt-14">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="cl-ai-blob cl-ai-b1" />
          <div className="cl-ai-blob cl-ai-b2" />
          <div className="cl-ai-grid" />
        </div>
        <div className="mx-auto max-w-[1228px] text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#00B8FF]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00B8FF] shadow-[0_0_10px_#00B8FF]" />
            Book a demo
          </span>
          <h1 className="mx-auto mt-4 max-w-[760px] text-[34px] font-medium leading-[1.1] tracking-[-0.01em] sm:text-[46px]">
            Schedule a{" "}
            <span className="bg-gradient-to-r from-[#00B8FF] via-[#3D7BFF] to-[#8A7CFF] bg-clip-text text-transparent">live demo</span> with Cube
          </h1>
          <p className="mx-auto mt-4 max-w-[600px] text-[17px] leading-7 text-[#C9D2EC]">
            Pick a time that suits you. Share your details, and our telephony experts will connect with you promptly.
          </p>
        </div>
      </section>

      <section ref={top} className="scroll-mt-28 bg-[#F0F4FB] px-4 pb-20">
        <div className="relative z-10 mx-auto -mt-28 max-w-[1228px] overflow-hidden rounded-[28px] border border-[#E5EAF4] bg-white shadow-[0_50px_100px_-50px_rgb(10_6_38/0.45)]">
          <div className="grid lg:grid-cols-[320px_1fr]">
            {/* About the demo */}
            <aside className="border-b border-[#EEF1F7] p-7 sm:p-8 lg:border-b-0 lg:border-r">
              <img src="/logo75.png" alt="Cube Software" className="h-9 w-auto" />
              <h2 className="mt-6 text-[24px] font-medium leading-tight text-[#0A0626]">Cube product demo</h2>
              <ul className="mt-5 space-y-3 text-[15px] text-[#404348]">
                <li className="flex items-center gap-3">
                  <Clock size={18} className="shrink-0 text-primary" /> {info.slotMinutes} min
                </li>
                <li className="flex items-center gap-3">
                  <Video size={18} className="shrink-0 text-primary" /> {info.meetingType}
                </li>
                <li className="flex items-center gap-3">
                  <Globe size={18} className="shrink-0 text-primary" /> {tz.replace(/_/g, " ")}
                </li>
              </ul>
              <AnimatePresence initial={false}>
                {slot && step !== "pick" && (
                  <motion.div
                    initial={reduce ? false : { opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto", transition: { duration: 0.25, ease } }}
                    exit={{ opacity: 0, height: 0, transition: { duration: 0.15 } }}
                    className="overflow-hidden"
                  >
                    <div className="mt-5 flex gap-3 rounded-2xl border border-primary/15 bg-[#EEF3FF] p-4 text-[14px] leading-6 text-[#0A0626]">
                      <CalendarCheck2 size={20} className="mt-0.5 shrink-0 text-primary" />
                      <span className="font-medium">{when}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {/* On phones the calendar comes first; the extra detail shows from tablet width up. */}
              <p className="mt-6 hidden text-[15px] leading-7 text-[#4A4D53] lg:block">
                A walkthrough of Cube's cloud telephony with our telephony experts, shaped around how your team handles calls today.
              </p>
              <ul className="mt-6 hidden space-y-2.5 lg:block">
                {POINTS.map((p) => (
                  <li key={p} className="flex items-center gap-3 text-[14px] text-[#404348]">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#00B8FF]/15 text-[#0090D0]">
                      <Check size={12} strokeWidth={3} />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
              <a href={tel(CONTACT.sales)} className="mt-7 hidden items-center gap-3 rounded-2xl bg-[#F0F4FB] p-3.5 lg:flex transition-colors hover:bg-[#E6EEFF]">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
                  <Phone size={17} />
                </span>
                <span>
                  <span className="block text-[11px] uppercase tracking-[0.12em] text-[#6B6E75]">Prefer to call?</span>
                  <span className="block font-medium text-[#0A0626]">{CONTACT.sales}</span>
                </span>
              </a>
            </aside>

            <AnimatePresence mode="wait" initial={false}>
              {step === "pick" && (
                <motion.div key="pick" {...panel} className="grid xl:grid-cols-[1fr_290px]">
                  {/* Calendar */}
                  <div className="border-b border-[#EEF1F7] p-7 sm:p-8 xl:border-b-0 xl:border-r">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Step 1 of 2</p>
                    <h2 className="mt-1.5 text-[22px] font-medium text-[#0A0626]">Pick a date</h2>
                    <div className="mt-6">
                      {month ? (
                        <Calendar
                          month={month}
                          setMonth={setMonth}
                          minMonth={minMonth}
                          maxMonth={maxMonth}
                          available={available}
                          selected={date}
                          todayKey={todayKey}
                          onSelect={(k) => {
                            setDate(k);
                            setSlot("");
                          }}
                        />
                      ) : (
                        <div className="grid grid-cols-7 gap-2" aria-busy="true">
                          {Array.from({ length: 35 }, (_, i) => (
                            <div key={i} className="aspect-square animate-pulse rounded-full bg-[#F0F4FB]" />
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="mt-7 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
                      <TimezoneSelect value={tz} onChange={setTz} />
                      <div role="group" aria-label="Clock format" className="flex rounded-xl bg-[#F0F4FB] p-1 text-sm">
                        {[
                          [true, "12h"],
                          [false, "24h"],
                        ].map(([v, l]) => (
                          <button
                            key={l}
                            type="button"
                            aria-pressed={hour12 === v}
                            onClick={() => setHour12(v)}
                            className={`rounded-lg px-3.5 py-1.5 font-medium transition-[background-color,color,box-shadow] duration-150 ${hour12 === v ? "bg-white text-primary shadow-sm" : "text-[#6B6E75] hover:text-[#0A0626]"}`}
                          >
                            {l}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Times */}
                  <div className="flex flex-col p-7 sm:p-8">
                    <h2 className="text-[17px] font-medium text-[#0A0626]">{date ? longDate(date) : "Available times"}</h2>
                    <p className="mt-1 text-sm text-[#6B6E75]">{info.slotMinutes}-minute sessions</p>
                    <div className="mt-5 max-h-[460px] flex-1 overflow-y-auto overscroll-contain pr-1">
                      {!slots && (
                        <div className="space-y-2.5" aria-busy="true">
                          {Array.from({ length: 6 }, (_, i) => (
                            <div key={i} className="h-11 animate-pulse rounded-xl bg-[#F0F4FB]" />
                          ))}
                        </div>
                      )}
                      {slots && loadError && (
                        <div className="rounded-2xl bg-[#F0F4FB] p-5 text-sm leading-6 text-[#404348]">
                          {loadError}{" "}
                          <button type="button" onClick={load} className="font-medium text-primary underline underline-offset-2">
                            Try again
                          </button>{" "}
                          or call us on <a href={tel(CONTACT.sales)} className="font-medium text-primary">{CONTACT.sales}</a>.
                        </div>
                      )}
                      {slots && !loadError && groups.length === 0 && (
                        <p className="rounded-2xl bg-[#F0F4FB] p-5 text-sm leading-6 text-[#404348]">No open times on this day. Please pick another date.</p>
                      )}
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                          key={`${date}-${tz}`}
                          initial={reduce ? false : { opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0, transition: { duration: 0.22, ease } }}
                          exit={{ opacity: 0, transition: { duration: 0.1 } }}
                          className="space-y-5"
                        >
                          {groups.map(([name, list]) => (
                            <div key={name}>
                              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8A8F98]">{name}</p>
                              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-1">
                                {list.map((iso) => {
                                  const sel = iso === slot;
                                  return (
                                    <div key={iso} className="flex gap-2">
                                      <button
                                        type="button"
                                        aria-pressed={sel}
                                        onClick={() => setSlot(iso)}
                                        className={`h-11 flex-1 rounded-xl border text-[15px] font-medium transition-[background-color,border-color,color,transform] duration-150 active:scale-[0.97] ${
                                          sel ? "border-[#0A0626] bg-[#0A0626] text-white" : "border-primary/25 text-primary hover:border-primary hover:bg-[#EEF3FF]"
                                        }`}
                                      >
                                        {timeFmt.format(new Date(iso))}
                                      </button>
                                      <AnimatePresence initial={false}>
                                        {sel && (
                                          <motion.button
                                            type="button"
                                            onClick={() => go("details")}
                                            initial={reduce ? false : { opacity: 0, width: 0 }}
                                            animate={{ opacity: 1, width: "auto", transition: { duration: 0.22, ease } }}
                                            exit={{ opacity: 0, width: 0, transition: { duration: 0.12 } }}
                                            className="h-11 overflow-hidden whitespace-nowrap rounded-xl bg-primary px-4 text-[15px] font-medium text-white transition-colors hover:bg-[#2300DC]"
                                          >
                                            Next
                                          </motion.button>
                                        )}
                                      </AnimatePresence>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === "details" && (
                <motion.form key="details" {...panel} onSubmit={submit} className="p-7 sm:p-10">
                  <button type="button" onClick={() => go("pick")} className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-[#2300DC]">
                    <ArrowLeft size={16} /> Change time
                  </button>
                  <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-primary">Step 2 of 2</p>
                  <h2 className="mt-1.5 text-[24px] font-medium text-[#0A0626]">Tell us about your business</h2>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {[
                      ["name", "Full Name *", { required: true, autoComplete: "name", maxLength: 100 }],
                      ["phone", "Phone Number *", { required: true, type: "tel", autoComplete: "tel", maxLength: 20, pattern: "[+()\\-.\\s\\d]{7,20}" }],
                      ["email", "Business Email *", { required: true, type: "email", autoComplete: "email", maxLength: 254 }],
                      ["company", "Company Name *", { required: true, autoComplete: "organization", maxLength: 150 }],
                      ["designation", "Designation", { autoComplete: "organization-title", maxLength: 100 }],
                    ].map(([k, label, props]) => (
                      <div key={k}>
                        <label htmlFor={`b-${k}`} className="mb-1.5 block text-[13px] font-medium text-[#404348]">
                          {label}
                        </label>
                        <input id={`b-${k}`} value={form[k]} onChange={set(k)} className={FIELD} {...props} />
                      </div>
                    ))}
                    <div>
                      <label htmlFor="b-users" className="mb-1.5 block text-[13px] font-medium text-[#404348]">
                        Number of Users
                      </label>
                      <select id="b-users" value={form.users} onChange={set("users")} className={`${FIELD} cursor-pointer`}>
                        <option value="">Select Size...</option>
                        <option value="1-10">1 - 10 Users</option>
                        <option value="11-50">11 - 50 Users</option>
                        <option value="51-200">51 - 200 Users</option>
                        <option value="201+">200+ Users</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="b-interest" className="mb-1.5 block text-[13px] font-medium text-[#404348]">
                        Interested In *
                      </label>
                      <select id="b-interest" required value={form.interest} onChange={set("interest")} className={`${FIELD} cursor-pointer`}>
                        <option value="" disabled>
                          Select Solution...
                        </option>
                        <option value="cloud-contact-center">Cloud Contact Center</option>
                        <option value="voice-logger">Voice Logger</option>
                        <option value="call-billing">Call Billing Software</option>
                        <option value="ivrs">IVRS Services</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="b-message" className="mb-1.5 block text-[13px] font-medium text-[#404348]">
                        Anything we should prepare?
                      </label>
                      <textarea id="b-message" rows={3} maxLength={2000} value={form.message} onChange={set("message")} className={`${FIELD} resize-none`} />
                    </div>
                    {/* Hidden from people; bots fill it in. */}
                    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                      <label htmlFor="b-hp">Company website</label>
                      <input id="b-hp" tabIndex={-1} autoComplete="off" value={form.company_website} onChange={set("company_website")} />
                    </div>
                  </div>
                  <label htmlFor="b-consent" className="mt-5 flex items-start gap-3 text-[13px] leading-5 text-[#4A4D53]">
                    <input id="b-consent" type="checkbox" required className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded accent-[#0047FF]" />
                    <span>
                      I agree to the{" "}
                      <Link to="/terms" target="_blank" rel="noopener noreferrer" className="font-medium text-primary underline underline-offset-2">
                        Terms &amp; Conditions
                      </Link>{" "}
                      and{" "}
                      <Link to="/privacy" target="_blank" rel="noopener noreferrer" className="font-medium text-primary underline underline-offset-2">
                        Privacy Policy
                      </Link>
                      , and consent to Cube Software using these details to schedule this demo and contact me about it, including storing them on servers outside my country (EU).
                    </span>
                  </label>
                  <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row">
                    <button
                      type="submit"
                      disabled={sending}
                      className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-primary px-8 py-3.5 text-[16px] font-medium text-white shadow-[0_16px_30px_-14px_rgb(0_71_255/0.9)] transition-[background-color,transform] duration-200 hover:bg-[#2300DC] active:scale-[0.97] disabled:opacity-70 sm:w-auto"
                    >
                      {sending ? "Booking..." : "Confirm booking"} <Send size={17} />
                    </button>
                    <span className="flex items-center gap-2 text-sm text-[#6B6E75]">
                      <ShieldCheck size={16} className="text-primary" /> Secure and confidential.
                    </span>
                  </div>
                </motion.form>
              )}

              {step === "done" && (
                <motion.div key="done" {...panel} className="flex flex-col items-center justify-center p-8 text-center sm:p-14" role="status">
                  <motion.span
                    initial={reduce ? false : { scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1, transition: { type: "spring", duration: 0.5, bounce: 0.3, delay: 0.1 } }}
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white shadow-[0_20px_40px_-16px_rgb(0_71_255/0.9)]"
                  >
                    <Check size={30} strokeWidth={3} />
                  </motion.span>
                  <h2 className="mt-6 text-[28px] font-medium text-[#0A0626]">Your demo is booked</h2>
                  <p className="mt-3 max-w-[460px] text-[16px] leading-7 text-[#4A4D53]">
                    {when} ({tz.replace(/_/g, " ")}). We've emailed a confirmation to <span className="font-medium text-[#0A0626]">{form.email}</span>, and our team will send the meeting link before the call.
                  </p>
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Link to="/" className="rounded-xl bg-primary px-7 py-3 font-medium text-white transition-colors hover:bg-[#2300DC]">
                      Back to home
                    </Link>
                    <Link to="/blog" className="rounded-xl border border-[#E5EAF4] px-7 py-3 font-medium text-[#0A0626] transition-colors hover:bg-[#F0F4FB]">
                      Read our blog
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </>
  );
}
