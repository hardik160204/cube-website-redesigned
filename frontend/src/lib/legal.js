import { useEffect, useState } from "react";
import { api } from "./api";

// A legal page (privacy, terms, refund) as edited in the dashboard's Legal pages, or null when it uses the
// built-in text (also while loading, so the page never waits on it).
const cache = {};
export function useLegal(page) {
  const [doc, setDoc] = useState(cache[page] ?? null);
  useEffect(() => {
    if (page in cache) return undefined;
    let live = true;
    api(`/legal/${page}`)
      .then((d) => {
        cache[page] = d.doc;
        if (live) setDoc(d.doc);
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [page]);
  return doc;
}
