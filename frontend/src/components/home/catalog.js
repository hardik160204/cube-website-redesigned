import {
  BarChart3, Building, Briefcase, Cloud, Database, Flag, GraduationCap, Hash, Headphones, HeartPulse, Headset, Heart,
  Info, Landmark, Newspaper, LifeBuoy, Lock, Mail, MessageCircle, MessagesSquare, Mic, MonitorPlay, MousePointerClick,
  Phone, PhoneCall, PhoneIncoming, PhoneMissed, PhoneOutgoing, Plane, Plug, Quote, Radio, Receipt, Route, ShieldCheck,
  Target, TowerControl, Users, Voicemail, Workflow,
} from "lucide-react";

// One source for the homepage nav, footer and industry grid.
// Every href is a route that exists in App.js; every description is a line the site already uses.

export const PLATFORM = [
  {
    heading: "Communicate",
    icon: Phone,
    // Hero line from the product's own page, shown as the panel's featured card
    featured: { title: "Contact Center Solution", desc: "Get results with a powerful inbound, outbound and blended cloud contact center solution with full call disposition.", href: "/services/ai-contact-center" },
    links: [
      { label: "Cloud Contact Center", desc: "Inbound, outbound and blended cloud contact center.", href: "/services/cloud-contact-center", icon: Cloud },
      { label: "Auto Dialer", desc: "Predictive, progressive and preview dialing.", href: "/services/auto-dialer", icon: PhoneOutgoing },
      { label: "Cloud IVR", desc: "Multi-level menus that greet, qualify and steer callers.", href: "/services/ivr", icon: Workflow },
      { label: "Custom IVRS", desc: "Multi-level IVR for structured call handling.", href: "/services/ivrs", icon: Radio },
      { label: "Click to Call", desc: "Callbacks requested straight from your website.", href: "/services/click-to-call", icon: MousePointerClick },
      { label: "Conference Bridge", desc: "Secure multi-party audio conferencing rooms.", href: "/services/conference-bridge", icon: Headphones },
    ],
  },
  {
    heading: "Engage",
    icon: MessageCircle,
    featured: { title: "WhatsApp API & Bot", desc: "Engage your customers where they already are. Build intelligent conversational workflows, automate customer support, and drive sales 24/7 through the official WhatsApp Business API.", href: "/services/whatsapp-bot" },
    links: [
      { label: "WhatsApp Bot", desc: "WhatsApp Business API for conversational messaging.", href: "/services/whatsapp-bot", icon: MessageCircle },
      { label: "Web Chat Bot", desc: "Chat lands in the same omnichannel contact center.", href: "/services/web-chat-bot", icon: MessagesSquare },
      { label: "Bulk Voice Calls", desc: "Record once and deliver to your whole list.", href: "/services/bulk-voice-call", icon: PhoneCall },
      { label: "Missed Call", desc: "Turn a missed call into a lead or an opt-in.", href: "/services/missed-call", icon: PhoneMissed },
    ],
  },
  {
    heading: "Numbers & routing",
    icon: Hash,
    featured: { title: "Toll Free Numbers", desc: "Build a premium brand image and enhance customer satisfaction. Provide your callers with a free, memorable 1800 number integrated directly with our cloud telephony suite.", href: "/services/toll-free-number" },
    links: [
      { label: "Toll-Free Numbers", desc: "Free calling for customers across India.", href: "/services/toll-free-number", icon: PhoneIncoming },
      { label: "Virtual Numbers", desc: "One number that rings any phone, anywhere.", href: "/services/virtual-number", icon: PhoneCall },
      { label: "Number Masking", desc: "Real numbers stay private on both sides of a call.", href: "/services/number-masking", icon: Lock },
      { label: "Smart Call Routing", desc: "Route by skill, language or business value.", href: "/services/smart-call-routing", icon: Route },
    ],
  },
  {
    heading: "Record",
    icon: Mic,
    featured: { title: "Callisto Voice Logger", desc: "The ideal call recording solution — every conversation captured, compressed and searchable.", href: "/services/voice-logger" },
    links: [
      { label: "Callisto Voice Logger", desc: "SIP, analog or digital lines — compressed and searchable.", href: "/services/voice-logger", icon: Mic },
      { label: "Screen Logger", desc: "Multi-PC screen capture synced with the audio.", href: "/services/screen-logger", icon: MonitorPlay },
      { label: "Voice Logger InSync", desc: "InSync centralises recordings from every location.", href: "/services/voice-logger-insync", icon: Database },
      { label: "Cloud Call Recording", desc: "Every call recorded and searchable for QA.", href: "/services/call-recording", icon: Mic },
      { label: "Cube Voice Mail", desc: "Messages captured and delivered when nobody can pick up.", href: "/services/voice-mail", icon: Voicemail },
    ],
  },
  {
    heading: "Analyze",
    icon: BarChart3,
    featured: { title: "Call Billing Software", desc: "Take command of telecom resources and costs across every office, hotel and facility.", href: "/services/call-billing" },
    links: [
      { label: "Live Analytics", desc: "Queues, answer rates and waits as they happen.", href: "/services/live-analytics", icon: BarChart3 },
      { label: "Quality Analysis", desc: "Score and review calls to coach your team.", href: "/services/quality-analysis", icon: ShieldCheck },
      
    ],
  },
];

