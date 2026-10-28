import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Lock, Plus, Unlock, X } from "lucide-react";
import { api } from "../lib/api";
import { Button, Card, Empty, INPUT, PageTitle, act } from "./ui";

// The demo calendar as visitors see it, day by day. Click a free slot to block it, a blocked one to open it
// again, add a one-off slot at any time, or close a whole day. Slots close by themselves once they're
// booked or too close to start; bookings stay until cancelled on the Demo bookings page. Times are IST.

const istDay = (ms) => new Date(ms + 330 * 60_000).toISOString().slice(0, 10);
const timeOf = (iso) => new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", hour: "numeric", minute: "2-digit" }).format(new Date(iso));
const longDay = (d) => new Intl.DateTimeFormat("en-IN", { timeZone: "UTC", weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(Date.parse(`${d}T00:00:00Z`));
const WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const LOOK = {
  open: "border-primary/30 bg-white text-primary hover:border-primary hover:bg-[#EEF3FF]",
  blocked: "border-[#E3C6C6] bg-[repeating-linear-gradient(135deg,#FFF5F5,#FFF5F5_6px,#FBE7E7_6px,#FBE7E7_12px)] text-[#A61B1B] hover:border-[#C81E1E]",
  booked: "border-[#BFE6CF] bg-[#ECFBF2] text-[#0F6B3A]",
  closed: "border-[#E5EAF4] bg-[#F5F8FD] text-[#9CA3AF]",
};

export default function CalendarAdmin({ out }) {
  const today = istDay(Date.now());
  const [month, setMonth] = useState(today.slice(0, 7)); // YYYY-MM
  const [selected, setSelected] = useState(today);
  const [data, setData] = useState(null);
  const [addTime, setAddTime] = useState("");
  const [busy, setBusy] = useState(false);

  const [y, m] = month.split("-").map(Number);
  const daysInMonth = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const first = new Date(Date.UTC(y, m - 1, 1)).getUTCDay();

  const load = useCallback(
    () =>
      api(`/admin/schedule?from=${month}-01&days=${daysInMonth}`)
        .then(setData)
        .catch((e) => (e.status === 401 ? out?.() : null)),
    [month, daysInMonth, out]
  );
  useEffect(() => {
    load();
  }, [load]);

  const byDate = useMemo(() => new Map((data?.days || []).map((d) => [d.date, d])), [data]);
  const day = byDate.get(selected);
  const count = (d, state) => (d?.slots || []).filter((s) => s.state === state).length;

  const shift = (n) => {
    const d = new Date(Date.UTC(y, m - 1 + n, 1));
    setMonth(d.toISOString().slice(0, 7));
  };

  const rule = async (start, action, msg) => {
    setBusy(true);
    if (await act(() => api("/admin/slot-rules", { method: "PUT", body: { start, action } }), msg)) await load();
    setBusy(false);
  };
  const toggleDay = async () => {
    setBusy(true);
    if (await act(() => api(`/admin/days/${selected}`, { method: "PUT", body: { closed: !day.dayClosed } }), day.dayClosed ? "Day reopened" : "Day closed")) await load();
    setBusy(false);
  };
  const addSlot = (e) => {
    e.preventDefault();
    if (!addTime) return;
    rule(new Date(`${selected}T${addTime}:00+05:30`).toISOString(), "open", "Slot added");
    setAddTime("");
  };

  return (
    <>
      <PageTitle
        title="Demo calendar"
        desc={`What visitors can book on /demo, in India Standard Time. Slots close automatically when they're booked or less than ${data?.minNoticeHours ?? 3} hours away. Weekly hours are in Settings.`}
      />
      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <Card>
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] font-medium text-[#0A0626]">{new Intl.DateTimeFormat("en-IN", { timeZone: "UTC", month: "long", year: "numeric" }).format(Date.UTC(y, m - 1, 1))}</h2>
            <div className="flex gap-1.5">
              <Button variant="ghost" className="px-2" onClick={() => shift(-1)} disabled={month <= today.slice(0, 7)} aria-label="Previous month">
                <ChevronLeft size={16} />
              </Button>
              <Button variant="ghost" className="px-2" onClick={() => shift(1)} aria-label="Next month">
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-7 gap-1 text-center">
            {WEEK.map((w) => (
              <span key={w} className="pb-1 text-[11px] font-semibold uppercase text-[#8A8F98]">
                {w}
              </span>
            ))}
            {Array.from({ length: first }, (_, i) => (
              <span key={`b${i}`} />
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const date = `${month}-${String(i + 1).padStart(2, "0")}`;
              const d = byDate.get(date);
              const openN = count(d, "open");
              const bookedN = count(d, "booked");
              const isSel = date === selected;
              return (
                <button
                  key={date}
                  type="button"
                  onClick={() => setSelected(date)}
                  aria-pressed={isSel}
                  aria-label={`${longDay(date)}: ${openN} open, ${bookedN} booked${d?.dayClosed ? ", day closed" : ""}`}
                  className={`flex aspect-square flex-col items-center justify-center rounded-xl text-[14px] transition-colors ${
                    isSel ? "bg-primary text-white" : date < today ? "text-[#C3C7CF]" : d?.dayClosed ? "bg-[#FFF1F1] text-[#A61B1B]" : "hover:bg-[#F0F4FB]"
                  }`}
                >
                  {i + 1}
                  <span className="mt-0.5 flex gap-0.5">
                    {openN > 0 && <span className={`h-1.5 w-1.5 rounded-full ${isSel ? "bg-white" : "bg-primary"}`} />}
                    {bookedN > 0 && <span className={`h-1.5 w-1.5 rounded-full ${isSel ? "bg-white" : "bg-[#16A34A]"}`} />}
                  </span>
                </button>
              );
            })}
          </div>
          <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-[#6B6E75]">
            <li className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary" /> Has open slots</li>
            <li className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#16A34A]" /> Has bookings</li>
            <li className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-[#FFF1F1] ring-1 ring-[#F5C7C7]" /> Day closed</li>
          </ul>
        </Card>

        <Card
          title={longDay(selected)}
          actions={
            day && selected >= today ? (
              <Button variant={day.dayClosed ? "primary" : "danger"} disabled={busy} onClick={toggleDay}>
                {day.dayClosed ? <Unlock size={15} /> : <Lock size={15} />} {day.dayClosed ? "Reopen this day" : "Close this whole day"}
              </Button>
            ) : null
          }
        >
          {!data ? (
            <Empty>Loading...</Empty>
          ) : !day ? (
            <Empty>Pick a day in this month.</Empty>
          ) : (
            <>
              {day.slots.length === 0 ? (
                <Empty>No slots on this day. It's outside the weekly hours; add a slot below if you want to offer one.</Empty>
              ) : (
                <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {day.slots.map((s) => (
                    <li key={s.start} className={`flex items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-[14px] ${LOOK[s.state]}`}>
                      <span className="min-w-0">
                        <span className="font-medium">{timeOf(s.start)}</span>
                        {s.extra && <span className="ml-1.5 rounded bg-[#EEF3FF] px-1.5 py-0.5 text-[11px] text-primary">Added</span>}
                        <span className="block truncate text-[12px] opacity-80">
                          {s.state === "open" && "Open to book"}
                          {s.state === "blocked" && "Blocked by admin"}
                          {s.state === "booked" && `Booked: ${s.booking.name} · ${s.booking.company}`}
                          {s.state === "closed" && s.reason}
                        </span>
                      </span>
                      {s.state === "open" && (
                        <Button variant="ghost" className="shrink-0 px-2 py-1 text-[12px]" disabled={busy} onClick={() => rule(s.start, "block", "Slot blocked")}>
                          <Lock size={13} /> Block
                        </Button>
                      )}
                      {s.state === "blocked" && (
                        <Button variant="ghost" className="shrink-0 px-2 py-1 text-[12px]" disabled={busy} onClick={() => rule(s.start, null, "Slot opened")}>
                          <Unlock size={13} /> Open
                        </Button>
                      )}
                      {s.extra && s.state !== "booked" && s.state !== "blocked" && (
                        <Button variant="ghost" className="shrink-0 px-2 py-1 text-[12px]" disabled={busy} onClick={() => rule(s.start, null, "Added slot removed")} aria-label={`Remove the added ${timeOf(s.start)} slot`}>
                          <X size={13} />
                        </Button>
                      )}
                    </li>
                  ))}
                </ul>
              )}
              {selected >= today && (
                <form onSubmit={addSlot} className="mt-5 flex flex-wrap items-end gap-2 border-t border-[#EEF1F7] pt-4">
                  <label className="block">
                    <span className="mb-1.5 block text-[13px] font-medium text-[#404348]">Add a slot on this day (IST)</span>
                    <input type="time" step={300} required value={addTime} onChange={(e) => setAddTime(e.target.value)} className={`${INPUT} w-auto`} />
                  </label>
                  <Button type="submit" disabled={busy || !addTime}>
                    <Plus size={15} /> Add slot
                  </Button>
                  <span className="text-[12px] text-[#6B6E75]">Use this for times outside the weekly hours. Session length: {data.slotMinutes} min.</span>
                </form>
              )}
            </>
          )}
        </Card>
      </div>
    </>
  );
}
