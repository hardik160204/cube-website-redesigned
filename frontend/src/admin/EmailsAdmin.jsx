import React, { useState } from "react";
import { toast } from "sonner";
import { ImageIcon, Plus, Send, Trash2 } from "lucide-react";
import { api } from "../lib/api";
import { MediaPicker } from "./MediaAdmin";
import { Button, Card, Dialog, EmailPreview, Empty, Field, INPUT, PageTitle, act, downloadCsv, useResource, utcStamp } from "./ui";

// Emails to clients and visitors: newsletters about our products, the list of people who asked for them, people
// who unsubscribed (their removal waits for your approval), and the address emails come from.
const TABS = [
  ["newsletters", "Newsletters"],
  ["people", "People on the list"],
  ["unsubscribed", "Unsubscribed"],
  ["sender", "Sender"],
];
const BLANK = { subject: "", content: { heading: "", body: "", image: "", imageAlt: "", buttonLabel: "", buttonUrl: "" } };

function Editor({ campaign, onClose, onSaved }) {
  const [c, setC] = useState(campaign ? { subject: campaign.subject, content: { ...BLANK.content, ...campaign.content } } : BLANK);
  const [picking, setPicking] = useState(false);
  const set = (k) => (e) => setC({ ...c, content: { ...c.content, [k]: e.target.value } });
  const save = async () => {
    const r = await act(() => (campaign ? api(`/admin/campaigns/${campaign.id}`, { method: "PUT", body: c }) : api("/admin/campaigns", { method: "POST", body: c })), "Saved as a draft.");
    if (r) onSaved();
  };
  return (
    <Card title={campaign ? "Edit newsletter" : "New newsletter"} actions={<Button variant="ghost" onClick={onClose}>Back</Button>}>
      <div className="grid gap-4">
        <Field label="Subject line">
          <input value={c.subject} maxLength={150} onChange={(e) => setC({ ...c, subject: e.target.value })} className={INPUT} />
        </Field>
        <Field label="Heading (optional)">
          <input value={c.content.heading} maxLength={150} onChange={set("heading")} className={INPUT} />
        </Field>
        <Field label="Picture (optional)" hint="From Images & videos. It shows full width above the message.">
          <div className="flex flex-wrap items-center gap-3">
            {c.content.image && <img src={c.content.image} alt="" className="h-16 w-28 rounded-lg object-cover" />}
            <Button variant="ghost" onClick={() => setPicking(true)}>
              <ImageIcon size={15} /> {c.content.image ? "Change picture" : "Choose picture"}
            </Button>
            {c.content.image && (
              <Button variant="ghost" onClick={() => setC({ ...c, content: { ...c.content, image: "", imageAlt: "" } })}>
                Remove
              </Button>
            )}
          </div>
        </Field>
        {c.content.image && (
          <Field label="What the picture shows" hint="Read out to people who can't see it, and shown if it doesn't load.">
            <input value={c.content.imageAlt} maxLength={150} onChange={set("imageAlt")} className={INPUT} />
          </Field>
        )}
        <Field label="Message" hint="Leave an empty line between paragraphs.">
          <textarea value={c.content.body} rows={10} maxLength={10000} onChange={set("body")} className={INPUT} />
        </Field>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Button text (optional)">
            <input value={c.content.buttonLabel} maxLength={40} onChange={set("buttonLabel")} placeholder="e.g. Book a demo" className={INPUT} />
          </Field>
          <Field label="Button link" hint="A page of this site (/demo) or a full https:// link.">
            <input value={c.content.buttonUrl} maxLength={500} onChange={set("buttonUrl")} placeholder="/demo" className={INPUT} />
          </Field>
        </div>
        <p className="text-[12px] text-[#6B6E75]">Every newsletter ends with the company address and an unsubscribe link, added automatically.</p>
        <div className="flex justify-end">
          <Button onClick={save}>Save draft</Button>
        </div>
      </div>
      {picking && (
        <MediaPicker
          imagesOnly
          onClose={() => setPicking(false)}
          onPick={(url) => {
            setC({ ...c, content: { ...c.content, image: url } });
            setPicking(false);
          }}
        />
      )}
    </Card>
  );
}

