import React from "react";
import LegalDoc from "../components/page/LegalDoc";
import { useLegal } from "../lib/legal";

// Refund and cancellation policy. Built-in draft wording for the company's review; the text shown can be changed
// in the dashboard (Legal pages) without a code change.
export const REFUND = {
  intro: "How cancellations and refunds work for Cube Software subscriptions and services.",
  updated: "6 November 2026",
  sections: [
    {
      title: "Who this applies to",
      body: ["This policy applies to subscriptions and services you buy from Cube Software Pvt. Ltd. (\"Cube Software\", \"we\"), whether through a quotation, an order form or an invoice. Your signed agreement with us, where there is one, takes precedence over this page."],
    },
    {
      title: "What you pay",
      body: [
        "Every charge is listed on your quotation before you buy, with taxes shown separately. Prices on our website exclude GST and other applicable taxes, which are added at the rate in force on your invoice. There are no other fees beyond those on your quotation.",
        "Some services involve one-time charges, which your quotation names in advance:",
        ["set-up and configuration;", "telephone numbers, number porting and other charges made by telecom operators;", "hardware or on-site work, where you order it."],
      ],
    },
    {
      title: "Demos",
      body: ["Product demos are free of charge, and booking one does not commit you to buy anything."],
    },
    {
      title: "Cancelling a subscription",
      body: [
        "You can cancel a subscription at any time by writing to sales@cube-software.com from the email address on your account. Cancellation takes effect at the end of the billing period you have already paid for, and you are not charged after that. Your service stays available until then.",
        "If your agreement has a minimum term or a notice period, that applies instead.",
      ],
    },
    {
      title: "Refunds",
      body: [
        "Fees for a billing period that has already started are not refunded, except in the cases below or where the law requires it:",
        [
          "if we can't provide a service you paid for, we refund the unused part of the fee;",
          "if you were charged twice, or charged an amount that doesn't match your quotation or invoice, we refund the difference;",
          "if you cancel within 7 days of buying and before the service has been set up or used, we refund the subscription fee.",
        ],
        "One-time charges paid to third parties (such as telecom operator charges and number porting) can't be refunded once the work with them has started.",
      ],
    },
    {
      title: "How to ask for a refund",
      body: [
        "Email sales@cube-software.com with your invoice number and the reason. We reply within 7 working days. Approved refunds are paid to the original payment method within 14 working days of approval.",
      ],
    },
    {
      title: "Contact",
      body: [
        "Cube Software Pvt. Ltd. — Registered Office: E-44/3, Ground Floor, Okhla Industrial Area, Phase-II, New Delhi-110020, India. Corporate Office: A-26, Ground Floor, Sector 63, Noida, Uttar Pradesh 201301, India.",
        "Email: sales@cube-software.com · Phone: +91 806 869 4440",
      ],
    },
  ],
};

export default function RefundPolicyPage() {
  const doc = useLegal("refund") || REFUND;
  return <LegalDoc title="Refund" highlight="Policy" {...doc} />;
}
