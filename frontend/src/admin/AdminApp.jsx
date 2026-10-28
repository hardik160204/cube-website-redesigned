import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BarChart3, CalendarClock, Users, CalendarDays, FileCheck2, FileText, History, UserSearch, Image, Inbox, LayoutDashboard, LogOut, Menu, PencilLine, Settings, ShieldCheck, Trash2, UserCog, X } from "lucide-react";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";
import { api } from "../lib/api";
import { Button, Card, Empty, Field, INPUT, PageTitle, act, downloadCsv, istTime, useResource, utcStamp } from "./ui";
import BlogAdmin from "./BlogAdmin";
import MediaAdmin from "./MediaAdmin";
import ContentAdmin, { startEditing } from "./ContentAdmin";
import CalendarAdmin from "./CalendarAdmin";
import ConsentAdmin from "./ConsentAdmin";
import TeamAdmin from "./TeamAdmin";
import { AnalyticsAdmin, PrivacyAdmin, SecurityAdmin } from "./ComplianceAdmin";

// The admin dashboard at /admin: demo bookings, enquiries, blog, site edits, images, settings and accounts.
// Everything here talks to /api/admin, which checks the session on every request.

const NAV = [
  ["", "Overview", LayoutDashboard],
  ["bookings", "Demo bookings", CalendarDays],
  ["calendar", "Demo calendar", CalendarClock],
  ["leads", "Enquiries", Inbox],
  ["blog", "Blog", FileText],
  ["content", "Site content", PencilLine],
  ["media", "Images", Image],
  ["team", "Team & social links", Users],
  ["analytics", "Visitor analytics", BarChart3],
  ["consents", "Consent records", FileCheck2],
  ["privacy", "Privacy requests", UserSearch],
  ["security", "Security log", History],
  ["settings", "Settings", Settings],
  ["account", "Admins & password", UserCog],
];

const INTEREST = { "cloud-contact-center": "Cloud Contact Center", "voice-logger": "Voice Logger", "call-billing": "Call Billing Software", ivrs: "IVRS Services", other: "Other" };

