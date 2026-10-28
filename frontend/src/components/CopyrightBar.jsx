import React from "react";
import { Link } from "react-router-dom";
import { openCookieSettings } from "../lib/consent";

// A thin strip pinned to the bottom of the screen on every page: the copyright line and the legal links.
// App.js pads the page by the strip's height so it never covers the end of the footer.
export default function CopyrightBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-white/10 bg-[#0A0626]/95 backdrop-blur">
      <div className="mx-auto flex h-9 max-w-7xl items-center justify-center gap-x-4 px-4 text-[11px] text-[#9FD6FF] sm:justify-between sm:text-[12.5px]">
        <p className="truncate">
          Copyright © {new Date().getFullYear()}. <span className="font-semibold text-[#D6F0FF]">Cube Software Pvt. Ltd.</span> All Rights Reserved
        </p>
        <button type="button" onClick={openCookieSettings} className="shrink-0 underline underline-offset-2 sm:hidden">
          Cookies
        </button>
        <nav aria-label="Legal" className="hidden shrink-0 items-center gap-4 sm:flex">
          <Link to="/terms" className="transition-colors hover:text-white">
            Terms &amp; Conditions
          </Link>
          <Link to="/privacy" className="transition-colors hover:text-white">
            Privacy Policy
          </Link>
          <button type="button" onClick={openCookieSettings} className="transition-colors hover:text-white">
            Cookie settings
          </button>
        </nav>
      </div>
    </div>
  );
}
