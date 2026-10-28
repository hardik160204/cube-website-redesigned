import React from "react";
import { Button, Card, Empty, PageTitle, downloadCsv, useResource, utcStamp } from "./ui";

// Proof of consent (DPDP Act): every browser's cookie choice, and how many people agreed to the Terms &
// Conditions and Privacy Policy on the forms. Each booking and enquiry also keeps its own agreement time
// and the policy version it agreed to.

const yesNo = (v) => (v ? "Allowed" : "Refused");

export default function ConsentAdmin({ out }) {
  const [data] = useResource("/admin/consents", out);
  const t = data?.totals;
  const tiles = data
    ? [
        ["Cookie choices recorded", t.total],
        ["Allowed Google Maps", t.functional],
        ["Optional cookies refused", t.total - t.functional],
        ["Choices in the last 30 days", t.last30],
        ["Demo bookings with Terms agreement", data.forms.bookings],
        ["Enquiries with Terms agreement", data.forms.leads],
      ]
    : [];
  return (
    <>
      <PageTitle
        title="Consent records"
        desc="Kept as proof of consent. Each form submission also stores when the person agreed to the Terms & Conditions and Privacy Policy, and which version."
        actions={
          <Button
            variant="ghost"
            disabled={!data?.records.length}
            onClick={() =>
              downloadCsv("cube-cookie-consents.csv", data.records, [
                ["id", "Browser id"],
                [(r) => yesNo(r.functional), "Maps (functional)"],
                [(r) => yesNo(r.analytics), "Analytics"],
                [(r) => yesNo(r.marketing), "Marketing"],
                ["version", "Notice version"],
                [(r) => utcStamp(r.created_at), "First choice (IST)"],
                [(r) => utcStamp(r.updated_at), "Latest change (IST)"],
              ])
            }
          >
            Export CSV
          </Button>
        }
      />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {tiles.map(([label, n]) => (
          <div key={label} className="rounded-2xl border border-[#E5EAF4] bg-white p-5">
            <span className="text-[13px] text-[#6B6E75]">{label}</span>
            <span className="mt-1 block text-[30px] font-medium text-[#0A0626]">{n}</span>
          </div>
        ))}
      </div>
      <Card title="Cookie choices (latest first)" className="mt-6">
        {!data ? (
          <Empty>Loading...</Empty>
        ) : data.records.length === 0 ? (
          <Empty>No cookie choices recorded yet.</Empty>
        ) : (
          <div className="-m-5 overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-[14px]">
              <thead className="bg-[#F5F8FD] text-[12px] uppercase tracking-[0.06em] text-[#6B6E75]">
                <tr>
                  {["Browser id", "Maps", "Analytics", "Marketing", "Notice", "First choice", "Latest change"].map((h) => (
                    <th key={h} className="px-5 py-3 font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEF1F7]">
                {data.records.map((r) => (
                  <tr key={r.id}>
                    <td className="px-5 py-2.5 font-mono text-[12px] text-[#6B6E75]">{r.id.slice(0, 8)}…</td>
                    {[r.functional, r.analytics, r.marketing].map((v, i) => (
                      <td key={i} className={`px-5 py-2.5 ${v ? "text-[#0F6B3A]" : "text-[#6B6E75]"}`}>
                        {yesNo(v)}
                      </td>
                    ))}
                    <td className="px-5 py-2.5">{r.version}</td>
                    <td className="px-5 py-2.5">{utcStamp(r.created_at)}</td>
                    <td className="px-5 py-2.5">{utcStamp(r.updated_at)}</td>
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
