import { CONTACT, tel } from "../components/home/catalog";

// Cube the bot, as it is until something is saved in the dashboard's "Chat bot" page. A link can be any page,
// web address, phone number or email, or "demo:" to open the demo booking.
export const DEFAULT_BOT = {
  enabled: true,
  status: "Cube · Online",
  title: "Hi, I'm Cube",
  subtitle: "Online. How can we help you today?",
  bubbles: {
    default: "We're Online! How may I help you today?",
    pricing: "Need a custom Enterprise quote?",
    services: "Want to see how our Cloud Contact Center works?",
    industries: "Want to see Cube working in your industry?",
  },
  actions: [
    { label: "Book a demo", sub: "See Cube live", icon: "CalendarCheck", href: "demo:" },
    { label: "Talk to an expert", sub: CONTACT.expert, icon: "Phone", href: tel(CONTACT.expert) },
    { label: "Chat on WhatsApp", sub: "We reply quickly", icon: "MessageCircle", href: "https://wa.me/919899570753?text=Hello%20Cube%20Software%2C%20I%20would%20like%20to%20know%20more%20about%20your%20cloud%20telephony%20solutions." },
    { label: "Send an enquiry", sub: "We'll get back to you", icon: "Mail", href: "/contact" },
  ],
  questionsTitle: "Popular questions",
  faqs: [
    { q: "How do I book a demo?", a: "You can book a demo by clicking the 'Book Demo' button at the top of the page, or by navigating to our Contact section to fill out a request form. Our team will get in touch to schedule it." },
    { q: "What are your pricing plans?", a: "We offer flexible pricing starting at $19/month for our Starter plan and $49/month for our Professional Contact Center plan. Check out our Pricing page for all the details." },
    { q: "Do you offer 24/7 technical support?", a: "Yes! Our Professional and Enterprise tiers include dedicated 24/7 technical hotline access to ensure your business-critical communications never experience downtime." },
    { q: "Can I get a custom Enterprise quote?", a: `Absolutely. Please email us at ${CONTACT.email} or call our expert line at ${CONTACT.expert} to get a customized architecture breakdown.` },
  ],
};
