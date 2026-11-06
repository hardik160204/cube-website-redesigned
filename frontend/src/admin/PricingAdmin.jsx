import React, { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, ExternalLink, PencilLine, Plus, Trash2 } from "lucide-react";
import { api } from "../lib/api";
import { DEFAULT_PRICING, priceOf } from "../pages/PricingPage";
import { Button, Card, Empty, Field, INPUT, PageTitle, act, useResource } from "./ui";
import { startEditing } from "./ContentAdmin";

// The plans and prices on the Pricing page, the homepage's plan strip, and the annual discount wherever it's
// mentioned (the top bar, the Resources menu). Annual prices follow from the monthly price and the discount.

const BLANK = { name: "", badge: "", description: "", monthlyPrice: 0, yearlyPrice: 0, highlight: false, features: [] };
const annual = (monthly, discount) => Math.round(monthly * (1 - discount / 100));
const swap = (list, i, j) => {
  const next = [...list];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
};

export default function PricingAdmin({ me, out }) {
  const [data, reload] = useResource("/admin/settings", out);
  const [p, setP] = useState(null);
  const [dirty, setDirty] = useState(false);
  useEffect(() => {
    if (data) setP(structuredClone(data.pricing || DEFAULT_PRICING));
  }, [data]);
  if (!p) return <Empty>Loading...</Empty>;

  const set = (patch) => {
    setP({ ...p, ...patch });
    setDirty(true);
  };
  const setDiscount = (discount) => set({ discount, tiers: p.tiers.map((t) => (priceOf(t.monthlyPrice) === null ? t : { ...t, yearlyPrice: annual(t.monthlyPrice, discount) })) });
  const tier = (i, patch) => set({ tiers: p.tiers.map((t, k) => (k === i ? { ...t, ...patch } : t)) });
  const save = async () => {
    if (await act(() => api("/admin/settings/pricing", { method: "PUT", body: { value: p } }), "Saved. Prices are live on the website.")) {
      setDirty(false);
      reload();
    }
  };
  const money = (n) => `${p.currency} ${n.toLocaleString("en-IN")}`;
  const canEdit = me.isOwner || me.permissions.includes("content");

  return (
    <>
      <PageTitle
        title="Pricing"
        desc="Your plans, prices and annual discount. They show on the Pricing page and the homepage, and the discount also updates the top bar and the Resources menu."
        actions={
          <>
            <a href="/pricing" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-[#DCE2EE] bg-white px-3.5 py-2 text-[14px] font-medium text-[#0A0626] hover:bg-[#F0F4FB]">
              View pricing page <ExternalLink size={14} />
            </a>
            <Button disabled={!dirty} onClick={save}>
              {dirty ? "Save" : "Saved"}
            </Button>
          </>
        }
      />

      <div className="space-y-6">
        <Card title="Discount and currency">
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Annual billing discount (%)" hint="Annual prices are worked out from this. 0 hides every “Save …%” message.">
              <input type="number" min={0} max={90} value={p.discount} onChange={(e) => setDiscount(Math.max(0, Math.min(90, Math.round(Number(e.target.value) || 0))))} className={INPUT} />
            </Field>
            <Field label="Currency" hint="Shown before every price, e.g. Rs. or ₹">
              <input value={p.currency} maxLength={8} onChange={(e) => set({ currency: e.target.value })} className={INPUT} />
            </Field>
            <Field label="Price is per" hint="Shown after every price">
              <input value={p.unit} maxLength={40} onChange={(e) => set({ unit: e.target.value })} className={INPUT} />
            </Field>
          </div>
        </Card>

        <Card
          title={`Plans (${p.tiers.length})`}
          actions={
            <Button variant="ghost" disabled={p.tiers.length >= 6} onClick={() => set({ tiers: [...p.tiers, { ...BLANK, features: [] }] })}>
              <Plus size={15} /> Add a plan
            </Button>
          }
        >
          <ul className="space-y-4">
            {p.tiers.map((t, i) => {
              const custom = priceOf(t.monthlyPrice) === null;
              return (
                <li key={i} className={`rounded-2xl border p-4 ${t.highlight ? "border-primary" : "border-[#E5EAF4]"}`}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <span className="text-[15px] font-medium text-[#0A0626]">{t.name || "New plan"}</span>
                    <span className="flex gap-1.5">
                      <Button variant="ghost" className="px-2" disabled={i === 0} onClick={() => set({ tiers: swap(p.tiers, i, i - 1) })} aria-label="Move plan earlier">
                        <ArrowUp size={14} />
                      </Button>
                      <Button variant="ghost" className="px-2" disabled={i === p.tiers.length - 1} onClick={() => set({ tiers: swap(p.tiers, i, i + 1) })} aria-label="Move plan later">
                        <ArrowDown size={14} />
                      </Button>
                      <Button variant="danger" className="px-2" disabled={p.tiers.length === 1} onClick={() => window.confirm(`Remove the plan “${t.name}”?`) && set({ tiers: p.tiers.filter((_, k) => k !== i) })} aria-label="Remove plan">
                        <Trash2 size={14} />
                      </Button>
                    </span>
                  </div>
                  <div className="mt-3 grid gap-4 md:grid-cols-2">
                    <Field label="Plan name">
                      <input value={t.name} maxLength={80} onChange={(e) => tier(i, { name: e.target.value })} className={INPUT} />
                    </Field>
                    <Field label="Small badge (optional)" hint="e.g. Most Popular">
                      <input value={t.badge} maxLength={30} onChange={(e) => tier(i, { badge: e.target.value })} className={INPUT} />
                    </Field>
                    <Field label="Description" className="md:col-span-2">
                      <textarea rows={2} value={t.description} maxLength={300} onChange={(e) => tier(i, { description: e.target.value })} className={INPUT} />
                    </Field>
                    <div>
                      <span className="mb-1.5 block text-[13px] font-medium text-[#404348]">Price</span>
                      <label className="mb-2 flex items-center gap-2 text-[13px] text-[#404348]">
                        <input type="checkbox" checked={custom} onChange={(e) => tier(i, e.target.checked ? { monthlyPrice: "Custom", yearlyPrice: "Custom" } : { monthlyPrice: 0, yearlyPrice: 0 })} className="h-4 w-4 accent-[#0047FF]" />
                        Custom quote (no price shown)
                      </label>
                      {!custom && (
                        <>
                          <div className="flex items-center gap-2">
                            <span className="text-[13px] text-[#6B6E75]">{p.currency}</span>
                            <input
                              type="number"
                              min={0}
                              value={t.monthlyPrice}
                              onChange={(e) => {
                                const monthlyPrice = Math.max(0, Math.round(Number(e.target.value) || 0));
                                tier(i, { monthlyPrice, yearlyPrice: annual(monthlyPrice, p.discount) });
                              }}
                              className={`${INPUT} w-40`}
                              aria-label="Monthly price"
                            />
                            <span className="text-[13px] text-[#6B6E75]">{p.unit}, monthly billing</span>
                          </div>
                          <p className="mt-1.5 text-[12px] text-[#0F6B3A]">
                            Annual billing: {money(t.yearlyPrice)} {p.unit}
                            {p.discount ? ` (${p.discount}% off)` : ""}
                          </p>
                        </>
                      )}
                    </div>
                    <label className="flex items-center gap-2 self-start text-[13px] text-[#404348] md:mt-7">
                      <input type="checkbox" checked={t.highlight} onChange={(e) => tier(i, { highlight: e.target.checked })} className="h-4 w-4 accent-[#0047FF]" />
                      Highlight this plan (dark card)
                    </label>
                    <Field label="What's included" hint="One per line" className="md:col-span-2">
                      <textarea rows={6} value={t.features.join("\n")} onChange={(e) => tier(i, { features: e.target.value.split("\n") })} className={INPUT} />
                    </Field>
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>

        <Card title="The rest of the pricing page">
          <p className="text-[14px] text-[#404348]">The headline, the trust cards, the questions and answers and every other word on the page are changed in the visual editor, the same as any page.</p>
          {canEdit && (
            <Button className="mt-3" onClick={() => startEditing("/pricing")}>
              <PencilLine size={15} /> Edit the pricing page
            </Button>
          )}
        </Card>

        <div className="sticky bottom-3 z-10 flex items-center justify-end gap-3 rounded-2xl border border-[#E5EAF4] bg-white p-3 shadow-[0_12px_30px_-18px_rgb(10_6_38/0.4)]">
          <span className={`text-[13px] ${dirty ? "text-[#9A5B00]" : "text-[#0F6B3A]"}`}>{dirty ? "You have unsaved changes" : "Everything is saved"}</span>
          <Button disabled={!dirty} onClick={save}>
            Save
          </Button>
        </div>
      </div>
    </>
  );
}
