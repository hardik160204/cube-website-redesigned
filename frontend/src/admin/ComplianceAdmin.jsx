import React, { useState } from "react";
import { Download, Search, Trash2 } from "lucide-react";
import { api } from "../lib/api";
import { Button, Card, Empty, INPUT, PageTitle, Toggle, act, downloadCsv, istTime, useResource, utcStamp } from "./ui";
import { Columns, Pie, RankedBars } from "./AnalyticsCharts";

// Visitor analytics (consented visitors only), privacy requests (find / export / erase one person's data),
// and the security log.

export function AnalyticsAdmin({ out }) {
  const [days, setDays] = useState(30);
  const [data, reload] = useResource(`/admin/analytics?days=${days}`, out);
  const [networks, setNetworks] = useState({});
  const [looking, setLooking] = useState(false);
  const toggle = async (on) => {
    if (on && !window.confirm("Record each visitor's IP address, city, country, network and device?\n\nOnly for visitors who allow analytics after being told about it (the cookie notice and Privacy Policy say so automatically). Kept 90 days.")) return;
    if (await act(() => api("/admin/settings/visitorTracking", { method: "PUT", body: { value: { on } } }), on ? "Visitor details are now recorded." : "Visitor details are no longer recorded.")) reload();
  };
  const lookUp = async () => {
    setLooking(true);
    const r = await act(() => api("/admin/analytics/networks", { method: "POST", body: { ips: data.visitors.map((v) => v.ip).filter((ip) => !networks[ip]).slice(0, 50) } }));
    setLooking(false);
    if (r) setNetworks({ ...networks, ...Object.fromEntries(r.networks.map((n) => [n.ip, n.network || "(none found)"])) });
  };
  const visitors = data?.visitors || [];
  const place = (v) => [v.city, v.region, v.country].filter(Boolean).join(", ") || "Unknown";
  return (
    <>
      <PageTitle
        title="Visitor analytics"
        desc="Only from visitors who allowed analytics. Page counts are kept 13 months; visitor details (IP address and place), when switched on, 90 days."
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
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              ["Page views", data.total],
              ["Visitors (by IP address)", data.tracking || visitors.length ? visitors.length : "—"],
              ["Top city", data.cities[0]?.label || "—"],
              ["Top page", data.pages[0]?.label || "—"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-[#E5EAF4] bg-white p-5">
                <span className="text-[13px] text-[#6B6E75]">{label}</span>
                <span className="mt-1 block truncate text-[26px] font-medium text-[#0A0626]">{typeof value === "number" ? value.toLocaleString("en-IN") : value}</span>
              </div>
            ))}
          </div>
          <Card title="Page views per day" className="mt-6">
            <Columns days={data.byDay} />
          </Card>
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <Card title="Devices"><Pie rows={data.devices} label="Devices" /></Card>
            <Card title="Browsers"><Pie rows={data.browsers} label="Browsers" /></Card>
            <Card title="Operating systems"><Pie rows={data.systems} label="Operating systems" /></Card>
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <Card title="Top pages"><RankedBars rows={data.pages} total={data.total} /></Card>
            <Card title="Where visitors came from"><RankedBars rows={data.referrers} total={data.total} /></Card>
            <Card title="Cities"><RankedBars rows={data.cities} total={data.total} /></Card>
            <Card title="Countries"><RankedBars rows={data.countries} total={data.total} /></Card>
          </div>

          <Card
            title="Visitor details"
            className="mt-6"
            actions={
              <div className="flex items-center gap-3">
                <span className="text-[13px] text-[#404348]">{data.tracking ? "Recording" : "Off"}</span>
                <Toggle on={data.tracking} onChange={toggle} label="Record visitor details" />
              </div>
            }
          >
            <p className="text-[13px] leading-6 text-[#404348]">
              When on, each visit records the IP address, its city, region and country (from our host Vercel's own lookup, nothing sent elsewhere), and the device. Network names come from the
              address's public DNS name: an internet provider (e.g. airtelbroadband.in, jio.com) or a company's own network (an office). Only visitors who allowed analytics after being told
              are included, and the details are deleted after 90 days.
            </p>
            {visitors.length > 0 && (
              <>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button variant="ghost" disabled={looking} onClick={lookUp}>
                    {looking ? "Looking up..." : "Look up networks"}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() =>
                      downloadCsv("cube-visitors.csv", visitors, [
                        ["ip", "IP address"],
                        ["city", "City"],
                        ["region", "Region"],
                        ["country", "Country"],
                        [(v) => networks[v.ip] || v.network || "", "Network"],
                        ["device", "Device"],
                        ["browser", "Browser"],
                        ["os", "Operating system"],
                        ["views", "Page views"],
                        ["pages", "Pages"],
                        [(v) => utcStamp(v.last_seen), "Last seen"],
                      ])
                    }
                  >
                    <Download size={15} /> Export CSV
                  </Button>
                </div>
                <div className="-mx-5 mt-4 overflow-x-auto">
                  <table className="w-full min-w-[900px] text-left text-[13px]">
                    <thead className="bg-[#F5F8FD] text-[12px] uppercase tracking-[0.06em] text-[#6B6E75]">
                      <tr>
                        {["IP address", "Where", "Network", "Device", "Views", "Last seen"].map((h) => (
                          <th key={h} className="px-5 py-2.5 font-semibold">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EEF1F7]">
                      {visitors.map((v) => (
                        <tr key={v.ip}>
                          <td className="px-5 py-2.5 font-mono text-[12px] text-[#0A0626]">{v.ip}</td>
                          <td className="px-5 py-2.5 text-[#404348]">{place(v)}</td>
                          <td className="px-5 py-2.5 text-[#404348]">{networks[v.ip] || v.network || "—"}</td>
                          <td className="px-5 py-2.5 text-[#404348]">{[v.device, v.browser, v.os].filter(Boolean).join(" · ")}</td>
                          <td className="px-5 py-2.5 tabular-nums text-[#404348]">
                            {v.views} ({v.pages} page{v.pages === 1 ? "" : "s"})
                          </td>
                          <td className="px-5 py-2.5 text-[#404348]">{utcStamp(v.last_seen)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </Card>
        </>
      )}
    </>
  );
}

// Requests sent with the website's Data deletion form.
function DeletionRequests({ onFind }) {
  const [data, reload] = useResource("/admin/deletion-requests");
  const open = (data?.requests || []).filter((r) => r.status === "open");
  const setStatus = async (r, status) => (await act(() => api(`/admin/deletion-requests/${r.id}`, { method: "PATCH", body: { status } }), "Updated")) && reload();
  return (
    <Card title={`Requests from the website's Data deletion form${open.length ? ` (${open.length} open)` : ""}`} className="mb-6">
      {!data ? (
        <Empty>Loading...</Empty>
      ) : !data.requests.length ? (
        <Empty>No requests yet.</Empty>
      ) : (
        <ul className="divide-y divide-[#EEF1F7] text-[14px]">
          {data.requests.map((r) => (
            <li key={r.id} className="flex flex-wrap items-start justify-between gap-3 py-3">
              <span className="min-w-0">
                <span className="font-medium text-[#0A0626]">{r.email}</span>
                {r.name && <span className="text-[#6B6E75]"> · {r.name}</span>}
                <span className="block text-[12px] text-[#6B6E75]">Received {utcStamp(r.created_at)}{r.closed_at ? ` · closed ${utcStamp(r.closed_at)}` : ""}</span>
                {r.details && <span className="mt-1 block whitespace-pre-wrap text-[13px] text-[#404348]">{r.details}</span>}
              </span>
              {r.status === "open" ? (
                <span className="flex flex-wrap gap-2">
                  <Button variant="ghost" onClick={() => onFind(r.email)}>
                    <Search size={15} /> Find their data
                  </Button>
                  <Button variant="ghost" onClick={() => setStatus(r, "done")}>Mark done</Button>
                  <Button variant="danger" onClick={() => window.confirm("Close this request without deleting anything (e.g. it wasn't really them)?") && setStatus(r, "rejected")}>Reject</Button>
                </span>
              ) : (
                <span className={`rounded-full px-2.5 py-1 text-[12px] font-medium ${r.status === "done" ? "bg-[#E7F7EE] text-[#0F6B3A]" : "bg-[#F1F3F6] text-[#6B6E75]"}`}>{r.status === "done" ? "Done" : "Rejected"}</span>
              )}
            </li>
          ))}
        </ul>
      )}
      <p className="mt-3 text-[12px] text-[#6B6E75]">First email the person to check the request really comes from them. Then find their data below, erase it, and mark the request done.</p>
    </Card>
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
    const n = found.bookings.length + found.leads.length + (found.contacts?.length || 0);
    if (!window.confirm(`Permanently erase ${n} record(s) for ${found.email}? This cannot be undone.`)) return;
    setBusy(true);
    if (await act(() => api("/admin/privacy/erase", { method: "POST", body: { email: found.email } }), "Personal data erased")) setFound({ ...found, bookings: [], leads: [], contacts: [] });
    setBusy(false);
  };
  const total = found ? found.bookings.length + found.leads.length + (found.contacts?.length || 0) : 0;

  return (
    <>
      <PageTitle
        title="Privacy requests"
        desc="When someone asks what data you hold about them, or asks you to delete it (DPDP Act India, PDPL UAE), find it here by email, send them the export, or erase it. Reply within 30 days."
      />
      <DeletionRequests onFind={(e) => setEmail(e)} />
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
                  {(found.contacts || []).map((c) => (
                    <li key={`c${c.id}`} className="px-4 py-2.5">Newsletter list · {c.subscribed ? "subscribed" : "unsubscribed"} · added {utcStamp(c.created_at)}</li>
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
  permissions_changed: "Admin access changed",
};

// Every change is logged as "METHOD /path"; this says what it was in words.
const CHANGES = [
  [/^POST \/overrides/, "Changed text, a picture or an animation on the site"],
  [/^DELETE \/overrides/, "Undid a site edit"],
  [/^PUT \/lists/, "Changed a set of cards on the site"],
  [/^DELETE \/lists/, "Put back the original cards"],
  [/^POST \/pages/, "Created a page"],
  [/^PUT \/pages/, "Edited a page"],
  [/^DELETE \/pages/, "Deleted a page"],
  [/^POST \/media\/sign/, "Started an upload"],
  [/^POST \/media\/confirm/, "Uploaded a file"],
  [/^DELETE \/media/, "Deleted an uploaded file"],
  [/^POST \/posts/, "Wrote a blog post"],
  [/^PUT \/posts/, "Edited a blog post"],
  [/^DELETE \/posts/, "Deleted a blog post"],
  [/^PATCH \/bookings/, "Changed a demo booking's status"],
  [/^DELETE \/bookings/, "Deleted a demo booking"],
  [/^DELETE \/leads/, "Deleted an enquiry"],
  [/^PUT \/slot-rules/, "Changed a demo slot"],
  [/^PUT \/days/, "Opened or closed a demo day"],
  [/^PUT \/settings\/(team|socials)/, "Changed the team or social links"],
  [/^PUT \/settings\/nav/, "Changed the navigation bar"],
  [/^PUT \/settings\/fonts/, "Changed the font sizes"],
  [/^PUT \/settings\/festival/, "Changed the festival theme"],
  [/^PUT \/settings\/pagesOff/, "Switched pages on or off"],
  [/^PUT \/settings\/bot/, "Changed the chat bot"],
  [/^PUT \/settings\/sectionsOff/, "Switched sections on or off"],
  [/^PUT \/settings\/pricing/, "Changed the pricing"],
  [/^PUT \/settings\/google/, "Changed the Google & SEO settings"],
  [/^PUT \/settings\/emailSender/, "Changed who emails come from"],
  [/^PUT \/settings\/legal/, "Changed a legal page"],
  [/^PUT \/settings\/visitorTracking/, "Switched visitor details on or off"],
  [/^POST \/bookings\/\d+\/decision/, "Confirmed or declined a demo request"],
  [/^POST \/campaigns\/\d+\/send/, "Sent a newsletter"],
  [/^POST \/campaigns/, "Wrote a newsletter"],
  [/^PUT \/campaigns/, "Edited a newsletter"],
  [/^DELETE \/campaigns/, "Deleted a newsletter"],
  [/^POST \/contacts/, "Added someone to the newsletter list"],
  [/^DELETE \/contacts/, "Removed someone from the newsletter list"],
  [/^PATCH \/deletion-requests/, "Closed a data deletion request"],
  [/^POST \/seo\/indexnow/, "Sent the page list to Bing (IndexNow)"],
  [/^PUT \/settings/, "Changed settings"],
  [/^POST \/privacy\/erase/, "Erased someone's personal data"],
  [/^POST \/retention/, "Ran the automatic deletion"],
  [/^POST \/admins\/\d+\/reset-authenticator/, "Reset an authenticator"],
  [/^PUT \/admins\/\d+\/permissions/, "Changed an admin's access"],
  [/^POST \/admins/, "Added an admin"],
  [/^DELETE \/admins/, "Removed an admin"],
  [/^POST \/password/, "Changed their password"],
  [/^POST \/logout-all/, "Signed out everywhere"],
];
const describe = (e) => (e.action === "change" ? CHANGES.find(([re]) => re.test(e.detail))?.[1] || "Change" : ACTIONS[e.action] || e.action);

// Only the owner can open this (the server refuses everyone else).
export function SecurityAdmin({ out }) {
  const [data] = useResource("/admin/audit", out);
  const [who, setWho] = useState("");
  const all = data?.entries || [];
  const rows = who ? all.filter((e) => e.email === who) : all;
  const people = [...new Set(all.map((e) => e.email).filter(Boolean))].sort();
  return (
    <>
      <PageTitle
        title="Activity log"
        desc="Only you, the owner, can see this. Every sign-in attempt and every change any admin made, with the IP address. Kept for 1 year, then deleted automatically."
        actions={
          <>
            <select value={who} onChange={(e) => setWho(e.target.value)} className={`${INPUT} w-auto`} aria-label="Show activity of">
              <option value="">Every admin</option>
              {people.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <Button
              variant="ghost"
              disabled={!rows.length}
              onClick={() =>
                downloadCsv("cube-activity-log.csv", rows, [
                  [(e) => utcStamp(e.at), "Time (IST)"],
                  ["email", "Admin"],
                  [describe, "Event"],
                  ["detail", "Detail"],
                  ["ip", "IP address"],
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
                    <td className={`px-5 py-2.5 ${/failed|locked/.test(e.action) ? "font-medium text-[#C81E1E]" : ""}`}>{describe(e)}</td>
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
