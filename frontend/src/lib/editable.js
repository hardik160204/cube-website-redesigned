import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Award, BarChart3, Briefcase, Building, CheckCircle2, Clock, Cloud, Database, Eye, EyeOff, FileText, Globe, GraduationCap, Hand,
  Headphones, Headset, HeartPulse, Highlighter, KeyRound, Layers, LayoutGrid, LineChart, Lock, Mail, MessageCircle, MessageSquare,
  Mic, MonitorPlay, MonitorSmartphone, MousePointer2, MousePointerClick, PenLine, Phone, PhoneCall, PhoneIncoming, PhoneOutgoing,
  Plug, Rocket, Route, ScreenShare, Server, Settings, ShieldCheck, Smartphone, Sparkles, Star, Target, ThumbsUp, UserCheck, Users,
  Video, Voicemail, Wifi, Workflow, Zap,
} from "lucide-react";
import {
  Activity, AlertCircle, AlertTriangle, ArrowUpRight, AudioLines, BarChart, Bell, BellRing, Bot, Box, BrainCircuit, Building2, CalendarClock, Car, Code, Cpu, DatabaseZap,
  Disc, Download, Ear, FileAudio, FileSpreadsheet, Filter, Forward, Gauge, GitBranch, GitMerge, HardDrive, Heart, History, Home, Hourglass, ImageIcon, Inbox, Key, Landmark,
  Languages, LayoutDashboard, LayoutTemplate, LifeBuoy, Link2, LinkIcon, ListChecks, Map as MapIcon, MapPin, Maximize, Megaphone, Monitor, MousePointer, Network, Percent,
  PhoneForwarded, PhoneOff, PieChart, Play, PlayCircle, Puzzle, Radio, Receipt, RefreshCw, Repeat, Search, Send, Shield, ShoppingBag, ShoppingCart, Stethoscope, TrendingUp,
  UserCog, UserX,
} from "lucide-react";
import { pagePath, useContent } from "./content";

// Card lists an admin can rewrite on the site (add, remove, reorder and change cards). Any list drawn through
// useList or useCards is editable: it is identified by its built-in content, so the same list keeps its edits
// on every visit. If the built-in content is later changed in the code, the list starts fresh from the new
// version (its saved edit stays in the database).

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
export const STARTER_ICONS = [...ICONS.keys()].sort();
// Also available in the page builder and the navigation bar: every icon the site's own pages use.
for (const C of [
  Activity, AlertCircle, AlertTriangle, ArrowUpRight, AudioLines, BarChart, Bell, BellRing, Bot, Box, BrainCircuit, Building2, CalendarClock, Car, Code, Cpu, DatabaseZap,
  Disc, Download, Ear, FileAudio, FileSpreadsheet, Filter, Forward, Gauge, GitBranch, GitMerge, HardDrive, Heart, History, Home, Hourglass, ImageIcon, Inbox, Key, Landmark,
  Languages, LayoutDashboard, LayoutTemplate, LifeBuoy, Link2, LinkIcon, ListChecks, MapIcon, MapPin, Maximize, Megaphone, Monitor, MousePointer, Network, Percent,
  PhoneForwarded, PhoneOff, PieChart, Play, PlayCircle, Puzzle, Radio, Receipt, RefreshCw, Repeat, Search, Send, Shield, ShoppingBag, ShoppingCart, Stethoscope, TrendingUp,
  UserCog, UserX,
]) ICONS.set(C.displayName, C);

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

// Custom cards declare their fields: text, numbers, on/off values, lists of text, and an icon.
const firstField = (fields) => Object.keys(fields).find((k) => k !== "icon");
// The address saved edits to a list are stored under: its built-in first-field text.
export const listKey = (kind, items, fields) => `${kind}:${hash(items.map(fields ? (it) => String(it[firstField(fields)] ?? "") : textOf).join("|"))}`;
const isCardPlain = (items, fields) =>
  items.every((it) => it && typeof it === "object" && Object.keys(fields).every((k) => k === "icon" || it[k] == null || ["string", "number", "boolean"].includes(typeof it[k]) || (Array.isArray(it[k]) && it[k].every((x) => typeof x === "string"))));

// The built-in cards as the editor shows them: plain text, icons by name.
export function toPlain(kind, items, fields) {
  if (fields) return items.map((it) => Object.fromEntries(Object.keys(fields).map((k) => [k, k === "icon" ? it.icon?.displayName || "" : Array.isArray(it[k]) || typeof it[k] === "boolean" ? it[k] : it[k] == null ? "" : String(it[k])])));
  if (!FIELDS[kind]) return items.map(String);
  return items.map((it) => Object.fromEntries(FIELDS[kind].map((k) => [k, k === "icon" ? it.icon?.displayName || "" : (k === "desc" ? it.desc ?? it.description : it[k]) ?? ""])));
}
const fromPlain = (kind, items) => (kind === "card" || FIELDS[kind]?.includes("icon") ? items.map((it) => ("icon" in it ? { ...it, icon: ICONS.get(it.icon) } : it)) : items);

// Lists on screen right now, for the editor ("Edit cards").
export const mounted = new Map(); // key -> { kind, items, label, fields }
const watchers = new Set();
export const watchMounted = (fn) => (watchers.add(fn), () => watchers.delete(fn));
const changed = () => watchers.forEach((fn) => fn());

// Returns the cards to show (the admin's version on this page, else on every page, else the built-in ones)
// and `mark`, the attribute that lets the editor find the list on the page.
export function useList(kind, items, fields) {
  const path = pagePath(useLocation().pathname);
  const { lists } = useContent();
  const ok = Array.isArray(items) && items.length > 0 && (fields ? isCardPlain(items, fields) : isPlain(items));
  const label = fields ? (it) => String(it[firstField(fields)] ?? "") : textOf;
  const key = ok ? listKey(kind, items, fields) : null;
  if (ok) for (const it of items) if (it?.icon?.displayName) ICONS.set(it.icon.displayName, it.icon);
  const own = key && (lists.find((l) => l.key === key && l.scope === path) || lists.find((l) => l.key === key && l.scope === "*"));

  useEffect(() => {
    if (!key || !editing()) return undefined;
    mounted.set(key, { kind, items: toPlain(kind, items, fields), label: label(items[0]), fields });
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

// Any custom group of cards. `fields` maps each field to its label in the editor; what a field is follows from
// its name (icon, img/image/logo/src = picture, path/href/to = link) or its built-in value (a list, on/off).
export const useCards = (items, fields) => useList("card", items, fields);
