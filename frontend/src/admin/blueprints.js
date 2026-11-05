import React from "react";
import ROUTES from "../seo/routes.json";
import { api } from "../lib/api";
import { listKey } from "../lib/editable";
import FlexPage, { Hi } from "../components/page/FlexPage";
import { HeroScene } from "../components/page/HeroScenes";
import ProductPage from "../components/page/ProductPage";
import { MODULE_FIELDS, STAT_FIELDS, moduleCards } from "../components/page/kit";

// What a new page can start from: a ready layout with sample text, or a copy of a page the site already has.
// A copy reads the page's own data (nothing about the original changes) and takes on the site edits made to
// it, so it starts with the words, numbers, pictures and cards visitors see today, not the built-in ones.

// Sample text is marked so a page can't go live with it by accident.
export const SAMPLE = "✎";
const s = (text) => `${SAMPLE} ${text}`;
const card = (icon, title, desc) => ({ icon, title: s(title), desc: s(desc) });
const blank = { label: "", title: "", body: [], list: [], cards: [], steps: false, dark: false, image: "", button: "", numbered: [], faqs: [], tiles: [] };
const part = (fields) => ({ ...blank, ...fields });
const hero = (label, fields) => ({ label: "", title: label, body: [], list: [], image: "", button: "Book a demo", scene: "", stats: [], tiles: [], ...fields });
const cta = (title) => ({ title: s(title), body: [s("One line on what happens next.")], button: "Book a Free Demo" });
const FAQS = [
  { q: s("A question customers often ask"), a: s("A clear, short answer.") },
  { q: s("Another common question"), a: s("A clear, short answer.") },
];
const THREE = [card("Zap", "First benefit", "What it does for the customer."), card("ShieldCheck", "Second benefit", "What it does for the customer."), card("BarChart3", "Third benefit", "What it does for the customer.")];
const SIX = [...THREE, card("Clock", "Fourth benefit", "What it does for the customer."), card("Users", "Fifth benefit", "What it does for the customer."), card("Plug", "Sixth benefit", "What it does for the customer.")];
const STEPS = [card("", "First step", "What happens first."), card("", "Second step", "What happens next."), card("", "Third step", "The result.")];

