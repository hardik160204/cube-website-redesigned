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
    whenContentLoaded();
    return () => subscribers.delete(setS);
  }, []);
  return s;
}

// Fetches the edits once; resolves when they are in (or failed to load).
export const whenContentLoaded = () =>
  (loading ||= api("/content")
    .then((d) => setContent({ overrides: d.overrides || [], lists: d.lists || [] }))
    .catch(() => {}));

// Fetches them again (a tab left open, when the visitor comes back to it); a failure keeps what's shown.
export const refreshContent = () => {
  loading = null;
  return whenContentLoaded();
};

export const pagePath = (pathname) => pathname.replace(/\/+$/, "") || "/";

// Uploaded videos play in a <video>; everything else is a picture (GIF and WebP animate on their own).
export const isVideo = (src) => /\.(mp4|webm)(\?|#|$)/i.test(String(src || ""));
