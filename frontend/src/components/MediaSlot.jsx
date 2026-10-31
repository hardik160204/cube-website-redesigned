import React from "react";
import { useLocation } from "react-router-dom";
import { isVideo, pagePath, useContent } from "../lib/content";

// A spot showing one of the site's animations (or its art) that an admin can swap, in the visual editor, for
// their own video, GIF or picture — on this page or on every page. Without a swap it adds nothing to the
// layout (display: contents) and shows its children as before.
export function Media({ src, alt = "", className = "" }) {
  return isVideo(src) ? <video src={src} autoPlay loop muted playsInline aria-hidden={alt ? undefined : "true"} className={className} /> : <img src={src} alt={alt} className={className} />;
}

export default function MediaSlot({ id, className = "relative", mediaClass = "w-full", children }) {
  const path = pagePath(useLocation().pathname);
  const { overrides } = useContent();
  const original = `slot:${id}`;
  const find = (scope) => overrides.find((o) => o.kind === "image" && o.original === original && o.scope === scope && o.replacement);
  const swap = find(path) || find("*");
  if (!swap) return <div data-cube-slot={id} className="contents">{children}</div>;
  return (
    <div data-cube-slot={id} className={className}>
      <Media src={swap.replacement} className={mediaClass} />
    </div>
  );
}