export const LAYOUTS = [
  {
    key: "blank",
    name: "Blank page",
    desc: "An empty page. Add only the sections you want.",
    base: "",
    sketch: ["hero", "text"],
    content: (label) => ({ hero: hero(label), sections: [part({})], cta: null, related: false }),
  },
  {
    key: "product",
    name: "Product page",
    desc: "Numbers strip, overview with a picture, feature cards, benefits and questions. Like Callisto Voice Logger.",
    base: "/services/",
    sketch: ["hero", "split", "cards", "dark", "list", "faq", "cta"],
    content: (label) => ({
      hero: hero(label, {
        label: "Products",
        body: [s("One sentence on what this product does.")],
        stats: [{ value: s("99%"), label: s("A number to be proud of") }, { value: s("24/7"), label: s("Another one") }, { value: s("35+"), label: s("Another one") }],
      }),
      sections: [
        part({ label: "Overview", title: `${s("What it is:")} [${label}]`, body: [s("Two or three sentences explaining the product. Add a picture on the right.")], button: "Book A Demo" }),
        part({ title: `Everything ${label} gives your team`, cards: SIX }),
        part({ label: "Key Features", title: s("Built for reliability and security."), cards: THREE, dark: true }),
        part({ label: "Business Benefits", title: "Why businesses choose it", list: [s("First benefit"), s("Second benefit"), s("Third benefit")] }),
        part({ label: "FAQ", title: "Common [Questions]", faqs: FAQS }),
      ],
      cta: cta(`Ready to deploy ${label}?`),
      related: true,
    }),
  },
  {
    key: "service",
    name: "Service page",
    desc: "What it is, how it works step by step, and why choose it. Like Missed Call Service.",
    base: "/services/",
    sketch: ["hero", "split", "cards", "steps", "cards", "cta"],
    content: (label) => ({
      hero: hero(label, { body: [s("One sentence on what this service does.")] }),
      sections: [
        part({ title: `What is [${label}]?`, body: [s("Explain the service in two or three sentences. Add a picture on the right.")] }),
        part({ title: "How do [businesses] use it?", cards: SIX }),
        part({ title: "How It Works", cards: STEPS, steps: true }),
        part({ title: "Why choose [Cube]?", cards: THREE }),
      ],
      cta: cta(`Get started with ${label}`),
      related: false,
    }),
  },
  {
    key: "industry",
    name: "Industry page",
    desc: "The challenges of a sector and how Cube solves them, with customer logos. Like Healthcare.",
    base: "/industries/",
    sketch: ["hero", "split", "cards", "logos", "cta"],
    content: (label) => ({
      hero: hero(label, { label: "Industries", body: [s("One sentence on how Cube helps this sector.")] }),
      sections: [
        part({ title: "The challenges", body: [s("What makes communication hard in this sector.")], list: [s("First challenge"), s("Second challenge"), s("Third challenge")] }),
        part({ title: "How Cube [helps]", cards: SIX }),
      ],
      cta: cta(`Talk to us about ${label}`),
      related: true,
    }),
  },
  {
    key: "landing",
    name: "Campaign page",
    desc: "For an advert or offer: bullets up top, three reasons, steps, questions and a strong closing button.",
    base: "/",
    sketch: ["hero", "cards", "steps", "faq", "cta"],
    content: (label) => ({
      hero: hero(label, { body: [s("The offer, in one sentence.")], list: [s("First reason to act"), s("Second reason to act"), s("Third reason to act")], button: "Claim your demo" }),
      sections: [part({ title: "Why [now]?", cards: THREE }), part({ title: "How it works", cards: STEPS, steps: true }), part({ label: "FAQ", title: "Common [Questions]", faqs: FAQS })],
      cta: cta("Ready when you are"),
      related: false,
    }),
  },
  {
    key: "info",
    name: "Information page",
    desc: "Text and pictures, for a company story, an announcement or a policy.",
    base: "/",
    sketch: ["hero", "text", "split", "text"],
    content: (label) => ({
      hero: hero(label, { body: [s("A short introduction.")] }),
      sections: [
        part({ title: s("First heading"), body: [s("Your text. Leave a blank line between paragraphs.")] }),
        part({ title: s("Second heading"), body: [s("Your text, with a picture beside it.")] }),
        part({ title: s("Third heading"), body: [s("Your text.")] }),
      ],
      cta: null,
      related: false,
    }),
  },
];

// Pages drawn from data, which can be copied. Others (home, pricing, contact...) are one-off designs.
const COPYABLE = {
  "Product pages": {
    base: "/services/",
    pages: [
      ["/services/ai-contact-center", "CloudContactCenter"],
      ["/services/voice-logger", "CallistoVoiceLogger"],
      ["/services/screen-logger", "ScreenLogger"],
      ["/services/voice-logger-insync", "VoiceLoggerInSync"],
      ["/services/voice-mail", "CubeVoiceMail"],
      ["/services/call-billing", "CallBillingSoftware"],
      ["/services/ivrs", "IvrsServices"],
      ["/services/conference-bridge", "ConferenceBridge"],
      ["/billing/basic", "CallBillingBasic"],
      ["/billing/standard", "CallBillingStandard"],
      ["/billing/enterprise", "CallBillingEnterprise"],
      ["/prison-calling", "PrisonCallingSystem"],
      ["/student-calling", "StudentCallingSystem"],
    ],
  },
  "Cloud services": {
    base: "/services/",
    pages: [
      ["/services/ivr", "CloudIvrPage"],
      ["/services/auto-dialer", "CloudAutoDialerPage"],
      ["/services/missed-call", "CloudMissedCallPage"],
      ["/services/bulk-voice-call", "CloudBulkVoiceCallPage"],
      ["/services/whatsapp-bot", "CloudWhatsappBotPage"],
      ["/services/web-chat-bot", "CloudWebChatBotPage"],
      ["/services/crm-integration", "CloudCrmIntegrationPage"],
      ["/services/toll-free-number", "CloudTollFreeNumberPage"],
      ["/services/virtual-number", "CloudVirtualNumberPage"],
      ["/services/call-recording", "CloudCallRecordingPage"],
      ["/services/click-to-call", "CloudClickToCallPage"],
      ["/services/smart-call-routing", "CloudSmartCallRoutingPage"],
      ["/services/number-masking", "CloudNumberMaskingPage"],
      ["/services/live-analytics", "CloudLiveAnalyticsPage"],
      ["/services/quality-analysis", "CloudQualityAnalysisPage"],
    ],
  },
  Industries: {
    base: "/industries/",
    pages: [
      ["/industries/finance", "FinanceIndustryPage"],
      ["/industries/bpo", "BPOIndustryPage"],
      ["/industries/healthcare", "HealthcareIndustryPage"],
      ["/industries/real-estate", "RealEstateIndustryPage"],
      ["/industries/telecom", "TelecomIndustryPage"],
      ["/industries/travel", "TravelIndustryPage"],
      ["/industries/advertising", "AdvertisingIndustryPage"],
      ["/industries/ngo", "NGOIndustryPage"],
      ["/industries/election", "ElectionIndustryPage"],
      ["/industries/education", "EducationIndustryPage"],
    ],
  },
};

