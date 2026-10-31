import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Award, BarChart3, Briefcase, Building, CheckCircle2, Clock, Cloud, Database, Eye, EyeOff, FileText, Globe, GraduationCap, Hand,
  Headphones, Headset, HeartPulse, Highlighter, KeyRound, Layers, LayoutGrid, LineChart, Lock, Mail, MessageCircle, MessageSquare,
  Mic, MonitorPlay, MonitorSmartphone, MousePointer2, MousePointerClick, PenLine, Phone, PhoneCall, PhoneIncoming, PhoneOutgoing,
  Plug, Rocket, Route, ScreenShare, Server, Settings, ShieldCheck, Smartphone, Sparkles, Star, Target, ThumbsUp, UserCheck, Users,
  Video, Voicemail, Wifi, Workflow, Zap,
} from "lucide-react";
import { pagePath, useContent } from "./content";

// Card lists an admin can rewrite on the site (add, remove, reorder and change cards). Any list drawn by the
// shared components (feature cards, steps, check lists, tiles, FAQs, product cards) is editable: it is
// identified by its built-in content, so the same list keeps its edits on every visit. If the built-in
// content is later changed in the code, the list starts fresh from the new version.

export const EDIT_FLAG = "cube_edit";
export const editing = () => {
  try {
    return sessionStorage.getItem(EDIT_FLAG) === "1";
  } catch {
    return false;
  }
};

// Icons are stored by name. The starter set is what the editor offers; lists on the page add their own.
export const ICONS = new Map(
  [
    Phone, PhoneCall, PhoneIncoming, PhoneOutgoing, Headset, Headphones, Mic, Voicemail, MessageSquare, MessageCircle, Mail, Video,
    MonitorPlay, MonitorSmartphone, ScreenShare, MousePointerClick, MousePointer2, Highlighter, PenLine, Hand, Eye, EyeOff, Lock,
    ShieldCheck, KeyRound, Users, UserCheck, Globe, Cloud, Database, Server, Zap, Clock, BarChart3, LineChart, Workflow, Route, Plug,
    Settings, Sparkles, CheckCircle2, Smartphone, Wifi, FileText, Building, Briefcase, GraduationCap, HeartPulse, Rocket, Target, Award,
    Star, ThumbsUp, Layers, LayoutGrid,
  ].map((C) => [C.displayName, C])
);

// What each kind of card holds, as plain text (lists may only be edited when every card is plain text).
const FIELDS = {
  features: ["icon", "title", "desc"],
  steps: ["icon", "title", "desc"],
  faq: ["q", "a"],
  products: ["title", "tag", "tagline", "img", "href"],
};
const textOf = (it) => (typeof it === "string" ? it : it.title || it.q || "");
const isPlain = (items) =>
  items.every((it) => typeof it === "string" || (it && typeof it === "object" && ["title", "desc", "description", "q", "a", "tag", "tagline", "img", "href"].every((k) => it[k] == null || typeof it[k] === "string")));
const hash = (s) => {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0;
  return h.toString(36);
};

// The built-in cards as the editor shows them: plain text, icons by name.
export function toPlain(kind, items) {
  if (!FIELDS[kind]) return items.map(String);
  return items.map((it) => Object.fromEntries(FIELDS[kind].map((k) => [k, k === "icon" ? it.icon?.displayName || "" : (k === "desc" ? it.desc ?? it.description : it[k]) ?? ""])));
}
const fromPlain = (kind, items) => (FIELDS[kind]?.includes("icon") ? items.map((it) => ({ ...it, icon: ICONS.get(it.icon) })) : items);

// Lists on screen right now, for the editor ("Edit cards").
export const mounted = new Map(); // key -> { kind, items, label }
const watchers = new Set();
export const watchMounted = (fn) => (watchers.add(fn), () => watchers.delete(fn));
const changed = () => watchers.forEach((fn) => fn());

// Returns the cards to show (the admin's version on this page, else on every page, else the built-in ones)
// and `mark`, the attribute that lets the editor find the list on the page.
export function useList(kind, items) {
  const path = pagePath(useLocation().pathname);
  const { lists } = useContent();
  const ok = Array.isArray(items) && items.length > 0 && isPlain(items);
  const key = ok ? `${kind}:${hash(items.map(textOf).join("|"))}` : null;
  if (ok) for (const it of items) if (it?.icon?.displayName) ICONS.set(it.icon.displayName, it.icon);
  const own = key && (lists.find((l) => l.key === key && l.scope === path) || lists.find((l) => l.key === key && l.scope === "*"));

  useEffect(() => {
    if (!key || !editing()) return undefined;
    mounted.set(key, { kind, items: toPlain(kind, items), label: textOf(items[0]) });
    changed();
    return () => {
      mounted.delete(key);
      changed();
    };
    // items are identified by key, which changes whenever their content does.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, kind]);

  return { items: own ? fromPlain(kind, own.items) : items, mark: key ? { "data-cube-list": key } : {} };
}
