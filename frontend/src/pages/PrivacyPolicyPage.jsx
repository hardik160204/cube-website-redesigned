import React from "react";
import LegalDoc from "../components/page/LegalDoc";

// Privacy policy for the website's forms, written for India's Digital Personal Data Protection Act, 2023 and
// the IT Act, 2000. Draft wording for the company's legal review before launch.
const SECTIONS = [
  {
    title: "Who we are",
    body: [
      "This policy explains how Cube Software Pvt. Ltd. (\"Cube Software\", \"we\", \"us\") collects and uses personal data through this website. Cube Software is the data fiduciary for the personal data described here.",
    ],
  },
  {
    title: "What we collect",
    body: [
      "We collect the information you choose to give us in our demo request, contact and enquiry forms:",
      [
        "your name, phone number and email address;",
        "your company name, designation and company website;",
        "the solution you are interested in, your team size and any message you write.",
      ],
      "Like most websites, our servers may also record basic technical information such as your IP address, browser type and the pages you visit, to keep the website secure and working.",
    ],
  },
  {
    title: "Why we use it",
    body: [
      "We use your personal data only to:",
      [
        "respond to your enquiry, arrange a demo and send you the information you asked for;",
        "contact you by phone, email or WhatsApp about your enquiry;",
        "keep records of our conversations with prospective and existing customers;",
        "keep the website secure and meet our legal obligations.",
      ],
    ],
  },
  {
    title: "Your consent",
    body: [
      "We process the personal data you submit on the basis of the consent you give when you tick the consent box on our forms. You may withdraw your consent at any time by writing to us (see \"Contact us\"); this does not affect processing that took place before you withdrew it.",
    ],
  },
  {
    title: "Sharing your data",
    body: [
      "We do not sell your personal data. We share it only with our own staff who need it to handle your enquiry, with service providers who host or operate our systems on our behalf (such as our email provider) under confidentiality obligations, or where the law requires us to. When you book a demo, your details and the time you chose are emailed to our sales team.",
    ],
  },
  {
    title: "Where your data is stored",
    body: [
      "Our website and its database are run by Cube Software from India. The database and uploaded images are hosted by our service provider Supabase on servers in the European Union (Ireland), and emails are delivered through our email provider. This means your data is transferred outside India, and outside your own country if you are elsewhere.",
      "India: such transfers are permitted under the Digital Personal Data Protection Act, 2023 to countries not restricted by the Government of India. United Arab Emirates: under the Federal Personal Data Protection Law (Decree-Law No. 45 of 2021) we rely on your explicit consent to this transfer, which you give by ticking the consent box on our forms. Other countries: we collect only what is needed to answer your enquiry and do not collect browsing data without your consent.",
    ],
  },
  {
    title: "How long we keep it",
    body: [
      "We keep personal data only as long as needed, then delete it automatically:",
      [
        "demo bookings and enquiries: up to 36 months from when you contacted us, or sooner if you ask us to delete them;",
        "your cookie choice: 12 months in your browser, after which we ask again; our record of it: 13 months after your last choice;",
        "analytics page counts (only with your consent): 13 months;",
        "security and processing logs for our admin area: 1 year, as required for security and audit purposes;",
        "admin sign-in sessions: until the browser closes, after 30 minutes of inactivity, or after 12 hours.",
      ],
      "If the law requires us to keep something longer (for example for a legal claim or a request from a lawful authority), we keep only that, only for as long as required.",
    ],
  },
  {
    title: "How we protect it",
    body: [
      "Your data is encrypted in transit, stored in a database that is closed to public access, and readable only by our website's server. Our admin area requires a password and a one-time code sent by email, signs staff out after inactivity, and logs every sign-in and change. We review these measures regularly.",
    ],
  },
  {
    title: "Your rights",
    body: [
      "Subject to applicable law, you have the right to:",
      [
        "access a summary of the personal data we hold about you, and receive a copy of it;",
        "ask us to correct, complete, update or erase it;",
        "withdraw your consent, as easily as you gave it;",
        "have a grievance about our handling of your data addressed;",
        "nominate another person to exercise these rights for you in the event of your death or incapacity.",
      ],
      "To exercise these rights, contact us using the details below. We respond within 30 days. If you are not satisfied with our response, you may complain to the Data Protection Board of India or, in the UAE, to the UAE Data Office.",
    ],
  },
  {
    title: "Cookies",
    body: [
      "When you first visit, we ask which optional cookies you allow. Nothing optional is switched on until you agree, and you can change your choice at any time from \"Cookie settings\" at the bottom of every page.",
      [
        "Strictly necessary (always on, no consent needed): your cookie choice, kept in your browser for 12 months; and, for our own staff only, a sign-in cookie for the admin area that is deleted when the browser closes. These hold no tracking data.",
        "Analytics (optional, off until you allow it): we count which pages are visited, the website you came from and your type of device, browser and language. We do not store your IP address, set an analytics cookie or give you an identifier, and we delete these counts after 13 months.",
        "Maps (optional, off until you allow it): the Google Maps view of our office on the Contact page. When it loads, Google sets its own cookies under Google's privacy policy. If you say no, the map is replaced by a link you can open yourself.",
      ],
      "We do not use advertising, profiling or cross-site tracking cookies. Your choice expires after 12 months and we ask again. We keep a receipt of each choice (a random identifier, your choices, the notice version and the time) for 13 months so we can show what you agreed to. You can change your choice any time, or block and delete cookies in your browser settings.",
    ],
  },
  {
    title: "Changes to this policy",
    body: ["We may update this policy from time to time. The date at the top of this page shows when it was last changed."],
  },
  {
    title: "Contact us",
    body: [
      "For any privacy question, request or grievance, write to: Grievance Officer, Cube Software Pvt. Ltd., E-44/3, Ground Floor, Okhla Industrial Area, Phase-II, New Delhi-110020, India.",
      "Email: sales@cube-software.com · Phone: +91 806 869 4440",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalDoc
      title="Privacy"
      highlight="Policy"
      intro="How Cube Software collects, uses and protects the information you share with us through this website."
      updated="27 October 2026"
      sections={SECTIONS}
    />
  );
}