export const SOLUTIONS = [
  { title: "Contact Center Solution", desc: "Complete omnichannel contact center", href: "/services/ai-contact-center", icon: Headset },
  { title: "Student Calling System", desc: "Secure calling for educational campuses", href: "/student-calling", icon: GraduationCap },
  { title: "Prison Calling System", desc: "Highly secure, managed inmate calling", href: "/prison-calling", icon: ShieldCheck },
  { title: "Call Billing Basic", desc: "Essential telecom resource & cost management", href: "/billing/basic", icon: Receipt },
  { title: "Call Billing Standard", desc: "Billing rules and departmental tracking", href: "/billing/standard", icon: Receipt },
  { title: "Call Billing Enterprise", desc: "Multi-site management with custom APIs", href: "/billing/enterprise", icon: Building },
];

export const INDUSTRIES = [
  {
    title: "BPO – KPO",
    desc: "High-volume dialing and live monitoring",
    href: "/industries/bpo",
    icon: Headset,
    uses: ["Predictive and progressive dialing for outbound floors", "Every call recorded and searchable for QA", "Supervisor wallboards for live queues"],
    products: [["Auto Dialer", "/services/auto-dialer"], ["Callisto Voice Logger", "/services/voice-logger"], ["Live Analytics", "/services/live-analytics"]],
  },
  {
    title: "Financial services",
    desc: "Compliant recording and secure calling",
    href: "/industries/finance",
    icon: Landmark,
    uses: ["Recorded calls ready for regulatory audits", "Masked numbers for collection teams", "IVR self-service for routine queries"],
    products: [["Callisto Voice Logger", "/services/voice-logger"], ["Number Masking", "/services/number-masking"], ["Cloud IVR", "/services/ivr"]],
  },
  {
    title: "Healthcare",
    desc: "Patient-first communication suites",
    href: "/industries/healthcare",
    icon: HeartPulse,
    uses: ["Appointment reminders as voice calls", "Emergency helplines routed to the right desk", "Recorded calls for patient-care reviews"],
    products: [["Bulk Voice Calls", "/services/bulk-voice-call"], ["Smart Call Routing", "/services/smart-call-routing"], ["Cloud Call Recording", "/services/call-recording"]],
  },
  {
    title: "Real estate",
    desc: "Lead follow-up and site-visit scheduling",
    href: "/industries/real-estate",
    icon: Building,
    uses: ["Missed-call lead capture from ads", "Click-to-call on every listing", "Callbacks before every site visit"],
    products: [["Missed Call", "/services/missed-call"], ["Click to Call", "/services/click-to-call"], ["Auto Dialer", "/services/auto-dialer"]],
  },
  {
    title: "Telecom",
    desc: "Carrier-grade telecom solutions",
    href: "/industries/telecom",
    icon: TowerControl,
    uses: ["IVR for high-volume subscriber support", "Call billing across sites and circles", "Recording synced across locations"],
    products: [["Custom IVRS", "/services/ivrs"], ["Call Billing", "/services/call-billing"], ["Voice Logger InSync", "/services/voice-logger-insync"]],
  },
  {
    title: "Travel & tourism",
    desc: "Peak-season booking support",
    href: "/industries/travel",
    icon: Plane,
    uses: ["Toll-free booking lines", "Overflow routing during peak season", "Callbacks for missed enquiries"],
    products: [["Toll-Free Numbers", "/services/toll-free-number"], ["Smart Call Routing", "/services/smart-call-routing"], ["Missed Call", "/services/missed-call"]],
  },
  {
    title: "Advertising",
    desc: "Campaign tracking and lead generation",
    href: "/industries/advertising",
    icon: Target,
    uses: ["A tracking number for every campaign", "Missed-call responses from print and TV", "Call reports by source"],
    products: [["Virtual Numbers", "/services/virtual-number"], ["Missed Call", "/services/missed-call"], ["Live Analytics", "/services/live-analytics"]],
  },
  {
    title: "NGOs",
    desc: "Awareness drives and fundraising",
    href: "/industries/ngo",
    icon: Heart,
    uses: ["Bulk voice calls for awareness drives", "Missed-call pledges and opt-ins", "Donor helplines with IVR"],
    products: [["Bulk Voice Calls", "/services/bulk-voice-call"], ["Missed Call", "/services/missed-call"], ["Cloud IVR", "/services/ivr"]],
  },
  {
    title: "Election campaigns",
    desc: "Voter outreach and surveys",
    href: "/industries/election",
    icon: Flag,
    uses: ["Bulk voice calls for voter outreach", "IVR surveys at scale", "Missed-call volunteer sign-ups"],
    products: [["Bulk Voice Calls", "/services/bulk-voice-call"], ["Cloud IVR", "/services/ivr"], ["Missed Call", "/services/missed-call"]],
  },
  {
    title: "Education",
    desc: "Student engagement and admissions",
    href: "/industries/education",
    icon: GraduationCap,
    uses: ["Admissions helplines with IVR", "A secure calling system for campuses", "Reminders for exams and fees"],
    products: [["Student Calling System", "/student-calling"], ["Cloud IVR", "/services/ivr"], ["Bulk Voice Calls", "/services/bulk-voice-call"]],
  },
];

