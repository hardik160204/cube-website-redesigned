import { useEffect, useState } from "react";
import { api } from "./api";

// Cookie consent (India DPDP Act 2023, UAE PDPL; EU-style rules for EU visitors): free, specific, informed,
// and as easy to withdraw as to give. Strictly necessary storage is always on; optional categories stay off
// until the visitor turns them on. The choice lives in this browser and expires after 12 months, when the
// visitor is asked again. A receipt (random id, choices, notice version, time) is kept on the server.
// Bump VERSION when the cookie notice changes so everyone is asked again.
const KEY = "cube_consent";
export const VERSION = "2026-10-27b";
const MAX_AGE_MS = 365 * 86_400_000;
const CHANGED = "cube:consent";
const OPEN = "cube:cookie-settings";

export function readConsent() {
  try {
    const c = JSON.parse(localStorage.getItem(KEY));
    if (!c || c.version !== VERSION || !(Date.now() - Date.parse(c.at) < MAX_AGE_MS)) return null;
    return c;
  } catch {
    return null;
  }
}

export function saveConsent({ functional, analytics }) {
  const prev = readConsent();
  const c = { id: prev?.id, functional: Boolean(functional), analytics: Boolean(analytics), version: VERSION, at: new Date().toISOString() };
  const store = (v) => {
    try {
      localStorage.setItem(KEY, JSON.stringify(v));
    } catch {
      /* storage blocked: the choice still applies for this visit */
    }
  };
  store(c);
  window.dispatchEvent(new CustomEvent(CHANGED, { detail: c }));
  api("/consents", { method: "POST", body: { id: c.id, functional: c.functional, analytics: c.analytics, marketing: false, version: VERSION } })
    .then(({ id }) => store({ ...c, id }))
    .catch(() => {});
  return c;
}

export const openCookieSettings = () => window.dispatchEvent(new Event(OPEN));

export function useConsent() {
  const [consent, setConsent] = useState(readConsent);
  useEffect(() => {
    const on = (e) => setConsent(e.detail);
    window.addEventListener(CHANGED, on);
    return () => window.removeEventListener(CHANGED, on);
  }, []);
  return consent;
}

export function useCookieSettingsRequest(handler) {
  useEffect(() => {
    window.addEventListener(OPEN, handler);
    return () => window.removeEventListener(OPEN, handler);
  }, [handler]);
}

// One page view, only with analytics consent: the path, and the referring site's name on the first page
// of a visit. No cookie or identifier is set or sent.
export function recordPageView(path) {
  if (!readConsent()?.analytics || path.startsWith("/admin")) return;
  let ref = "";
  try {
    if (!sessionStorage.getItem("cube_pv")) {
      sessionStorage.setItem("cube_pv", "1");
      const host = document.referrer ? new URL(document.referrer).hostname : "";
      if (host && host !== window.location.hostname) ref = host;
    }
  } catch {
    /* storage or referrer unavailable */
  }
  fetch("/api/pv", { method: "POST", keepalive: true, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ path, ref }) }).catch(() => {});
}
