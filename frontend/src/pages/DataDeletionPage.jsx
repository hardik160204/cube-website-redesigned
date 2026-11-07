import React, { useState } from "react";
import { Check, Send } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { PageHero, Section } from "../components/page/kit";
import { api } from "../lib/api";

// Anyone can ask for their personal data to be deleted (DPDP Act right to erasure). The request goes to the team,
// who check it really comes from that person and then erase their data (dashboard → Privacy requests).
const FIELD =
  "w-full rounded-xl border border-[#E5EAF4] bg-[#F7F9FD] px-4 py-3.5 text-base text-[#0A0626] transition-[border-color,background-color,box-shadow] duration-200 placeholder:text-[#6B6E75] focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10";

export default function DataDeletionPage() {
  const [form, setForm] = useState({ email: "", name: "", details: "", company_website: "" });
  const [state, setState] = useState("form");
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    setState("sending");
    try {
      await api("/deletion-requests", { method: "POST", body: form });
      setState("done");
    } catch (err) {
      toast.error(err.message);
      setState("form");
    }
  };
  return (
    <>
      <PageHero
        crumbs={["Data deletion"]}
        label="Your data"
        title="Delete my"
        highlight="data"
        body="Ask us to delete the personal data we hold about you: demo bookings, enquiries, newsletter sign-ups and visitor records."
        actions={<span />}
      />
      <Section>
        <div className="mx-auto max-w-[640px]">
          {state === "done" ? (
            <div role="status" className="flex flex-col items-center rounded-3xl border border-[#E5EAF4] p-10 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white">
                <Check size={26} strokeWidth={3} />
              </span>
              <h2 className="mt-5 text-[24px] font-medium text-[#0A0626]">We've got your request</h2>
              <p className="mt-3 text-[16px] leading-7 text-[#4A4D53]">
                We'll confirm by email that the request is really from you, then delete your data and let you know. We reply within 30 days.
              </p>
            </div>
          ) : (
            <form onSubmit={submit} className="relative space-y-5 rounded-3xl border border-[#E5EAF4] p-6 sm:p-10">
              <p className="text-[15px] leading-7 text-[#4A4D53]">
                Use the email address you gave us. To protect you, we'll check the request comes from you before deleting anything. See our{" "}
                <Link to="/privacy" className="font-medium text-primary underline underline-offset-2">
                  Privacy Policy
                </Link>{" "}
                for what we keep and why.
              </p>
              <div>
                <label htmlFor="d-email" className="mb-2 block text-sm font-medium text-[#404348]">
                  Email address *
                </label>
                <input id="d-email" type="email" required maxLength={254} autoComplete="email" value={form.email} onChange={set("email")} className={FIELD} />
              </div>
              <div>
                <label htmlFor="d-name" className="mb-2 block text-sm font-medium text-[#404348]">
                  Name
                </label>
                <input id="d-name" maxLength={120} autoComplete="name" value={form.name} onChange={set("name")} className={FIELD} />
              </div>
              <div>
                <label htmlFor="d-details" className="mb-2 block text-sm font-medium text-[#404348]">
                  Anything that helps us find your data (optional)
                </label>
                <textarea id="d-details" rows={4} maxLength={2000} value={form.details} onChange={set("details")} className={`${FIELD} resize-none`} />
              </div>
              {/* Hidden from people; bots fill it in. */}
              <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                <label htmlFor="d-hp">Company website</label>
                <input id="d-hp" tabIndex={-1} autoComplete="off" value={form.company_website} onChange={set("company_website")} />
              </div>
              <button
                type="submit"
                disabled={state === "sending"}
                className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-primary px-8 py-3.5 text-[16px] font-medium text-white transition-[background-color,transform] duration-200 hover:bg-[#2300DC] active:scale-[0.97] disabled:opacity-70 sm:w-auto"
              >
                {state === "sending" ? "Sending..." : "Send deletion request"} <Send size={17} />
              </button>
            </form>
          )}
        </div>
      </Section>
    </>
  );
}