export const RESOURCES = [
  { title: "About Cube", desc: "35+ years of computer telephony", href: "/about", icon: Info },
  { title: "Client voices", desc: "What our customers say", href: "/client-voices", icon: Quote },
  { title: "Meet our team", desc: "The people behind the platform", href: "/meet-our-team", icon: Users },
  { title: "Careers", desc: "Build telephony with us", href: "/career", icon: Briefcase },
  { title: "Blog", desc: "Guides on cloud telephony", href: "/blog", icon: Newspaper },
  { title: "FAQ", desc: "Answers to common questions", href: "/#faq", icon: LifeBuoy },
  { title: "Contact", desc: "Talk to sales or support", href: "/contact", icon: Mail },
];

export const CONTACT = {
  sales: "+91 80 68 69 44 40",
  expert: "+91 120 405 7109",
  email: "sales@cube-software.com",
};

export const tel = (number) => `tel:${number.replace(/\s/g, "")}`;

// Cities Cube works in, with their STD codes (footer and Resources menu).
export const CITIES = [
  { name: "Delhi", code: "11" },
  { name: "Mumbai", code: "22" },
  { name: "Bengaluru", code: "80" },
  { name: "Noida", code: "120" },
  { name: "Gurugram", code: "124" },
  { name: "Pune", code: "20" },
  { name: "Ahmedabad", code: "79" },
];