// Two steps: password, then a 6-digit code from the admin's authenticator app (Google/Microsoft
// Authenticator). The first time, the admin scans a QR to add the account; after that they just type the code.
function Login({ onDone }) {
  const [step, setStep] = useState("password"); // password | totp | totp_setup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [setup, setSetup] = useState(null); // { otpauth, secret } during first-time enrolment
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const run = async (fn) => {
    setBusy(true);
    setError("");
    try {
      await fn();
    } catch (err) {
      setError(err.message);
      if (err.status === 401 && /start again/i.test(err.message)) {
        setStep("password");
        setSetup(null);
        setCode("");
      }
    } finally {
      setBusy(false);
    }
  };

  const submitPassword = (e) => {
    e.preventDefault();
    run(async () => {
      const r = await api("/admin/login", { method: "POST", body: { email, password } });
      setPassword("");
      if (r.step === "totp_setup") setSetup({ otpauth: r.otpauth, secret: r.secret });
      setStep(r.step);
    });
  };
  const submitCode = (e) => {
    e.preventDefault();
    run(async () => onDone((await api("/admin/login/code", { method: "POST", body: { code: code.trim() } })).admin));
  };

  const codeStep = step === "totp" || step === "totp_setup";

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0A0626] p-4">
      <form onSubmit={codeStep ? submitCode : submitPassword} className="w-full max-w-[420px] rounded-3xl bg-white p-8 shadow-[0_40px_80px_-30px_rgb(0_0_0/0.6)]">
        <img src="/logo75.png" alt="Cube Software" className="h-9 w-auto" />
        <h1 className="mt-6 text-[24px] font-medium text-[#0A0626]">
          {step === "password" ? "Admin sign in" : step === "totp_setup" ? "Set up your authenticator" : "Enter your code"}
        </h1>

        {step === "password" && (
          <>
            <p className="mt-1 text-[14px] text-[#6B6E75]">For Cube Software staff only.</p>
            <div className="mt-6 space-y-4">
              <Field label="Email">
                <input type="email" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className={INPUT} />
              </Field>
              <Field label="Password">
                <input type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className={INPUT} />
              </Field>
            </div>
          </>
        )}

        {step === "totp_setup" && setup && (
          <>
            <p className="mt-1 text-[14px] leading-6 text-[#6B6E75]">
              Install <b>Google Authenticator</b> or <b>Microsoft Authenticator</b> on your phone, add an account, and scan this QR code. Then enter the 6-digit code it shows.
            </p>
            <div className="mt-5 flex justify-center rounded-2xl border border-[#E5EAF4] bg-white p-4">
              <QRCodeSVG value={setup.otpauth} size={176} marginSize={1} />
            </div>
            <details className="mt-3 text-[13px] text-[#6B6E75]">
              <summary className="cursor-pointer select-none">Can't scan? Enter this key by hand</summary>
              <code className="mt-2 block break-all rounded-lg bg-[#F5F8FD] p-3 font-mono text-[12px] text-[#0A0626]">{setup.secret}</code>
            </details>
          </>
        )}

        {step === "totp" && <p className="mt-1 text-[14px] text-[#6B6E75]">Open your authenticator app and enter the current 6-digit code for Cube Software.</p>}

        {codeStep && (
          <div className="mt-5">
            <Field label="6-digit code">
              <input
                required
                autoFocus
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]{6}"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                className={`${INPUT} text-center font-mono text-[22px] tracking-[0.4em]`}
              />
            </Field>
          </div>
        )}

        {error && (
          <p role="alert" className="mt-4 rounded-lg bg-[#FFF1F1] px-3 py-2 text-[13px] text-[#C81E1E]">
            {error}
          </p>
        )}

        <Button type="submit" disabled={busy} className="mt-6 w-full py-2.5">
          {busy ? "Checking..." : step === "password" ? "Continue" : step === "totp_setup" ? "Confirm and sign in" : "Verify and sign in"}
        </Button>

        {codeStep && (
          <button
            type="button"
            onClick={() => (setStep("password"), setSetup(null), setCode(""), setError(""))}
            className="mt-4 block w-full text-center text-[13px] font-medium text-[#6B6E75] hover:text-[#0A0626]"
          >
            Use a different account
          </button>
        )}

        <p className="mt-5 flex items-start gap-2 text-[12px] leading-5 text-[#6B6E75]">
          <ShieldCheck size={14} className="mt-0.5 shrink-0 text-primary" /> Sign-in needs your password and a code from your authenticator app. Five wrong passwords lock
          the account for 15 minutes; you're signed out after 30 minutes of inactivity.
        </p>
      </form>
    </div>
  );
}

