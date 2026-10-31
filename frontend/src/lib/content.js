import { useEffect, useState } from "react";
import { api } from "./api";

// The edits made in the admin's visual editor, fetched once and shared by everything that shows editable
// content: text and image swaps (overrides) and whole card lists (lists). The editor updates it after a save,
// so the page changes without a reload.

let state = { overrides: [], lists: [] };
const subscribers = new Set();
let loading = null;

export function setContent(patch) {
  state = { ...state, ...patch };
  subscribers.forEach((fn) => fn(state));
}

export function useContent() {
  const [s, setS] = useState(state);
  useEffect(() => {
    subscribers.add(setS);
    setS(state);
    loading ||= api("/content")
      .then((d) => setContent({ overrides: d.overrides || [], lists: d.lists || [] }))
      .catch(() => {});
    return () => subscribers.delete(setS);
  }, []);
  return s;
}

export const pagePath = (pathname) => pathname.replace(/\/+$/, "") || "/";

// Uploaded videos play in a <video>; everything else is a picture (GIF and WebP animate on their own).
export const isVideo = (src) => /\.(mp4|webm)(\?|#|$)/i.test(String(src || ""));