const pageName = (path) => (ROUTES[path]?.title || path).split("|")[0].trim();
export const COPY_GROUPS = Object.entries(COPYABLE).map(([group, { base, pages }]) => ({ group, base, pages: pages.map(([path, file]) => ({ path, file, name: pageName(path) })) }));

const norm = (t) => t.replace(/\s+/g, " ").trim();
const PHONE = /^\+?[\d\s()-]{7,}$/;

// Reads a page's copy the way visitors see it: with the edits for that page, or for every page, applied.
function reader(src, { overrides, lists }) {
  const edits = (kind) => {
    const applies = overrides.filter((o) => o.kind === kind && (o.scope === "*" || o.scope === src));
    return new Map([...applies.filter((o) => o.scope === "*"), ...applies.filter((o) => o.scope === src)].map((o) => [o.original, o.replacement]));
  };
  const texts = edits("text");
  const images = edits("image");
  const phones = [...texts].filter(([a, b]) => PHONE.test(a) && PHONE.test(b));
  const t = (value) => {
    if (typeof value !== "string") return value == null ? "" : String(value);
    const key = norm(value);
    let out = texts.has(key) ? value.replace(key, () => texts.get(key)) : value;
    if (texts.has(key) && out === value) out = texts.get(key);
    for (const [from, to] of phones) out = out.split(from).join(to);
    return out;
  };
  const flat = (node) => {
    if (typeof node === "string" || typeof node === "number") return t(String(node));
    if (Array.isArray(node)) return node.map(flat).join("");
    if (!React.isValidElement(node)) return "";
    return node.type === Hi ? `[${norm(flat(node.props.children))}]` : flat(node.props.children);
  };
  const text = (node) => norm(flat(node));
  const img = (src2) => (src2 ? images.get(src2) ?? src2 : "");
  const edited = (kind, items, fields) => {
    const key = listKey(kind, items, fields);
    return (lists.find((l) => l.key === key && l.scope === src) || lists.find((l) => l.key === key && l.scope === "*"))?.items;
  };
  const iconName = (i) => (typeof i === "string" ? i : i?.displayName || "");
  const cards = (kind, items) => {
    if (!items?.length) return [];
    return (edited(kind, items) || items).map((c) => ({ icon: iconName(c.icon), title: text(c.title), desc: text(c.desc ?? c.description) }));
  };
  const strings = (kind, items) => (items?.length ? (edited(kind, items) || items).map(text) : []);
  const faqs = (items) => (items?.length ? (edited("faq", items) || items).map((f) => ({ q: text(f.q), a: text(f.a) })) : []);
  const stats = (items) => (items?.length ? (edited("card", items, STAT_FIELDS) || items).map((x) => ({ value: text(String(x.value)), label: text(x.label) })) : []);
  const tiles = (items) => (items?.length ? (edited("card", items, { icon: "Icon", label: "Text" }) || items).map((x) => ({ icon: iconName(x.icon), label: text(x.label) })) : []);
  const modules = (items) => {
    const shown = items?.length ? edited("card", moduleCards(items), MODULE_FIELDS) || moduleCards(items) : [];
    return shown.map((m) => ({ icon: iconName(m.icon), title: text(m.title), desc: m.lines.map(text).join(" • ").slice(0, 600) }));
  };
  const swapped = overrides.find((o) => o.kind === "image" && o.original === "slot:hero" && o.scope === src)?.replacement;
  return { text, img, cards, strings, faqs, stats, tiles, modules, swapped: swapped && !/\.(mp4|webm)(\?|$)/i.test(swapped) ? swapped : "" };
}