function Overview({ out }) {
  const [stats] = useResource("/admin/stats", out);
  const [data] = useResource("/admin/bookings", out);
  const upcoming = (data?.bookings || []).filter((b) => b.status === "scheduled" && new Date(b.slot_start) >= new Date()).reverse().slice(0, 8);
  const tiles = stats
    ? [
        ["Upcoming demos", stats.upcoming, "bookings"],
        ["All demo bookings", stats.bookings, "bookings"],
        ["Enquiries this week", stats.leadsWeek, "leads"],
        ["All enquiries", stats.leads, "leads"],
        ["Blog posts", stats.posts, "blog"],
        ["Site edits", stats.edits, "content"],
      ]
    : [];
  return (
    <>
      <PageTitle title="Overview" desc="What's happening on the website." actions={<Button onClick={startEditing}><PencilLine size={16} /> Edit the website</Button>} />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {tiles.map(([label, n, to]) => (
          <Link key={label} to={`/admin/${to}`} className="rounded-2xl border border-[#E5EAF4] bg-white p-5 transition-colors hover:border-primary/40">
            <span className="text-[13px] text-[#6B6E75]">{label}</span>
            <span className="mt-1 block text-[30px] font-medium text-[#0A0626]">{n}</span>
          </Link>
        ))}
      </div>
      <Card title="Next demos" className="mt-6">
        {upcoming.length === 0 ? (
          <Empty>No upcoming demos yet.</Empty>
        ) : (
          <ul className="divide-y divide-[#EEF1F7]">
            {upcoming.map((b) => (
              <li key={b.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-[14px]">
                <span>
                  <span className="font-medium text-[#0A0626]">{b.name}</span> <span className="text-[#6B6E75]">· {b.company}</span>
                </span>
                <span className="text-[#404348]">{istTime(b.slot_start)} IST</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}

function Bookings({ out }) {
  const [data, reload] = useResource("/admin/bookings", out);
  const [filter, setFilter] = useState("upcoming");
  const all = data?.bookings || [];
  const now = new Date();
  const rows = filter === "all" ? all : all.filter((b) => b.status === "scheduled" && new Date(b.slot_start) >= now).reverse();
  const setStatus = async (b, status) => (await act(() => api(`/admin/bookings/${b.id}`, { method: "PATCH", body: { status } }), "Status updated")) && reload();
  const remove = async (b) => window.confirm(`Delete the booking from ${b.name}? This cannot be undone.`) && (await act(() => api(`/admin/bookings/${b.id}`, { method: "DELETE" }), "Deleted")) && reload();
  return (
    <>
      <PageTitle
        title="Demo bookings"
        desc="Every booking is also emailed to the sales team with a calendar invite. Times are India Standard Time."
        actions={
          <>
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className={`${INPUT} w-auto`} aria-label="Show">
              <option value="upcoming">Upcoming</option>
              <option value="all">All bookings</option>
            </select>
            <Button
              variant="ghost"
              onClick={() =>
                downloadCsv("cube-demo-bookings.csv", all, [
                  [(b) => istTime(b.slot_start), "Time (IST)"],
                  ["timezone", "Visitor time zone"],
                  ["name", "Name"],
                  ["email", "Email"],
                  ["phone", "Phone"],
                  ["company", "Company"],
                  ["designation", "Designation"],
                  ["users", "Users"],
                  [(b) => INTEREST[b.interest] || b.interest, "Interested in"],
                  ["message", "Message"],
                  ["status", "Status"],
                  [(b) => utcStamp(b.created_at), "Booked on"],
                  [(b) => utcStamp(b.consent_at), "Agreed to Terms & Privacy"],
                  ["terms_version", "Policy version"],
                ])
              }
            >
              Export CSV
            </Button>
          </>
        }
      />
      <Card>
        {!data ? (
          <Empty>Loading...</Empty>
        ) : rows.length === 0 ? (
          <Empty>No bookings here.</Empty>
        ) : (
          <div className="-m-5 overflow-x-auto">
            <table className="w-full min-w-[960px] text-left text-[14px]">
              <thead className="bg-[#F5F8FD] text-[12px] uppercase tracking-[0.06em] text-[#6B6E75]">
                <tr>
                  {["When (IST)", "Visitor", "Contact", "Details", "Status", ""].map((h) => (
                    <th key={h} className="px-5 py-3 font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEF1F7] align-top">
                {rows.map((b) => (
                  <tr key={b.id}>
                    <td className="px-5 py-3">
                      <span className="font-medium text-[#0A0626]">{istTime(b.slot_start)}</span>
                      <span className="block text-[12px] text-[#6B6E75]">Visitor's zone: {b.timezone}</span>
                      <span className="block text-[12px] text-[#0F6B3A]" title={b.terms_version}>Agreed to Terms &amp; Privacy {utcStamp(b.consent_at)}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="font-medium text-[#0A0626]">{b.name}</span>
                      <span className="block text-[#6B6E75]">
                        {b.company}
                        {b.designation && ` · ${b.designation}`}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <a href={`mailto:${b.email}`} className="block text-primary hover:underline">
                        {b.email}
                      </a>
                      <a href={`tel:${b.phone.replace(/[^\d+]/g, "")}`} className="text-[#404348]">
                        {b.phone}
                      </a>
                    </td>
                    <td className="max-w-[280px] px-5 py-3 text-[#404348]">
                      {[INTEREST[b.interest], b.users && `${b.users} users`].filter(Boolean).join(" · ")}
                      {b.message && <span className="mt-1 block whitespace-pre-wrap text-[13px] text-[#6B6E75]">{b.message}</span>}
                    </td>
                    <td className="px-5 py-3">
                      <select value={b.status} onChange={(e) => setStatus(b, e.target.value)} className={`${INPUT} w-auto`} aria-label="Status">
                        <option value="scheduled">Scheduled</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled (frees the slot)</option>
                      </select>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Button variant="danger" onClick={() => remove(b)} aria-label={`Delete booking from ${b.name}`}>
                        <Trash2 size={15} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}

function Leads({ out }) {
  const [data, reload] = useResource("/admin/leads", out);
  const rows = data?.leads || [];
  const remove = async (l) => window.confirm(`Delete the enquiry from ${l.name}? This cannot be undone.`) && (await act(() => api(`/admin/leads/${l.id}`, { method: "DELETE" }), "Deleted")) && reload();
  return (
    <>
      <PageTitle
        title="Enquiries"
        desc="Messages from the Contact page. Each one is also emailed to the sales team."
        actions={
          <Button
            variant="ghost"
            onClick={() =>
              downloadCsv("cube-enquiries.csv", rows, [
                [(l) => utcStamp(l.created_at), "Received"],
                ["name", "Name"],
                ["email", "Email"],
                ["phone", "Phone"],
                ["company", "Company"],
                ["designation", "Designation"],
                ["website", "Website"],
                [(l) => INTEREST[l.interest] || l.interest, "Interested in"],
                ["users", "Users"],
                ["message", "Message"],
                [(l) => utcStamp(l.consent_at), "Agreed to Terms & Privacy"],
                ["terms_version", "Policy version"],
              ])
            }
          >
            Export CSV
          </Button>
        }
      />
      <Card>
        {!data ? (
          <Empty>Loading...</Empty>
        ) : rows.length === 0 ? (
          <Empty>No enquiries yet.</Empty>
        ) : (
          <ul className="-my-2 divide-y divide-[#EEF1F7]">
            {rows.map((l) => (
              <li key={l.id} className="flex flex-wrap items-start justify-between gap-4 py-4">
                <div className="min-w-0 flex-1 text-[14px]">
                  <p>
                    <span className="font-medium text-[#0A0626]">{l.name}</span>
                    <span className="text-[#6B6E75]">
                      {l.company && ` · ${l.company}`}
                      {l.designation && ` · ${l.designation}`}
                    </span>
                  </p>
                  <p className="mt-0.5 flex flex-wrap gap-x-4 text-[#404348]">
                    <a href={`mailto:${l.email}`} className="text-primary hover:underline">
                      {l.email}
                    </a>
                    <span>{l.phone}</span>
                    {l.website && <span className="text-[#6B6E75]">{l.website}</span>}
                    {l.interest && <span>{INTEREST[l.interest] || l.interest}</span>}
                    {l.users && <span>{l.users} users</span>}
                  </p>
                  {l.message && <p className="mt-2 whitespace-pre-wrap rounded-lg bg-[#F5F8FD] p-3 text-[#404348]">{l.message}</p>}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-right text-[12px] text-[#6B6E75]">
                    {utcStamp(l.created_at)}
                    <span className="block text-[#0F6B3A]" title={l.terms_version}>Agreed to Terms &amp; Privacy</span>
                  </span>
                  <Button variant="danger" onClick={() => remove(l)} aria-label={`Delete enquiry from ${l.name}`}>
                    <Trash2 size={15} />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function SettingsPage({ out }) {
  const [data, reload] = useResource("/admin/settings", out);
  const [emails, setEmails] = useState("");
  const [demo, setDemo] = useState(null);
  const [blocked, setBlocked] = useState("");
  const [months, setMonths] = useState(36);
  useEffect(() => {
    if (!data) return;
    setEmails(data.salesEmails.join("\n"));
    setDemo(data.demo);
    setMonths(data.retention?.enquiryMonths ?? 36);
  }, [data]);
  if (!demo) return <Empty>Loading...</Empty>;
  const setHours = (d, v) => setDemo({ ...demo, hours: { ...demo.hours, [d]: v } });
  const saveEmails = () => act(() => api("/admin/settings/salesEmails", { method: "PUT", body: { value: emails.split(/[\s,]+/).filter(Boolean) } }), "Sales emails saved").then(reload);
  const saveRetention = () => act(() => api("/admin/settings/retention", { method: "PUT", body: { value: { enquiryMonths: Number(months) } } }), "Retention saved").then(reload);
  const saveDemo = () => act(() => api("/admin/settings/demo", { method: "PUT", body: { value: demo } }), "Demo settings saved").then(reload);
  return (
    <>
      <PageTitle title="Settings" desc="Where bookings and enquiries are sent, and when demos can be booked." />
      <div className="grid gap-6 xl:grid-cols-[1fr_1.4fr]">
        <div className="space-y-6">
          <Card title="Sales team emails" actions={<Button onClick={saveEmails}>Save</Button>}>
            <Field label="Send every booking and enquiry to" hint="One email address per line (up to 10).">
              <textarea rows={5} value={emails} onChange={(e) => setEmails(e.target.value)} className={`${INPUT} font-mono`} />
            </Field>
          </Card>
          <Card title="Data retention" actions={<Button onClick={saveRetention}>Save</Button>}>
            <Field label="Keep demo bookings and enquiries for (months)" hint="6 to 84. Older ones are deleted automatically every few hours.">
              <input type="number" min={6} max={84} value={months} onChange={(e) => setMonths(e.target.value)} className={`${INPUT} w-32`} />
            </Field>
            <ul className="mt-4 space-y-1.5 text-[13px] text-[#404348]">
              <li>• Cookie choices: visitors are asked again after 12 months; records deleted after 13 months.</li>
              <li>• Visitor analytics: deleted after 13 months.</li>
              <li>• Security log: kept 1 year, then deleted.</li>
              <li>• Admin sessions: end when the browser closes, after 30 minutes idle, or after 12 hours.</li>
              <li>• Anyone's data can be exported or erased on request in Privacy requests.</li>
            </ul>
          </Card>
        </div>
        <Card title="Demo availability (India Standard Time)" actions={<Button onClick={saveDemo}>Save</Button>}>
          <div className="space-y-2">
            {DAYS.map((name, d) => {
              const h = demo.hours[d];
              return (
                <div key={name} className="grid grid-cols-[130px_1fr] items-center gap-3 text-[14px] sm:grid-cols-[130px_auto_1fr]">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={Boolean(h)} onChange={(e) => setHours(d, e.target.checked ? ["09:30", "18:00"] : null)} className="h-4 w-4 accent-[#0047FF]" />
                    {name}
                  </label>
                  {h ? (
                    <span className="flex items-center gap-2">
                      <input type="time" value={h[0]} onChange={(e) => setHours(d, [e.target.value, h[1]])} className={`${INPUT} w-auto`} aria-label={`${name} opens`} />
                      to
                      <input type="time" value={h[1]} onChange={(e) => setHours(d, [h[0], e.target.value])} className={`${INPUT} w-auto`} aria-label={`${name} closes`} />
                    </span>
                  ) : (
                    <span className="text-[#9CA3AF]">Closed</span>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <Field label="Session length">
              <select value={demo.slotMinutes} onChange={(e) => setDemo({ ...demo, slotMinutes: Number(e.target.value) })} className={INPUT}>
                {[15, 20, 30, 45, 60].map((m) => (
                  <option key={m} value={m}>
                    {m} minutes
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Minimum notice (hours)">
              <input type="number" min={0} max={72} value={demo.minNoticeHours} onChange={(e) => setDemo({ ...demo, minNoticeHours: Number(e.target.value) })} className={INPUT} />
            </Field>
            <Field label="Bookable days ahead">
              <input type="number" min={1} max={120} value={demo.horizonDays} onChange={(e) => setDemo({ ...demo, horizonDays: Number(e.target.value) })} className={INPUT} />
            </Field>
          </div>
          <Field label="Meeting type shown to visitors" className="mt-4">
            <input value={demo.meetingType} maxLength={100} onChange={(e) => setDemo({ ...demo, meetingType: e.target.value })} className={INPUT} />
          </Field>
          <div className="mt-4">
            <span className="mb-1.5 block text-[13px] font-medium text-[#404348]">Closed dates (holidays)</span>
            <div className="flex gap-2">
              <input type="date" value={blocked} onChange={(e) => setBlocked(e.target.value)} className={`${INPUT} w-auto`} aria-label="Date to close" />
              <Button
                variant="ghost"
                disabled={!blocked || demo.blockedDates.includes(blocked)}
                onClick={() => {
                  setDemo({ ...demo, blockedDates: [...demo.blockedDates, blocked].sort() });
                  setBlocked("");
                }}
              >
                Add
              </Button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {demo.blockedDates.map((d) => (
                <span key={d} className="inline-flex items-center gap-1.5 rounded-full bg-[#F0F4FB] py-1 pl-3 pr-1.5 text-[13px]">
                  {d}
                  <button type="button" aria-label={`Reopen ${d}`} onClick={() => setDemo({ ...demo, blockedDates: demo.blockedDates.filter((x) => x !== d) })} className="rounded-full p-0.5 hover:bg-white">
                    <X size={13} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}

function Account({ me, out }) {
  const [data, reload] = useResource("/admin/admins", out);
  const [pw, setPw] = useState({ current: "", next: "" });
  const [add, setAdd] = useState({ email: "", password: "" });
  const change = async (e) => {
    e.preventDefault();
    if (await act(() => api("/admin/password", { method: "POST", body: pw }), "Password changed. Other sessions were signed out.")) setPw({ current: "", next: "" });
  };
  const create = async (e) => {
    e.preventDefault();
    if (await act(() => api("/admin/admins", { method: "POST", body: add }), "Admin added")) {
      setAdd({ email: "", password: "" });
      reload();
    }
  };
  const remove = async (a) => window.confirm(`Remove ${a.email}?`) && (await act(() => api(`/admin/admins/${a.id}`, { method: "DELETE" }), "Removed")) && reload();
  const resetAuth = async (a) =>
    window.confirm(`Reset ${a.email}'s authenticator? They'll set up a new one (scan a new QR) at their next sign-in, and are signed out now.`) &&
    (await act(() => api(`/admin/admins/${a.id}/reset-authenticator`, { method: "POST" }), "Authenticator reset")) &&
    reload();
  return (
    <>
      <PageTitle title="Admins & password" desc={`Signed in as ${me.email}.`} />
      <div className="grid gap-6 xl:grid-cols-2">
        <Card title="Change your password">
          <form onSubmit={change} className="space-y-4">
            <Field label="Current password">
              <input type="password" required autoComplete="current-password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} className={INPUT} />
            </Field>
            <Field label="New password" hint="At least 12 characters, with letters and numbers.">
              <input type="password" required minLength={12} autoComplete="new-password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} className={INPUT} />
            </Field>
            <Button type="submit">Change password</Button>
          </form>
          <p className="mt-4 border-t border-[#EEF1F7] pt-4 text-[13px] text-[#6B6E75]">
            Lost your phone? Reset your authenticator below and set it up again at the next sign-in.
          </p>
        </Card>
        <Card title="Admin accounts">
          <ul className="divide-y divide-[#EEF1F7]">
            {(data?.admins || []).map((a) => (
              <li key={a.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5 text-[14px]">
                <span>
                  {a.email} {a.id === me.id && <span className="text-[#6B6E75]">(you)</span>}
                  {a.is_owner && <span className="ml-2 rounded bg-[#EEF3FF] px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-primary">Owner</span>}
                  <span className={`ml-2 text-[12px] ${a.has_authenticator ? "text-[#0F6B3A]" : "text-[#9A5B00]"}`}>
                    {a.has_authenticator ? "authenticator set" : "not set up yet"}
                  </span>
                </span>
                <span className="flex gap-2">
                  {(a.id === me.id || me.isOwner) && a.has_authenticator && (
                    <Button variant="ghost" onClick={() => resetAuth(a)}>
                      Reset authenticator
                    </Button>
                  )}
                  {me.isOwner && a.id !== me.id && !a.is_owner && (
                    <Button variant="danger" onClick={() => remove(a)} aria-label={`Remove ${a.email}`}>
                      <Trash2 size={15} />
                    </Button>
                  )}
                </span>
              </li>
            ))}
          </ul>
          {me.isOwner ? (
            <form onSubmit={create} className="mt-5 grid gap-3 border-t border-[#EEF1F7] pt-5 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
              <Field label="New admin email">
                <input type="email" required value={add.email} onChange={(e) => setAdd({ ...add, email: e.target.value })} className={INPUT} />
              </Field>
              <Field label="Their first password">
                <input type="password" required minLength={12} autoComplete="new-password" value={add.password} onChange={(e) => setAdd({ ...add, password: e.target.value })} className={INPUT} />
              </Field>
              <Button type="submit">Add</Button>
            </form>
          ) : null}
          <p className="mt-4 text-[12px] text-[#6B6E75]">
            The owner is the first admin. They can't be removed, and only they can add or remove admins. Every admin signs in with their password plus a code from
            their own authenticator app.
          </p>
        </Card>
      </div>
    </>
  );
}

export default function AdminApp() {
  const { pathname } = useLocation();
  const section = pathname.split("/")[2] || "";
  const [me, setMe] = useState(undefined); // undefined while checking, null when signed out
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    document.title = "Admin | Cube Software";
    api("/admin/me")
      .then(({ admin }) => setMe(admin))
      .catch(() => setMe(null));
  }, []);
  useEffect(() => setMenu(false), [pathname]);

  const out = useCallback(() => {
    setMe(null);
    toast.error("Your session ended. Please sign in again.");
  }, []);
  const logout = async () => {
    await api("/admin/logout", { method: "POST" }).catch(() => {});
    setMe(null);
  };

  if (me === undefined) return <div className="min-h-screen bg-[#F5F8FD]" aria-busy="true" />;
  if (!me) return <Login onDone={setMe} />;

  const props = { me, out };
  const page = {
    "": <Overview {...props} />,
    bookings: <Bookings {...props} />,
    leads: <Leads {...props} />,
    blog: <BlogAdmin {...props} />,
    content: <ContentAdmin {...props} />,
    media: <MediaAdmin {...props} />,
    calendar: <CalendarAdmin {...props} />,
    team: <TeamAdmin {...props} />,
    consents: <ConsentAdmin {...props} />,
    analytics: <AnalyticsAdmin {...props} />,
    privacy: <PrivacyAdmin {...props} />,
    security: <SecurityAdmin {...props} />,
    settings: <SettingsPage {...props} />,
    account: <Account {...props} />,
  }[section] || <Empty>Page not found.</Empty>;

  return (
    <div className="min-h-screen bg-[#F5F8FD] text-[#31343A] lg:grid lg:grid-cols-[250px_1fr]">
      <header className="flex items-center justify-between bg-[#0A0626] px-4 py-3 lg:hidden">
        <img src="/logo75.png" alt="Cube Software" className="h-7 w-auto rounded bg-white px-1.5 py-0.5" />
        <button type="button" onClick={() => setMenu((m) => !m)} aria-expanded={menu} aria-label="Menu" className="rounded-lg p-2 text-white hover:bg-white/10">
          {menu ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>
      <aside className={`${menu ? "block" : "hidden"} bg-[#0A0626] p-4 text-[#C9D2EC] lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col`}>
        <div className="hidden px-2 pb-6 pt-2 lg:block">
          <img src="/logo75.png" alt="Cube Software" className="h-8 w-auto rounded bg-white px-2 py-1" />
          <p className="mt-3 text-[12px] uppercase tracking-[0.14em] text-[#00B8FF]">Admin</p>
        </div>
        <nav className="space-y-1">
          {NAV.map(([to, label, Icon]) => (
            <Link
              key={to}
              to={`/admin${to ? `/${to}` : ""}`}
              aria-current={section === to ? "page" : undefined}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-[14px] transition-colors ${section === to ? "bg-white/10 text-white" : "hover:bg-white/5 hover:text-white"}`}
            >
              <Icon size={17} /> {label}
            </Link>
          ))}
        </nav>
        <div className="mt-6 space-y-1 border-t border-white/10 pt-4 lg:mt-auto">
          <a href="/" target="_blank" rel="noopener noreferrer" className="block rounded-lg px-3 py-2 text-[14px] hover:bg-white/5 hover:text-white">
            View website ↗
          </a>
          <button type="button" onClick={logout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-[14px] hover:bg-white/5 hover:text-white">
            <LogOut size={17} /> Sign out
          </button>
        </div>
      </aside>
      <main className="min-w-0 p-4 sm:p-8">{page}</main>
    </div>
  );
}
