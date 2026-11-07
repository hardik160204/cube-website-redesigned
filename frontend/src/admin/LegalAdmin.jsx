import React, { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, ExternalLink, Plus, Trash2 } from "lucide-react";
import { api } from "../lib/api";
import { PRIVACY } from "../pages/PrivacyPolicyPage";
import { TERMS } from "../pages/TermsPage";
import { REFUND } from "../pages/RefundPolicyPage";
import { Button, Card, Empty, Field, INPUT, PageTitle, act, useResource } from "./ui";

// The Privacy Policy, Terms & Conditions and Refund Policy, edited here and shown on the website at once.
// Each section's text: paragraphs separated by an empty line; lines starting with "- " make a bulleted list.
const PAGES = [
  ["privacy", "Privacy Policy", "/privacy", PRIVACY],
  ["terms", "Terms & Conditions", "/terms", TERMS],
  ["refund", "Refund Policy", "/refund-policy", REFUND],
];

const toText = (body) => body.map((b) => (Array.isArray(b) ? b.map((x) => `- ${x}`).join("\n") : b)).join("\n\n");
const fromText = (text) =>
  text
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const lines = block.split("\n").map((l) => l.trim());
      return lines.every((l) => l.startsWith("- ")) ? lines.map((l) => l.slice(2).trim()).filter(Boolean) : lines.join(" ");
    });
const editable = (doc) => ({ updated: doc.updated, intro: doc.intro, sections: doc.sections.map((s) => ({ title: s.title, text: toText(s.body) })) });
const today = () => new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

export default function LegalAdmin({ out }) {
  const [data, reload] = useResource("/admin/settings", out);
  const [page, setPage] = useState("privacy");
  const [doc, setDoc] = useState(null);
  const [dirty, setDirty] = useState(false);
  const [, label, path, builtIn] = PAGES.find(([k]) => k === page);
  const saved = data?.legal?.[page];
  useEffect(() => {
    if (data) {
      setDoc(editable(saved || builtIn));
      setDirty(false);
    }
  }, [data, page, saved, builtIn]);
  if (!doc) return <Empty>Loading...</Empty>;

  const change = (next) => {
    setDoc(next);
    setDirty(true);
  };
  const section = (i, patch) => change({ ...doc, sections: doc.sections.map((s, k) => (k === i ? { ...s, ...patch } : s)) });
  const move = (i, d) => {
    const s = [...doc.sections];
    [s[i], s[i + d]] = [s[i + d], s[i]];
    change({ ...doc, sections: s });
  };
  const write = (value) => api("/admin/settings/legal", { method: "PUT", body: { value: { ...(data.legal || {}), [page]: value } } });
  const save = async () => {
    const value = { updated: doc.updated.trim() || today(), intro: doc.intro, sections: doc.sections.map((s) => ({ title: s.title, body: fromText(s.text) })) };
    if (await act(() => write(value), `Saved. The ${label} on the website is updated.`)) reload();
  };
  const reset = async () =>
    window.confirm(`Go back to the built-in ${label}? Your edited version is removed.`) && (await act(() => write(null), "Back to the built-in text.")) && reload();

  return (
    <>
      <PageTitle
        title="Legal pages"
        desc="Edit the Privacy Policy, Terms & Conditions and Refund Policy. Changes show on the website as soon as you save. Have important changes checked by your legal adviser."
        actions={
          <>
            <select value={page} onChange={(e) => (!dirty || window.confirm("Leave without saving?")) && setPage(e.target.value)} className={`${INPUT} w-auto`} aria-label="Page">
              {PAGES.map(([k, l]) => (
                <option key={k} value={k}>
                  {l}
                </option>
              ))}
            </select>
            <a href={path} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-[#DCE2EE] bg-white px-3.5 py-2 text-[14px] font-medium text-[#0A0626] hover:bg-[#F0F4FB]">
              View page <ExternalLink size={14} />
            </a>
          </>
        }
      />
      <p className={`mb-4 rounded-xl px-4 py-3 text-[13px] ${saved ? "bg-[#E7F7EE] text-[#0F6B3A]" : "bg-[#F5F8FD] text-[#404348]"}`}>
        {saved ? "The website shows your edited version." : "The website shows the built-in text. Save to use your own."}
        {page === "refund" && !saved && " The built-in Refund Policy is a draft: check it matches how you actually bill and refund before launch."}
        {page === "privacy" && " Lines about Google Analytics and visitor details are added to the Cookies section by themselves while those are switched on."}
      </p>
      <Card>
        <div className="grid gap-4 md:grid-cols-[1fr_220px]">
          <Field label="Introduction (under the title)">
            <input value={doc.intro} maxLength={600} onChange={(e) => change({ ...doc, intro: e.target.value })} className={INPUT} />
          </Field>
          <Field label="Last updated" hint="Shown on the page and recorded with every form.">
            <div className="flex gap-2">
              <input value={doc.updated} maxLength={40} onChange={(e) => change({ ...doc, updated: e.target.value })} className={INPUT} />
              <Button variant="ghost" onClick={() => change({ ...doc, updated: today() })}>
                Today
              </Button>
            </div>
          </Field>
        </div>
      </Card>
      <div className="mt-6 space-y-4">
        {doc.sections.map((s, i) => (
          <Card key={i}>
            <div className="flex flex-wrap items-end gap-2">
              <Field label={`Section ${i + 1} title`} className="min-w-[240px] flex-1">
                <input value={s.title} maxLength={160} onChange={(e) => section(i, { title: e.target.value })} className={INPUT} />
              </Field>
              <Button variant="ghost" className="px-2.5" disabled={i === 0} onClick={() => move(i, -1)} aria-label="Move up">
                <ArrowUp size={15} />
              </Button>
              <Button variant="ghost" className="px-2.5" disabled={i === doc.sections.length - 1} onClick={() => move(i, 1)} aria-label="Move down">
                <ArrowDown size={15} />
              </Button>
              <Button variant="danger" className="px-2.5" disabled={doc.sections.length < 2} onClick={() => window.confirm(`Delete “${s.title}”?`) && change({ ...doc, sections: doc.sections.filter((_, k) => k !== i) })} aria-label="Delete section">
                <Trash2 size={15} />
              </Button>
            </div>
            <Field label="Text" hint='An empty line starts a new paragraph. Lines starting with "- " become a bulleted list.' className="mt-3">
              <textarea value={s.text} rows={Math.min(16, Math.max(4, s.text.split("\n").length + 1))} onChange={(e) => section(i, { text: e.target.value })} className={INPUT} />
            </Field>
          </Card>
        ))}
      </div>
      <div className="mt-4">
        <Button variant="ghost" onClick={() => change({ ...doc, sections: [...doc.sections, { title: "New section", text: "" }] })}>
          <Plus size={15} /> Add a section
        </Button>
      </div>
      <div className="sticky bottom-3 z-10 mt-6 flex flex-wrap items-center justify-end gap-3 rounded-2xl border border-[#E5EAF4] bg-white p-3 shadow-[0_12px_30px_-18px_rgb(10_6_38/0.4)]">
        <span className={`mr-auto text-[13px] ${dirty ? "text-[#9A5B00]" : "text-[#0F6B3A]"}`}>{dirty ? "You have unsaved changes" : "Everything is saved"}</span>
        {saved && (
          <Button variant="ghost" onClick={reset}>
            Use the built-in text
          </Button>
        )}
        <Button disabled={!dirty} onClick={save}>
          Save
        </Button>
      </div>
    </>
  );
}
