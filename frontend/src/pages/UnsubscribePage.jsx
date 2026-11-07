import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { MailX } from "lucide-react";
import { PageHero, Section } from "../components/page/kit";
import { api } from "../lib/api";

// Where the unsubscribe link in our emails leads. It asks for a click first, because email security scanners open
// links by themselves and would otherwise unsubscribe people who never asked.
export default function UnsubscribePage() {
  const [params] = useSearchParams();
  const [state, setState] = useState("ask");
  const [message, setMessage] = useState("");
  const e = params.get("e") || "";
  const t = params.get("t") || "";
  let email = "";
  try {
    email = atob(e.replace(/-/g, "+").replace(/_/g, "/"));
  } catch {
    /* not a link from our emails */
  }
  const go = async () => {
    setState("sending");
    try {
      await api("/unsubscribe", { method: "POST", body: { e, t } });
      setState("done");
    } catch (err) {
      setMessage(err.message);
      setState("error");
    }
  };
  return (
    <>
      <PageHero crumbs={["Unsubscribe"]} label="Emails" title="Unsubscribe" body="Stop getting emails from Cube Software." actions={<span />} />
      <Section>
        <div role="status" className="mx-auto flex max-w-[560px] flex-col items-center rounded-3xl border border-[#E5EAF4] p-10 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#EEF3FF] text-primary">
            <MailX size={26} />
          </span>
          {state === "done" ? (
            <>
              <h2 className="mt-5 text-[24px] font-medium text-[#0A0626]">You're unsubscribed</h2>
              <p className="mt-3 text-[16px] leading-7 text-[#4A4D53]">{email || "This address"} won't get our newsletters any more. Emails about a demo you book still reach you.</p>
            </>
          ) : state === "error" || !e || !t ? (
            <>
              <h2 className="mt-5 text-[24px] font-medium text-[#0A0626]">This link didn't work</h2>
              <p className="mt-3 text-[16px] leading-7 text-[#4A4D53]">{message || "Please use the unsubscribe link from one of our emails, or reply to the email and we'll take you off the list."}</p>
            </>
          ) : (
            <>
              <h2 className="mt-5 text-[24px] font-medium text-[#0A0626]">Unsubscribe {email}?</h2>
              <p className="mt-3 text-[16px] leading-7 text-[#4A4D53]">You'll stop getting our newsletters straight away.</p>
              <button
                type="button"
                onClick={go}
                disabled={state === "sending"}
                className="mt-6 rounded-xl bg-primary px-8 py-3.5 text-[16px] font-medium text-white transition-[background-color,transform] duration-200 hover:bg-[#2300DC] active:scale-[0.97] disabled:opacity-70"
              >
                {state === "sending" ? "Unsubscribing..." : "Unsubscribe"}
              </button>
            </>
          )}
        </div>
      </Section>
    </>
  );
}