function fromFlexPage({ sections, related }, r) {
  const [top, ...rest] = sections;
  const closing = rest.find((x) => x.kind === "cta");
  const blocks = rest.filter((x) => x !== closing);
  const image = r.swapped || (top.scene ? "" : r.img(top.image));
  return {
    skipped: blocks.filter((x) => x.render).length,
    content: {
      hero: {
        ...hero(r.text(top.title)),
        label: r.text(top.label),
        body: (top.body || []).map(r.text).slice(0, 4),
        list: r.strings("checklist", top.list),
        image,
        button: r.text(top.button) || "Book a demo",
        scene: image ? "" : top.scene || "",
        tiles: image || top.scene ? [] : r.tiles(top.tiles),
      },
      sections: blocks
        .filter((x) => !x.render)
        .map((x) =>
          part({
            label: r.text(x.label),
            title: r.text(x.title),
            body: (x.body || []).map(r.text),
            list: r.strings("checklist", x.list),
            cards: r.cards(x.steps ? "steps" : "features", x.cards),
            steps: Boolean(x.steps),
            image: r.img(x.image),
            button: r.text(x.button),
            tiles: x.image ? [] : r.tiles(x.tiles),
          })
        ),
      cta: closing ? { title: r.text(closing.title), body: (closing.body || []).map(r.text).slice(0, 3), button: r.text(closing.button) } : null,
      related: Boolean(related),
    },
  };
}

// The product layout's own wording, as ProductPage fills it in when a page doesn't say otherwise.
function fromProductPage(p, r) {
  const d = p.data;
  const crumb = p.crumb || "Products";
  const scene = p.heroMedia?.type === HeroScene ? p.heroMedia.props.name : "";
  const image = r.swapped || (scene ? "" : r.img(p.heroImage));
  const lead = r.text(p.overviewLead || "The Intelligence Behind Modern");
  const highlight = r.text(p.highlight);
  return {
    skipped: 0,
    content: {
      hero: {
        ...hero(r.text(d.title)),
        label: r.text(crumb),
        body: [r.text(d.tagline)].filter(Boolean),
        image,
        button: "Book Demo",
        scene: image ? "" : scene,
        stats: p.showStats === false ? [] : r.stats(d.stats),
      },
      sections: [
        part({ label: "Overview", title: `${lead}${highlight ? ` [${highlight}]` : ""}`, body: (d.overview || []).map(r.text), image: r.img(p.overviewImage || d.overviewImage), button: "Book A Demo" }),
        part({ title: r.text(p.featuresTitle || `Everything ${d.title} gives your team`), cards: r.cards("features", d.features) }),
        ...(p.modules ? [part({ label: "Modules", title: r.text(p.modulesTitle), cards: r.modules(p.modules) })] : []),
        part({ label: "Key Features", title: r.text(p.enterpriseTitle || "Empowering business-critical communications with reliability and security."), cards: r.cards("features", p.enterprise), dark: true }),
        part({ label: "Business Benefits", title: r.text(p.benefitsTitle || "Why businesses choose it"), list: r.strings("checklist", d.benefits) }),
        part({ label: "Use Cases", title: "Perfect for", numbered: r.strings("tiles", d.useCases) }),
        part({ label: "FAQ", title: "Common [Questions]", faqs: r.faqs(d.faqs) }),
      ],
      cta: { title: r.text(`Ready to deploy ${d.title}?`), body: [r.text(p.ctaBody || "Talk to our telephony experts and get a tailored demo for your business within 24 hours.")], button: "Book a Free Demo" },
      related: true,
    },
  };
}

// A copy of a built-in page, as page content: { content, skipped } (skipped = one-off parts that can't be copied).
export async function copyPage({ path, file }) {
  const [{ default: Page }, edits] = await Promise.all([import(`../pages/${file}`), api("/content")]);
  // These pages only pass their data to a shared layout, so calling them gives that data without drawing anything.
  const el = Page();
  const r = reader(path, edits);
  if (el.type === FlexPage) return fromFlexPage(el.props, r);
  if (el.type === ProductPage) return fromProductPage(el.props, r);
  throw new Error("This page can't be copied.");
}