function Newsletters({ out }) {
  const [data, reload] = useResource("/admin/campaigns", out);
  const [editing, setEditing] = useState(null); // null, "new" or a campaign
  const [preview, setPreview] = useState(null);
  const [sending, setSending] = useState(null);
  const [progress, setProgress] = useState(null);
  const [testTo, setTestTo] = useState("");
  if (editing) return <Editor campaign={editing === "new" ? null : editing} onClose={() => setEditing(null)} onSaved={() => (setEditing(null), reload())} />;
  if (!data) return <Empty>Loading...</Empty>;
  const open = async (c) => {
    const p = await act(() => api(`/admin/campaigns/${c.id}/preview`));
    if (p) setPreview({ ...p, campaign: c });
  };
  const test = async () => {
    const r = await act(() => api(`/admin/campaigns/${preview.campaign.id}/test`, { method: "POST", body: { email: testTo } }));
    if (r) toast.success(r.sent ? `Test sent to ${testTo}.` : "Email sending isn't set up yet, so the test was not sent.");
  };
  // Sends in batches until everyone on the list has it; safe to stop and resume.
  const send = async (c) => {
    setSending(null);
    setProgress({ sent: c.sent_count, remaining: data.audience });
    for (;;) {
      const r = await act(() => api(`/admin/campaigns/${c.id}/send`, { method: "POST" }));
      if (!r) break;
      setProgress({ sent: r.total ?? 0, remaining: r.remaining });
      if (!r.remaining || !r.sent) break;
    }
    setProgress(null);
    reload();
  };
  const remove = async (c) => window.confirm(`Delete “${c.subject}”?`) && (await act(() => api(`/admin/campaigns/${c.id}`, { method: "DELETE" }), "Deleted")) && reload();
  return (
    <>
      {!data.ready && (
        <p className="mb-4 rounded-xl bg-[#FFF4D6] px-4 py-3 text-[13px] text-[#7A4A00]">
          Email sending isn't set up on the server yet. Add the SMTP settings for {data.sender.promotions} (see the launch checklist), then newsletters and tests go out.
        </p>
      )}
      <Card
        title={`Newsletters · ${data.audience} ${data.audience === 1 ? "person" : "people"} on the list`}
        actions={
          <Button onClick={() => setEditing("new")}>
            <Plus size={15} /> New newsletter
          </Button>
        }
      >
        {progress && (
          <p role="status" className="mb-4 rounded-xl bg-[#EEF3FF] px-4 py-3 text-[14px] text-[#0A0626]">
            Sending... {progress.sent} sent, {progress.remaining} to go. Keep this page open.
          </p>
        )}
        {data.campaigns.length === 0 ? (
          <Empty>No newsletters yet. Write one to tell your clients about a product or an offer.</Empty>
        ) : (
          <ul className="divide-y divide-[#EEF1F7]">
            {data.campaigns.map((c) => (
              <li key={c.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-[14px]">
                <span className="min-w-0">
                  <span className="font-medium text-[#0A0626]">{c.subject}</span>
                  <span className="block text-[12px] text-[#6B6E75]">
                    {c.status === "sent" ? `Sent to ${c.sent_count} on ${utcStamp(c.sent_at)}` : c.status === "sending" ? `Partly sent (${c.sent_count}) — press Send to finish` : `Draft · ${utcStamp(c.created_at)}`}
                  </span>
                </span>
                <span className="flex flex-wrap gap-2">
                  <Button variant="ghost" onClick={() => open(c)}>
                    Preview & test
                  </Button>
                  {c.status === "draft" && (
                    <Button variant="ghost" onClick={() => setEditing(c)}>
                      Edit
                    </Button>
                  )}
                  {c.status !== "sent" && (
                    <Button disabled={!!progress || !data.ready || !data.audience} onClick={() => setSending(c)}>
                      <Send size={15} /> Send
                    </Button>
                  )}
                  {c.status !== "sending" && (
                    <Button variant="danger" className="px-2.5" onClick={() => remove(c)} aria-label={`Delete ${c.subject}`}>
                      <Trash2 size={15} />
                    </Button>
                  )}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
      {preview && (
        <Dialog title={preview.subject} onClose={() => setPreview(null)} wide>
          <p className="text-[13px] text-[#6B6E75]">From {preview.from}</p>
          <div className="mt-2">
            <EmailPreview html={preview.html} />
          </div>
          <div className="mt-4 flex flex-wrap items-end gap-2">
            <Field label="Send a test to" className="min-w-[240px] flex-1">
              <input type="email" value={testTo} onChange={(e) => setTestTo(e.target.value)} placeholder="you@cube-software.com" className={INPUT} />
            </Field>
            <Button variant="ghost" onClick={test} disabled={!testTo}>
              Send test
            </Button>
          </div>
        </Dialog>
      )}
      {sending && (
        <Dialog title={`Send “${sending.subject}”?`} onClose={() => setSending(null)}>
          <p className="text-[14px] text-[#404348]">
            It goes to the {data.audience} {data.audience === 1 ? "person" : "people"} on the list who haven't had it yet, from {data.sender.promotions}. Each email has an unsubscribe link.
          </p>
          <div className="mt-5 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setSending(null)}>
              Back
            </Button>
            <Button onClick={() => send(sending)}>
              <Send size={15} /> Yes, send it
            </Button>
          </div>
        </Dialog>
      )}
    </>
  );
}

function People({ out, unsubscribed }) {
  const [data, reload] = useResource("/admin/contacts", out);
  const [add, setAdd] = useState({ email: "", name: "", company: "", agreed: false });
  if (!data) return <Empty>Loading...</Empty>;
  const rows = data.contacts.filter((c) => c.subscribed === !unsubscribed);
  const save = async (e) => {
    e.preventDefault();
    if (await act(() => api("/admin/contacts", { method: "POST", body: add }), "Added to the list.")) {
      setAdd({ email: "", name: "", company: "", agreed: false });
      reload();
    }
  };
  const remove = async (c) =>
    window.confirm(
      unsubscribed
        ? `Approve removing ${c.email}? Their details are deleted; only a scrambled copy of the address is kept so they're never added again.`
        : `Remove ${c.email} from the list? They won't get newsletters and can't be added again.`
    ) && (await act(() => api(`/admin/contacts/${c.id}`, { method: "DELETE" }), "Removed")) && reload();
  return (
    <>
      {!unsubscribed && (
        <Card title="Add someone" className="mb-6">
          <form onSubmit={save} className="grid gap-3 md:grid-cols-3">
            <input type="email" required placeholder="Email" value={add.email} onChange={(e) => setAdd({ ...add, email: e.target.value })} className={INPUT} aria-label="Email" />
            <input placeholder="Name (optional)" value={add.name} maxLength={120} onChange={(e) => setAdd({ ...add, name: e.target.value })} className={INPUT} aria-label="Name" />
            <input placeholder="Company (optional)" value={add.company} maxLength={120} onChange={(e) => setAdd({ ...add, company: e.target.value })} className={INPUT} aria-label="Company" />
            <label className="flex items-start gap-2 text-[13px] text-[#404348] md:col-span-2">
              <input type="checkbox" required checked={add.agreed} onChange={(e) => setAdd({ ...add, agreed: e.target.checked })} className="mt-0.5 h-4 w-4 accent-[#0047FF]" />
              This person agreed to get emails from Cube Software (the law requires their agreement).
            </label>
            <div className="flex justify-end">
              <Button type="submit">
                <Plus size={15} /> Add
              </Button>
            </div>
          </form>
        </Card>
      )}
      <Card
        title={unsubscribed ? `Unsubscribed (${rows.length})` : `People on the list (${rows.length})`}
        actions={
          rows.length > 0 && (
            <Button
              variant="ghost"
              onClick={() =>
                downloadCsv(unsubscribed ? "cube-unsubscribed.csv" : "cube-newsletter-list.csv", rows, [
                  ["email", "Email"],
                  ["name", "Name"],
                  ["company", "Company"],
                  ["source", "How they joined"],
                  [(c) => utcStamp(c.consent_at || c.created_at), "Agreed on"],
                  [(c) => (c.unsubscribed_at ? utcStamp(c.unsubscribed_at) : ""), "Unsubscribed on"],
                ])
              }
            >
              Export CSV
            </Button>
          )
        }
      >
        {unsubscribed && (
          <p className="mb-3 text-[13px] text-[#404348]">
            These people unsubscribed and get no more newsletters (it took effect straight away; the team is emailed each time). Approve removal to delete their details.
          </p>
        )}
        {rows.length === 0 ? (
          <Empty>{unsubscribed ? "Nobody is waiting for removal." : "Nobody yet. People join by ticking “send me product news” on the demo or contact form, or you add them above."}</Empty>
        ) : (
          <ul className="divide-y divide-[#EEF1F7] text-[14px]">
            {rows.map((c) => (
              <li key={c.id} className="flex flex-wrap items-center justify-between gap-3 py-2.5">
                <span className="min-w-0">
                  <span className="font-medium text-[#0A0626]">{c.email}</span>
                  {(c.name || c.company) && <span className="text-[#6B6E75]"> · {[c.name, c.company].filter(Boolean).join(", ")}</span>}
                  <span className="block text-[12px] text-[#6B6E75]">{unsubscribed ? `Unsubscribed ${utcStamp(c.unsubscribed_at)}` : `${c.source} · since ${utcStamp(c.consent_at || c.created_at)}`}</span>
                </span>
                <Button variant={unsubscribed ? "primary" : "danger"} onClick={() => remove(c)}>
                  {unsubscribed ? "Approve removal" : "Remove"}
                </Button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}

function Sender({ out }) {
  const [data, reload] = useResource("/admin/settings", out);
  const [s, setS] = useState(null);
  const value = s || { name: "Cube Software", bookings: "info@cube-software.com", promotions: "info@cube-software.com", ...(data?.emailSender || {}) };
  if (!data) return <Empty>Loading...</Empty>;
  const save = async () => (await act(() => api("/admin/settings/emailSender", { method: "PUT", body: { value } }), "Saved.")) && (setS(null), reload());
  return (
    <Card title="Who emails come from">
      <div className="grid gap-4 md:grid-cols-3">
        <Field label="Sender name">
          <input value={value.name} maxLength={60} onChange={(e) => setS({ ...value, name: e.target.value })} className={INPUT} />
        </Field>
        <Field label="Demo confirmations from" hint="Confirm / decline emails to people who booked a demo.">
          <input type="email" value={value.bookings} onChange={(e) => setS({ ...value, bookings: e.target.value })} className={INPUT} />
        </Field>
        <Field label="Newsletters from" hint="Product news and offers.">
          <input type="email" value={value.promotions} onChange={(e) => setS({ ...value, promotions: e.target.value })} className={INPUT} />
        </Field>
      </div>
      <p className="mt-4 text-[13px] leading-6 text-[#404348]">
        The email account the server signs in with (its SMTP settings) must be allowed to send as these addresses. If you sign in as info@cube-software.com, use that address here, or add the
        others as aliases of it in your email provider.
      </p>
      <div className="mt-4 flex justify-end">
        <Button disabled={!s} onClick={save}>
          Save
        </Button>
      </div>
    </Card>
  );
}

export default function EmailsAdmin({ out }) {
  const [tab, setTab] = useState("newsletters");
  const [contacts] = useResource("/admin/contacts", out);
  const waiting = (contacts?.contacts || []).filter((c) => !c.subscribed).length;
  return (
    <>
      <PageTitle title="Emails" desc="Send newsletters about our products to clients and visitors who asked for them. Every email carries an unsubscribe link, which works straight away." />
      <div role="tablist" aria-label="Emails" className="mb-6 flex flex-wrap gap-2">
        {TABS.map(([key, label]) => (
          <button
            key={key}
            role="tab"
            type="button"
            aria-selected={tab === key}
            onClick={() => setTab(key)}
            className={`rounded-full px-4 py-2 text-[14px] font-medium transition-colors ${tab === key ? "bg-primary text-white" : "border border-[#DCE2EE] bg-white text-[#0A0626] hover:bg-[#F0F4FB]"}`}
          >
            {label}
            {key === "unsubscribed" && waiting > 0 && <span className={`ml-2 rounded-full px-1.5 text-[12px] ${tab === key ? "bg-white/25" : "bg-[#FFE1E1] text-[#B42318]"}`}>{waiting}</span>}
          </button>
        ))}
      </div>
      {tab === "newsletters" && <Newsletters out={out} />}
      {tab === "people" && <People out={out} />}
      {tab === "unsubscribed" && <People out={out} unsubscribed />}
      {tab === "sender" && <Sender out={out} />}
    </>
  );
}
