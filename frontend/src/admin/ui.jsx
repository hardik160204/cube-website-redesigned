import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "../lib/api";

// Small building blocks shared by the admin screens.

export const INPUT =
  "w-full rounded-lg border border-[#DCE2EE] bg-white px-3 py-2 text-[14px] text-[#0A0626] transition-[border-color,box-shadow] duration-150 placeholder:text-[#9CA3AF] focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10";

export function Button({ variant = "primary", className = "", ...props }) {
  const look = {
    primary: "bg-primary text-white hover:bg-[#2300DC]",
    ghost: "border border-[#DCE2EE] bg-white text-[#0A0626] hover:bg-[#F0F4FB]",
    danger: "border border-[#F5C7C7] bg-white text-[#C81E1E] hover:bg-[#FFF1F1]",
  }[variant];
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-[14px] font-medium transition-[background-color,transform] duration-150 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 ${look} ${className}`}
      {...props}
    />
  );
}

export function Field({ label, hint, children, className = "" }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-[13px] font-medium text-[#404348]">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[12px] text-[#6B6E75]">{hint}</span>}
    </label>
  );
}

export function Card({ title, actions, children, className = "" }) {
  return (
    <section className={`rounded-2xl border border-[#E5EAF4] bg-white ${className}`}>
      {(title || actions) && (
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EEF1F7] px-5 py-4">
          {title && <h2 className="text-[16px] font-medium text-[#0A0626]">{title}</h2>}
          {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
        </header>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}

export function PageTitle({ title, desc, actions }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-[26px] font-medium text-[#0A0626]">{title}</h1>
        {desc && <p className="mt-1 text-[14px] text-[#6B6E75]">{desc}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export const Empty = ({ children }) => <p className="rounded-xl bg-[#F5F8FD] p-6 text-center text-[14px] text-[#6B6E75]">{children}</p>;

// GET a resource, with reload (no path = nothing to load). Errors become a toast; 401 sends the admin back
// to sign in.
export function useResource(path, onUnauthorized) {
  const [data, setData] = useState(null);
  const reload = useCallback(
    () =>
      !path
        ? Promise.resolve()
        : api(path)
            .then(setData)
            .catch((e) => (e.status === 401 ? onUnauthorized?.() : toast.error(e.message))),
    [path, onUnauthorized]
  );
  useEffect(() => {
    reload();
  }, [reload]);
  return [data, reload];
}

// Run a change and report the result.
export async function act(fn, success) {
  try {
    const r = await fn();
    if (success) toast.success(success);
    return r ?? true;
  } catch (e) {
    toast.error(e.message);
    return false;
  }
}

export const istTime = (iso) =>
  new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", weekday: "short", day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(iso));

// Database timestamps arrive as ISO strings.
export const utcStamp = (s) => istTime(s);

// Pixel size of an image file, read once it loads (null until then).
export function useNatural(src) {
  const [size, setSize] = useState(null);
  useEffect(() => {
    setSize(null);
    if (!src) return undefined;
    const im = new Image();
    im.onload = () => setSize({ w: im.naturalWidth, h: im.naturalHeight });
    im.src = src;
    return () => {
      im.onload = null;
    };
  }, [src]);
  return size;
}

export function ImageSize({ src, className = "" }) {
  const size = useNatural(src);
  return <span className={className}>{size ? `${size.w} × ${size.h} px` : "…"}</span>;
}

// Download rows as a CSV file. Cells that start like a formula are prefixed so spreadsheets don't run them.
export function downloadCsv(name, rows, columns) {
  const cell = (v) => {
    let s = String(v ?? "");
    if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
    return `"${s.replace(/"/g, '""')}"`;
  };
  const csv = [columns.map(([, label]) => cell(label)).join(","), ...rows.map((r) => columns.map(([k]) => cell(typeof k === "function" ? k(r) : r[k])).join(","))].join("\r\n");
  const url = URL.createObjectURL(new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8" }));
  const a = Object.assign(document.createElement("a"), { href: url, download: name });
  a.click();
  URL.revokeObjectURL(url);
}
