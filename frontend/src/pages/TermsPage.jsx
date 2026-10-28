import React from "react";
import LegalDoc from "../components/page/LegalDoc";

// Standard website terms for Cube Software. Draft wording for the company's legal review before launch.
const SECTIONS = [
  {
    title: "Acceptance of these terms",
    body: [
      "These Terms & Conditions govern your use of the Cube Software Pvt. Ltd. (\"Cube Software\", \"we\", \"us\") website. By using this website, or by submitting any form on it, you agree to these terms and to our Privacy Policy. If you do not agree, please do not use the website.",
    ],
  },
  {
    title: "Use of the website",
    body: [
      "You may browse the website and use its forms to learn about and enquire about our products and services. You agree not to:",
      [
        "use the website for any unlawful purpose or in breach of any applicable law;",
        "submit false, misleading or another person's information;",
        "attempt to gain unauthorised access to the website, its servers or any connected system;",
        "copy, scrape or republish the website's content for commercial purposes without our written permission.",
      ],
    ],
  },
  {
    title: "Information you submit",
    body: [
      "When you fill in a demo request, contact or enquiry form, you confirm that the information you give is accurate and that you are authorised to share it, including on behalf of your organisation. You consent to Cube Software using it to respond to your enquiry, as described in our Privacy Policy.",
    ],
  },
  {
    title: "Products, pricing and quotations",
    body: [
      "Descriptions of products, features and plans on this website are for general information. Prices shown are indicative and may change. A binding commercial arrangement exists only under a written quotation, order or agreement signed by Cube Software, whose terms take precedence over anything on this website.",
    ],
  },
  {
    title: "Intellectual property",
    body: [
      "The website and its content, including text, graphics, logos, product names and software, belong to Cube Software or its licensors and are protected by intellectual property laws. Client and partner names and logos belong to their respective owners and are shown for identification only.",
    ],
  },
  {
    title: "Third-party links",
    body: [
      "The website may link to third-party websites or services (for example WhatsApp or social networks). We do not control them and are not responsible for their content or practices; your use of them is governed by their own terms.",
    ],
  },
  {
    title: "Disclaimer and limitation of liability",
    body: [
      "The website is provided \"as is\" and \"as available\". To the fullest extent permitted by law, Cube Software makes no warranties about its accuracy, completeness or availability, and is not liable for any indirect, incidental or consequential loss arising from your use of the website.",
    ],
  },
  {
    title: "Changes to these terms",
    body: ["We may update these terms from time to time. The date at the top of this page shows when they were last changed. Continued use of the website after a change means you accept the updated terms."],
  },
  {
    title: "Governing law",
    body: ["These terms are governed by the laws of India. The courts at New Delhi shall have exclusive jurisdiction over any dispute arising from them or from your use of the website."],
  },
  {
    title: "Contact",
    body: [
      "Cube Software Pvt. Ltd. — Registered Office: E-44/3, Ground Floor, Okhla Industrial Area, Phase-II, New Delhi-110020, India. Corporate Office: A-26, Ground Floor, Sector 63, Noida, Uttar Pradesh 201301, India.",
      "Email: sales@cube-software.com · Phone: +91 806 869 4440",
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalDoc
      title="Terms &"
      highlight="Conditions"
      intro="The terms that apply when you use the Cube Software website and its forms."
      updated="26 October 2026"
      sections={SECTIONS}
    />
  );
}
