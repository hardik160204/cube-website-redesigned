import React, { useEffect, useRef } from "react";
import { editing, useCards } from "../../lib/editable";
import { useContent, whenContentLoaded } from "../../lib/content";
import { STAT_FIELDS } from "../page/kit";
import { CCS_PATH, CCS_STATS } from "../../pages/CubeCloudCCS";

// Cube in numbers, right under the homepage hero: the same four figures as the Cloud Contact Center page, so a
// figure changed there (as a site edit for that page) changes here too. Each one counts up the first time it
// scrolls into view.

// Counts the figure up from 0, on the words the visitor sees (after any site edit). If the text changes while
// counting (an edit arriving, say), it stops and leaves the new text.
function CountUp({ children }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || editing() || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    let frame = 0;
    let gone = false;
    el.style.opacity = "0";
    const show = () => {
      el.style.opacity = "";
      el.removeAttribute("data-cube-counting");
    };
    const watcher = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting) return;
        watcher.disconnect();
        await whenContentLoaded();
        await new Promise((r) => setTimeout(r, 150)); // let the edits that just arrived reach the page first
        if (gone) return undefined;
        const node = [...el.childNodes].find((n) => n.nodeType === Node.TEXT_NODE);
        const final = node?.nodeValue || "";
        const m = /^(\D*?)(\d[\d,]*(?:\.\d+)?)(.*)$/.exec(final);
        if (!m) return show();
        const target = parseFloat(m[2].replace(/,/g, ""));
        const decimals = (m[2].split(".")[1] || "").length;
        const grouped = m[2].includes(",");
        const format = (v) => (grouped ? v.toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) : v.toFixed(decimals));
        el.setAttribute("data-cube-counting", "");
        let written = `${m[1]}${format(0)}${m[3]}`;
        node.nodeValue = written;
        el.style.opacity = "";
        const start = performance.now();
        const tick = (t) => {
          if (node.nodeValue !== written) return show();
          const p = Math.min(1, (t - start) / 1800);
          written = p < 1 ? `${m[1]}${format(target * (1 - (1 - p) ** 3))}${m[3]}` : final;
          node.nodeValue = written;
          if (p < 1) frame = requestAnimationFrame(tick);
          else show();
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.5 }
    );
    watcher.observe(el);
    return () => {
      gone = true;
      watcher.disconnect();
      cancelAnimationFrame(frame);
      el.style.opacity = "";
    };
  }, []);
  return (
    <dd ref={ref} className="cl-stat-num text-[34px] font-medium leading-none tracking-[-0.02em] text-white transition-opacity duration-300 sm:text-[44px] lg:text-[52px]">
      {children}
    </dd>
  );
}

export default function StatsBand() {
  const { overrides, lists } = useContent();
  // The Cloud Contact Center page's own edits to these figures, unless they were edited here (or site-wide).
  const edit = (scope, text) => overrides.find((o) => o.kind === "text" && o.scope === scope && o.original === text);
  const asThere = (text) => (edit("/", text) || edit("*", text) ? text : edit(CCS_PATH, text)?.replacement ?? text);
  const { items: own, mark } = useCards(CCS_STATS, STAT_FIELDS);
  const items = (own === CCS_STATS && lists.find((l) => l.key === mark["data-cube-list"] && l.scope === CCS_PATH)?.items) || own;
  return (
    <section className="cl-stats-band relative isolate overflow-hidden bg-[#0A0626] px-4 py-12 text-white md:py-14">
      <h2 className="sr-only">Cube in numbers</h2>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(rgb(255_255_255/0.06)_1px,transparent_1px)] bg-[size:22px_22px] [mask-image:radial-gradient(70%_80%_at_50%_50%,black,transparent)]" />
        <div className="absolute -left-24 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-[#2300DC]/40 blur-[110px]" />
        <div className="absolute -right-16 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-[#00B8FF]/20 blur-[110px]" />
      </div>
      <dl {...mark} className="mx-auto flex max-w-[1228px] flex-wrap">
        {items.map((s, i) => (
          <div key={`${i}-${s.label}`} className={`cl-stat flex min-w-0 flex-1 basis-1/2 flex-col items-center gap-3 px-3 py-5 text-center md:basis-0 ${i ? "md:border-l md:border-white/10" : ""}`}>
            <dt className="order-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8FA0C8] sm:text-xs">{asThere(s.label)}</dt>
            <CountUp>{asThere(String(s.value))}</CountUp>
          </div>
        ))}
      </dl>
    </section>
  );
}
