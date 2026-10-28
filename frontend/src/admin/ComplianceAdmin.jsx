import React, { useState } from "react";
import { Download, Search, Trash2 } from "lucide-react";
import { api } from "../lib/api";
import { Button, Card, Empty, INPUT, PageTitle, act, downloadCsv, istTime, useResource, utcStamp } from "./ui";

// Visitor analytics (consented visitors only), privacy requests (find / export / erase one person's data),
// and the security log.

function Bars({ rows, total }) {
  if (!rows?.length) return <Empty>No data yet.</Empty>;
  return (
    <ul className="space-y-2">
      {rows.map((r) => (
        <li key={r.label} className="text-[13px]">
          <div className="flex justify-between gap-3">
            <span className="truncate text-[#0A0626]">{r.label}</span>
            <span className="shrink-0 tabular-nums text-[#6B6E75]">
              {r.n} · {Math.round((r.n / Math.max(total, 1)) * 100)}%
            </span>
          </div>
          <div className="mt-1 h-1.5 rounded-full bg-[#EEF1F7]">
            <div className="h-1.5 rounded-full bg-primary" style={{ width: `${(r.n / Math.max(total, 1)) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function AnalyticsAdmin({ out }) {
  const [days, setDays] = useState(30);
  const [data] = useResource(`/admin/analytics?days=${days}`, out);
  const peak = Math.max(1, ...(data?.byDay || []).map((d) => d.n));
  return (
    <>
      <PageTitle
        title="Visitor analytics"
        desc="Only from visitors who allowed analytics cookies. No IP addresses or visitor ids are stored, and views are deleted after 13 months."
        actions={
          <select value={days} onChange={(e) => setDays(Number(e.target.value))} className={`${INPUT} w-auto`} aria-label="Period">
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
            <option value={365}>Last 12 months</option>
          </select>
        }
      />
      {!data ? (
        <Empty>Loading...</Empty>
      ) : (
        <>
          <Card title={`${data.total} page views`}>
            {data.byDay.length === 0 ? (
              <Empty>No page views in this period yet.</Empty>
            ) : (
              <div className="flex h-32 items-end gap-[3px]" role="img" aria-label={`Page views per day, highest ${peak}`}>
                {data.byDay.map((d) => (
                  <div key={d.day} title={`${d.day}: ${d.n}`} className="flex-1 rounded-t bg-primary/80 hover:bg-primary" style={{ height: `${Math.max(4, (d.n / peak) * 100)}%` }} />
                ))}
              </div>
            )}
          </Card>
          <div className="mt-6 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            <Card title="Top pages"><Bars rows={data.pages} total={data.total} /></Card>
            <Card title="Where visitors came from"><Bars rows={data.referrers} total={data.total} /></Card>
            <Card title="Devices"><Bars rows={data.devices} total={data.total} /></Card>
            <Card title="Browsers"><Bars rows={data.browsers} total={data.total} /></Card>
            <Card title="Operating systems"><Bars rows={data.systems} total={data.total} /></Card>
          </div>
        </>
      )}
    </>
  );
}

export function PrivacyAdmin() {
  const [email, setEmail] = useState("");
  const [found, setFound] = useState(null);
  const [busy, setBusy] = useState(false);

  const search = async (e) => {
    e.preventDefault();
    setBusy(true);
    const r = await act(() => api(`/admin/privacy?email=${encodeURIComponent(email.trim())}`));
    setFound(r || null);
    setBusy(false);
  };
  const exportAll = () => {
    const blob = new Blob([JSON.stringify(found, null, 2)], { type: "application/json" });
    const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: `personal-data-${found.email}.json` });
    a.click();
    URL.revokeObjectURL(a.href);
  };
  const erase = async () => {
    const n = found.bookings.length + found.leads.length;
    if (!window.confirm(`Permanently erase ${n} record(s) for ${found.email}? This cannot be undone.`)) return;
    setBusy(true);
    if (await act(() => api("/admin/privacy/erase", { method: "POST", body: { email: found.email } }), "Personal data erased")) setFound({ ...found, bookings: [], leads: [] });
    setBusy(false);
  };
  const total = found ? found.bookings.length + found.leads.length : 0;

  return (
    <>
      <PageTitle
        title="Privacy requests"
        desc="When someone asks what data you hold about them, or asks you to delete it (DPDP Act India, PDPL UAE), find it here by email, send them the export, or erase it. Reply within 30 days."
      />
      <Card>
        <form onSubmit={search} className="flex flex-wrap gap-2">
          <input type="email" required placeholder="person@company.com" value={email} onChange={(e) => setEmail(e.target.value)} className={`${INPUT} max-w-[360px]`} aria-label="Email address" />
          <Button type="submit" disabled={busy}>
            <Search size={15} /> Find their data
          </Button>
        </form>
        {found && (
          <div className="mt-6">
            {total === 0 ? (
              <Empty>No demo bookings or enquiries are held for {found.email}.</Empty>
            ) : (
              <>
                <p className="text-[14px] text-[#404348]">
                  Found <b>{found.bookings.length}</b> demo booking(s) and <b>{found.leads.length}</b> enquiry(ies) for <b>{found.email}</b>.
                </p>
                <ul className="mt-3 divide-y divide-[#EEF1F7] rounded-xl border border-[#E5EAF4] text-[13px]">
                  {found.bookings.map((b) => (
                    <li key={`b${b.id}`} className="px-4 py-2.5">Demo booking · {istTime(b.slot_start)} · {b.company} · received {utcStamp(b.created_at)}</li>
                  ))}
                  {found.leads.map((l) => (
                    <li key={`l${l.id}`} className="px-4 py-2.5">Enquiry · {l.company || "no company"} · received {utcStamp(l.created_at)}</li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button variant="ghost" onClick={exportAll}>
                    <Download size={15} /> Export everything (JSON)
                  </Button>
                  <Button variant="danger" disabled={busy} onClick={erase}>
                    <Trash2 size={15} /> Erase all of it
                  </Button>
                </div>
              </>
            )}
            <p className="mt-4 text-[12px] text-[#6B6E75]">Cookie choices and analytics hold no names or emails, so there is nothing of theirs to find there.</p>
          </div>
        )}
      </Card>
    </>
  );
}

const ACTIONS = {
  login_ok: "Signed in",
  login_failed: "Wrong email or password",
  login_totp_prompt: "Password OK — asked for authenticator code",
  login_totp_setup: "Password OK — authenticator setup started",
  login_code_failed: "Wrong authenticator code",
  login_blocked_locked: "Sign-in blocked (account locked)",
  account_locked: "Account locked after 5 failures",
  logout: "Signed out",
  change: "Change",
  authenticator_reset: "Authenticator reset",
  owner_transferred: "Owner (master admin) changed",
  admin_removed: "Admin removed",
  privacy_erase: "Personal data erased",
  retention_sweep: "Automatic deletion",
};

export function SecurityAdmin({ out }) {
  const [data] = useResource("/admin/audit", out);
  const rows = data?.entries || [];
  const signOutAll = async () => {
    if (!window.confirm("Sign out of the admin on every device, including this one?")) return;
    if (await act(() => api("/admin/logout-all", { method: "POST" }))) window.location.assign("/admin");
  };
  return (
    <>
      <PageTitle
        title="Security log"
        desc="Every sign-in attempt and every change made in this dashboard, with the IP address. Kept for 1 year, then deleted automatically."
        actions={
          <>
            <Button
              variant="ghost"
              disabled={!rows.length}
              onClick={() =>
                downloadCsv("cube-security-log.csv", rows, [
                  [(e) => utcStamp(e.at), "Time (IST)"],
                  ["email", "Admin"],
                  [(e) => ACTIONS[e.action] || e.action, "Event"],
                  ["detail", "Detail"],
                  ["ip", "IP address"],
                ])
              }
            >
              Export CSV
            </Button>
            <Button variant="danger" onClick={signOutAll}>
              Sign out everywhere
            </Button>
          </>
        }
      />
      <Card>
        {!data ? (
          <Empty>Loading...</Empty>
        ) : rows.length === 0 ? (
          <Empty>Nothing logged yet.</Empty>
        ) : (
          <div className="-m-5 overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-[13px]">
              <thead className="bg-[#F5F8FD] text-[12px] uppercase tracking-[0.06em] text-[#6B6E75]">
                <tr>
                  {["Time (IST)", "Admin", "Event", "Detail", "IP"].map((h) => (
                    <th key={h} className="px-5 py-3 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEF1F7]">
                {rows.map((e) => (
                  <tr key={e.id} className={/failed|locked/.test(e.action) ? "bg-[#FFF8F8]" : ""}>
                    <td className="whitespace-nowrap px-5 py-2.5">{utcStamp(e.at)}</td>
                    <td className="px-5 py-2.5">{e.email || "—"}</td>
                    <td className={`px-5 py-2.5 ${/failed|locked/.test(e.action) ? "font-medium text-[#C81E1E]" : ""}`}>{ACTIONS[e.action] || e.action}</td>
                    <td className="px-5 py-2.5 font-mono text-[12px] text-[#6B6E75]">{e.detail}</td>
                    <td className="px-5 py-2.5 font-mono text-[12px] text-[#6B6E75]">{e.ip}</td>
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
