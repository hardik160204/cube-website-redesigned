import React, { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { CLIENTS } from "../clients-and-partners";
import SectionIntro from "./SectionIntro";

// Cube's client stories: one card per company Cube already works with (clients-and-partners.js), in a row you
// can swipe, drag or step through. Clients who gave a review show their words; the rest show their logo and
// sector and what Cube offers that sector, so no quote is ever invented. Add a `review` to a client and its card becomes a review card.

const initials = (name) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

const CARD =
  "group relative flex h-full w-[86vw] max-w-[440px] shrink-0 snap-start flex-col overflow-hidden rounded-[28px] border border-[#E6EAF3] bg-white p-7 transition-[translate,box-shadow,border-color] duration-300 ease-out-expo hover:border-[#99B5FF] hover:shadow-[0_30px_60px_-30px_rgb(0_71_255/0.5)] hover:[translate:0_-6px] sm:w-[400px] md:p-8";

function Header({ c }) {
  return (
    <div className="relative flex items-center justify-between gap-4">
      <img src={c.logo} alt={c.name} draggable="false" className="h-10 w-[140px] object-contain object-left mix-blend-multiply transition-[scale] duration-300 ease-out-expo group-hover:[scale:1.06]" />
      {c.sector && <span className="rounded-full bg-[#E6EEFF] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-primary">{c.sector}</span>}
    </div>
  );
}

// What Cube offers a client's sector, in Cube's own published words (the industry pages, or the homepage
// for sectors without one). It describes Cube, never the client, so nothing is put in a client's mouth.
const SECTOR_STORY = {
  Travel: {
    line: "Seamless communication for travel agencies, tour operators, and transport networks. Handle high booking volumes and deliver instant travel updates.",
    points: ["24/7 Booking Support", "Automated Itinerary Updates", "International Toll-Free"],
  },
  Lending: {
    line: "Deliver flawless customer experiences while maintaining absolute regulatory compliance. Cube Software provides encrypted logging, automated collections, and secure cloud PBX for modern financial institutions.",
    points: ["100% Regulatory Compliance", "Automated Debt Collection", "Secure SIP Trunking"],
  },
  Telecom: {
    line: "Powering the backbone of modern communication. We provide telecom operators and ISPs with high-capacity routing, SIP trunking, and advanced billing software.",
    points: ["Carrier-Grade SIP Trunking", "Advanced Call Billing", "Custom IVRS Solutions"],
  },
};
const PLATFORM_STORY = {
  line: "One software platform, one provider, and every communication function you need, fully integrated in the cloud.",
  points: ["Cloud Contact Center", "Call Recording", "IVRS Services"],
};

// Shared by every card: the same lift, glow and top sweep on hover.
function Sweep() {
  return <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-[linear-gradient(90deg,#00B8FF,#0047FF,#2300DC)] transition-transform duration-500 ease-out-expo group-hover:scale-x-100" />;
}

function Footer({ name, sub }) {
  return (
    <div className="relative mt-auto flex items-center gap-3 border-t border-[#E9ECF3] pt-5">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#00B8FF,#0047FF)] text-[15px] font-semibold text-white">{initials(name)}</span>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-[15px] font-medium text-[#2B2F3A]">{name}</span>
        <span className="truncate text-sm text-[#6C6C6C]">{sub}</span>
      </div>
    </div>
  );
}

function StoryCard({ c }) {
  if (!c.review) {
    const st = SECTOR_STORY[c.sector] || PLATFORM_STORY;
    return (
      <article className={CARD}>
        <Sweep />
        <Header c={c} />
        <span className="relative mt-6 text-xs font-semibold uppercase tracking-[0.1em] text-primary">How Cube serves {c.sector ? c.sector.toLowerCase() : "its clients"}</span>
        <p className="relative mt-3 text-[17px] leading-[1.55] text-[#31343A]">{st.line}</p>
        <ul className="relative mb-6 mt-5 flex flex-wrap gap-2">
          {st.points.map((p) => (
            <li key={p} className="flex items-center gap-1.5 rounded-full bg-[#F0F4FB] px-3 py-1.5 text-[13px] text-[#31343A]">
              <Check size={13} strokeWidth={3} className="text-primary" /> {p}
            </li>
          ))}
        </ul>
        <Footer name={c.name} sub={c.sector ? `Cube client · ${c.sector}` : "Cube client"} />
      </article>
    );
  }
  return (
    <article className={CARD}>
      <Sweep />
      <Quote aria-hidden="true" className="absolute -right-3 -top-3 h-28 w-28 text-[#E6EEFF] transition-[rotate] duration-500 ease-out-expo group-hover:[rotate:-8deg]" strokeWidth={1.5} />
      <Header c={c} />
      <div className="relative mt-6 flex gap-[3px]" role="img" aria-label="Rated 5 out of 5">
        {Array.from({ length: 5 }, (_, k) => (
          <Star key={k} size={16} className="fill-[#00B8FF] text-[#00B8FF]" />
        ))}
      </div>
      <p className="relative mb-6 mt-4 text-[17px] leading-[1.55] text-[#31343A]">“{c.review.quote}”</p>
      <Footer name={c.review.author} sub={`${c.review.role}, ${c.name}`} />
    </article>
  );
}

// The swipeable row: native scroll-snap for touch and trackpads, drag for a mouse, arrows for everyone.
export function ClientStories({ className = "" }) {
  const ref = useRef(null);
  const drag = useRef(null);
  const dragged = useRef(false);
  const reduce = useReducedMotion();
  const [edge, setEdge] = useState({ start: true, end: false });
  const [paused, setPaused] = useState(false);
  const stories = [...CLIENTS].sort((a, b) => Boolean(b.review) - Boolean(a.review));

  const update = () => {
    const el = ref.current;
    if (el) setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8 });
  };
  useEffect(update, []);

  // Cards move on by themselves every few seconds; hovering or focusing the row holds them still.
  useEffect(() => {
    if (reduce || paused) return undefined;
    const t = setInterval(() => step(1), 4500);
    return () => clearInterval(t);
  });

  const step = (dir) => {
    const el = ref.current;
    if (dir > 0 && el.scrollLeft + el.clientWidth > el.scrollWidth - 8) {
      el.scrollTo({ left: 0, behavior: reduce ? "auto" : "smooth" });
      return;
    }
    const card = el.querySelector("li");
    el.scrollBy({ left: dir * (card ? card.offsetWidth + 20 : el.clientWidth), behavior: reduce ? "auto" : "smooth" });
  };

  const onPointerDown = (e) => {
    if (e.pointerType !== "mouse") return;
    drag.current = { x: e.clientX, left: ref.current.scrollLeft, moved: false };
    ref.current.style.scrollSnapType = "none";
  };
  const onPointerMove = (e) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    if (Math.abs(dx) > 4) drag.current.moved = true;
    ref.current.scrollLeft = drag.current.left - dx;
  };
  const endDrag = () => {
    if (!drag.current) return;
    ref.current.style.scrollSnapType = "";
    dragged.current = drag.current.moved;
    drag.current = null;
  };
  // A drag should not also count as a click on the card's link.
  const onClickCapture = (e) => {
    if (dragged.current) e.preventDefault();
    dragged.current = false;
  };

  return (
    <div
      className={className}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <ul
        ref={ref}
        onScroll={update}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onClickCapture={onClickCapture}
        aria-label="Client stories"
        className="-mx-4 flex cursor-grab snap-x snap-mandatory scroll-px-4 gap-5 overflow-x-auto px-4 pb-6 pt-4 [scrollbar-width:none] active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
      >
        {stories.map((c) => (
          <li key={c.name} className="flex">
            <StoryCard c={c} />
          </li>
        ))}
      </ul>
      <div className="mt-2 flex items-center justify-end gap-3">
        {[
          { dir: -1, Icon: ChevronLeft, off: edge.start, label: "Previous client stories" },
          { dir: 1, Icon: ChevronRight, off: false, label: "Next client stories" },
        ].map(({ dir, Icon, off, label }) => (
          <button
            key={dir}
            type="button"
            onClick={() => step(dir)}
            disabled={off}
            aria-label={label}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-[#D5DBE8] bg-white text-[#0A0626] transition-[background-color,color,border-color,transform] duration-200 hover:border-primary hover:bg-primary hover:text-white active:scale-[0.94] disabled:pointer-events-none disabled:opacity-35"
          >
            <Icon size={20} />
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="w-full overflow-hidden bg-[#F0F4FB] py-16 md:py-[96px]">
      <div className="mx-auto max-w-[1228px] px-4">
        <SectionIntro label="Client voices" title="Teams that" highlight="run on Cube." />
        <ClientStories className="mt-10" />
      </div>
    </section>
  );
}
