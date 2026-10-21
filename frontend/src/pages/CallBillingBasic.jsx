import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, CheckCircle2, ChevronRight, ChevronLeft, Cloud, Smartphone, GitBranch, AudioLines,
  BarChart3, ShieldCheck, Globe, Gauge, Plug, Landmark, Activity, PhoneOutgoing,
  PhoneIncoming, ListChecks, LayoutDashboard, Database, Mic, FileAudio, Search,
  HardDrive, Lock, Bell, Users, PhoneCall, KanbanSquare, Workflow, Megaphone,
  Receipt, Percent, Building, AlertTriangle, FileSpreadsheet, MonitorPlay, Link2,
  CalendarClock, Voicemail, Mail, Forward, Clock, Languages, MessageSquare,
  Radio, UserCog, Disc, DatabaseZap, Layers, Sparkles, Eye, Hourglass,
  AtSign, Laptop, Briefcase, Phone, AppWindow, Headphones, BrainCircuit,
  Headset, Bot, MousePointerClick, History, LineChart, UserCheck, PhoneOff, Inbox
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";
import { Button } from "../components/ui/button";
import Navbar from "../components/Navbar";
import { Footer } from "../components/HomeSections2";
import OurProducts from "../components/OurProducts";

// =========================================================================
// CALL BILLING BASIC SPECIFIC DATA
// =========================================================================
const PAGE_DATA = {
  title: "Call Billing Software Basic",
  tagline: "Essential telecom resource & cost management for single-office operations and small teams.",
  heroVideo: "/billing-basic-image.png", 
  stats: [
    { value: "100%", label: "Call Visibility" },
    { value: "Automated", label: "Cost Reports" },
    { value: "Plug & Play", label: "Deployment" },
  ],
  overview: [
    "Our Basic Call Billing Software provides essential visibility into your telecom usage and costs. Designed specifically for single-office setups and small businesses, it eliminates blind spots in your monthly telecom expenses.",
    "Easily track incoming and outgoing calls, monitor extension-wise usage, and generate straightforward reports to understand exactly where your communication budget is being spent without complex configurations."
  ],
  features: [
    { icon: Phone, title: "Extension Tracking", description: "Monitor inbound and outbound call activity for every individual extension in your office." },
    { icon: Receipt, title: "Cost Calculation", description: "Apply basic tariff rates to instantly calculate the cost of every outgoing call." },
    { icon: FileSpreadsheet, title: "Standard Reports", description: "Generate daily, weekly, or monthly usage reports in PDF or CSV formats." },
    { icon: Search, title: "Call Detail Records (CDR)", description: "Searchable database of all call logs including time, duration, caller ID, and dialed numbers." },
    { icon: ShieldCheck, title: "Toll Fraud Detection", description: "Basic alerts for unusually long or expensive international calls." },
    { icon: HardDrive, title: "Local Archiving", description: "Securely store your call records locally for basic compliance and historical review." },
  ],
  benefits: [
    "Identify personal or unauthorized calls instantly",
    "Allocate basic telecom costs to specific extensions",
    "Deploy quickly with minimal IT infrastructure required",
    "Reduce overall phone bills by creating usage awareness",
    "Easy-to-use interface designed for non-technical staff",
    "Compatible with most standard office PBX systems"
  ],
  useCases: ["Small Businesses", "Single-location Offices", "Boutique Hotels", "Local Clinics"],
  faqs: [
    { q: "Do I need complex hardware for this?", a: "No, the Basic version is designed to connect directly to your existing compatible PBX with minimal setup." },
    { q: "Can I export the billing reports?", a: "Yes, all standard reports can be easily exported to PDF or CSV for your accounting software." },
    { q: "Does it track internal calls?", a: "Yes, it tracks all extension-to-extension calls as well as external inbound and outbound traffic." },
    { q: "Can we upgrade later?", a: "Absolutely. You can seamlessly upgrade your license to Standard or Enterprise as your business grows without losing historical data." },
  ],
};

const ENTERPRISE_FEATURES = [
  { icon: ShieldCheck, title: "Secure Access", description: "Password-protected admin dashboard ensures only authorized personnel can view call costs." },
  { icon: BarChart3, title: "Clear Dashboards", description: "Visual graphs showing peak call times and highest-cost extensions at a glance." },
  { icon: Clock, title: "Automated Logging", description: "Runs quietly in the background, automatically pulling CDR data without manual intervention." },
  { icon: PhoneIncoming, title: "Trunk Utilization", description: "Basic views to show if you have too many or too few phone lines for your traffic." },
];

const MODULES_DATA = [
  {
    id: "tracking",
    iconColor: "text-blue-600",
    icon: Phone,
    title: "Call Tracking & Logging",
    items: [
      { text: "Real-time capture of CDR (Call Detail Records)", icon: Database },
      { text: "Extension, trunk, and dialed number logging", icon: ListChecks },
      { text: "Call duration and timestamp tracking", icon: Clock },
      { text: "Unanswered and abandoned call basic logs", icon: PhoneOff },
    ]
  },
  {
    id: "costing",
    iconColor: "text-emerald-500",
    icon: Landmark,
    title: "Cost Management",
    items: [
      { text: "Standard local and long-distance tariff tables", icon: Percent },
      { text: "Extension-wise cost accumulation", icon: Users },
      { text: "Top expensive calls summary", icon: AlertTriangle },
      { text: "Basic currency and tax configurations", icon: Receipt },
    ]
  },
  {
    id: "reporting",
    iconColor: "text-amber-500",
    icon: FileSpreadsheet,
    title: "Reporting & Export",
    items: [
      { text: "Pre-built standard summary reports", icon: BarChart3 },
      { text: "Date-range filtering for specific billing cycles", icon: CalendarClock },
      { text: "One-click CSV and PDF exports", icon: HardDrive },
      { text: "Basic print-ready formatting", icon: FileText },
    ]
  }
];

const FEATURE_IMAGES = [
  "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=600&q=80", 
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80", 
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80", 
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80", 
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80", 
  "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80", 
];

const FileText = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>;

const ContactCenterModules = () => {
  return (
    <section className="py-24 bg-[#FAFAFA] border-t border-slate-200">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-8 items-start">
          <div className="lg:w-[35%] lg:sticky lg:top-32 shrink-0 z-10">
            <h2 className="font-heading font-black text-4xl sm:text-5xl text-slate-900 leading-[1.15] tracking-tight">
              Essential Billing Modules
            </h2>
          </div>
          <div className="lg:w-[65%] flex items-stretch overflow-x-auto gap-6 pb-12 pt-4 px-4 -mx-4 lg:px-4 lg:-mx-4 snap-x snap-mandatory [scrollbar-width:thin] [scrollbar-color:#cbd5e1_transparent] [&::-webkit-scrollbar]:h-2.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full">
            {MODULES_DATA.map((module) => (
              <div key={module.id} className="min-w-[320px] max-w-[320px] md:min-w-[400px] md:max-w-[400px] shrink-0 snap-center bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-slate-100 flex flex-col hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] transition-shadow duration-300">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-slate-50 ${module.iconColor}`}>
                  <module.icon strokeWidth={2} size={28} />
                </div>
                <h3 className="font-heading font-bold text-[22px] text-slate-900 mb-8 leading-snug">{module.title}</h3>
                <ul className="flex flex-col gap-5 flex-grow">
                  {module.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className={`mt-0.5 shrink-0 ${module.iconColor}`}><item.icon size={18} strokeWidth={2.5} /></div>
                      <span className="text-[15px] text-slate-600 font-medium leading-relaxed">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="min-w-[20px] shrink-0"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default function CallBillingBasic() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setCardsToShow(1);
      else if (window.innerWidth < 1024) setCardsToShow(2);
      else setCardsToShow(3);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const maxSlide = Math.max(0, PAGE_DATA.features.length - cardsToShow);
  const prevSlide = () => setCurrentSlide((p) => Math.max(p - 1, 0));
  const nextSlide = () => setCurrentSlide((p) => Math.min(p + 1, maxSlide));

  return (
    <div className="bg-white text-slate-900 flex flex-col min-h-screen">
      <Navbar />

      <section className="relative w-full min-h-[100dvh] flex flex-col overflow-hidden bg-[#0A1F44]">
        <img src={PAGE_DATA.heroVideo} alt={`${PAGE_DATA.title} Background`} className="absolute inset-0 w-full h-full object-cover object-center z-0 opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A1F44]/90 via-[#0A1F44]/2 to-transparent z-10 pointer-events-none" />
        <div className="w-full h-24 lg:h-32 shrink-0 pointer-events-none z-10"></div>
        
        <div className="relative z-20 flex-grow flex flex-col justify-center w-full max-w-7xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
          <nav className="flex items-center gap-1.5 text-xs text-blue-200 mb-6">
            <Link className="hover:text-white transition-colors" to="/">Home</Link><ChevronRight size={13} /><span className="text-blue-300">Products</span><ChevronRight size={13} /><span className="text-white font-semibold">{PAGE_DATA.title}</span>
          </nav>
          <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight max-w-4xl leading-[1.05] animate-fade-up">{PAGE_DATA.title}</h1>
          <p className="mt-5 text-lg text-blue-100 max-w-2xl leading-relaxed text-justify animate-fade-up">{PAGE_DATA.tagline}</p>
          <div className="mt-8 flex flex-wrap gap-4 animate-fade-up">
            <Link to="/#contact"><Button className="bg-blue-600 hover:bg-blue-500 text-white px-8 h-12 rounded-md shadow-lg transition-transform hover:-translate-y-0.5" size="lg">Book Demo</Button></Link>
            <Link to="/#contact"><Button className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white px-8 h-12 rounded-md group" size="lg" variant="outline">Talk to Sales<ArrowRight className="ml-1 transition-transform group-hover:translate-x-1" size={16} /></Button></Link>
          </div>
        </div>

        <div className="relative z-30 w-full shrink-0 border-t border-white/10 bg-[#0A1F44]/40 backdrop-blur-md py-6 mt-auto">
          <div className="max-w-[1400px] mx-auto grid grid-cols-3 divide-x divide-white/10">
            {PAGE_DATA.stats.map((s) => (
              <div key={s.label} className="text-center px-2 sm:px-4">
                <div className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-white mb-1 md:mb-2 drop-shadow-md">{s.value}</div>
                <div className="font-bold tracking-[0.1em] sm:tracking-[0.15em] uppercase text-blue-200/80 text-[10px] sm:text-xs md:text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white overflow-hidden border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-16 lg:gap-20 xl:gap-28 items-center">
          <div className="relative z-10 order-1 lg:order-2 lg:pl-8 xl:pl-12">
            <div className="text-blue-700 text-xs font-bold tracking-[0.2em] uppercase mb-4">— Overview</div>
            <h2 className="font-heading font-bold text-3xl sm:text-3xl text-slate-900 leading-snug mb-5">The Engine Behind <span className="text-blue-600">{PAGE_DATA.title}</span></h2>
            <div className="space-y-4">{PAGE_DATA.overview.map((p, i) => (<p key={i} className="text-slate-600 leading-relaxed text-justify">{p}</p>))}</div>
            <div className="mt-10"><Link to="/#contact"><Button className="bg-[#0A1F44] hover:bg-blue-700 text-white px-8 h-14 text-base rounded-md shadow-lg transition-transform hover:-translate-y-1" size="lg">Book A Demo</Button></Link></div>
          </div>
          <div className="relative h-[600px] sm:h-[700px] flex items-center justify-center order-2 lg:order-1 w-full mt-10 lg:mt-0">
             <div className="relative w-full h-full flex items-center justify-center rounded-3xl overflow-hidden shadow-2xl">
                 <img src={FEATURE_IMAGES[0]} alt="Overview" className="w-full h-full object-cover" />
             </div>
          </div>
        </div>
      </section>

      <ContactCenterModules />

      <section className="pt-24 pb-12 bg-[#FAFAFA] overflow-hidden relative">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6, ease: "easeOut" }} className="mb-16 text-center">
            <h2 className="font-heading font-black text-4xl sm:text-5xl tracking-tight text-slate-900 leading-tight">Everything {PAGE_DATA.title} gives you</h2>
          </motion.div>
          <div className="relative w-full">
            <button onClick={prevSlide} disabled={currentSlide === 0} className={`absolute -left-2 sm:-left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${currentSlide === 0 ? "bg-white text-slate-300 shadow-sm cursor-not-allowed opacity-50" : "bg-blue-50 text-[#1f638b] hover:bg-[#1f638b] hover:text-white shadow-lg cursor-pointer"}`}><ChevronLeft size={26} strokeWidth={2.5} /></button>
            <button onClick={nextSlide} disabled={currentSlide === maxSlide} className={`absolute -right-2 sm:-right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${currentSlide === maxSlide ? "bg-white text-slate-300 shadow-sm cursor-not-allowed opacity-50" : "bg-blue-50 text-[#1f638b] hover:bg-[#1f638b] hover:text-white shadow-lg cursor-pointer"}`}><ChevronRight size={26} strokeWidth={2.5} /></button>
            <div className="overflow-hidden px-2 py-6 mx-8 sm:mx-10">
              <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${currentSlide * (100 / cardsToShow)}%)` }}>
                {PAGE_DATA.features.map((f, i) => (
                  <div key={f.title} className="shrink-0 px-3 transition-all duration-500" style={{ width: `${100 / cardsToShow}%` }}>
                    <div className="bg-white rounded-[32px] p-5 border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] hover:-translate-y-3 transition-all duration-500 flex flex-col h-full group">
                      <div className="w-full h-48 overflow-hidden rounded-[20px] mb-5"><img src={FEATURE_IMAGES[i % FEATURE_IMAGES.length]} alt={f.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" /></div>
                      <div className="flex flex-col flex-grow items-center text-center px-2">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-3"><f.icon size={18} /></div>
                        <h3 className="font-heading font-bold text-xl text-slate-900 mb-2 group-hover:text-[#1f638b] transition-colors">{f.title}</h3>
                        <p className="text-[14px] text-slate-500 leading-relaxed mb-4">{f.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-24 pt-12 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-blue-700 text-xs font-bold tracking-[0.2em] uppercase mb-3">— Key Features</div>
          <h2 className="font-heading font-black text-3xl sm:text-4xl tracking-tight text-slate-900 leading-tight max-w-3xl">Empowering managed communications with reliability and security.</h2>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ENTERPRISE_FEATURES.map((f, i) => {
              const accent = ["blue", "red", "amber", "blue"][i % 4];
              const accents = { blue: "bg-blue-50 text-blue-700 group-hover:bg-blue-700", red: "bg-red-50 text-red-600 group-hover:bg-red-600", amber: "bg-amber-50 text-amber-500 group-hover:bg-amber-500" };
              return (
                <div key={f.title} className="group bg-white rounded-2xl border border-slate-100 p-8 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-colors duration-300 group-hover:text-white ${accents[accent]}`}><f.icon size={22} /></div>
                  <h3 className="font-heading font-bold text-lg text-slate-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed text-justify">{f.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-14">
          <div>
            <div className="text-blue-700 text-xs font-bold tracking-[0.2em] uppercase mb-3">— Business Benefits</div>
            <h2 className="font-heading font-black text-3xl tracking-tight text-slate-900 leading-tight">Why institutions choose it</h2>
            <ul className="mt-8 space-y-4">
              {PAGE_DATA.benefits.map((b) => (
                <li key={b} className="flex items-start gap-3 text-slate-700 text-justify">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5"><CheckCircle2 size={14} /></span>{b}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-blue-700 text-xs font-bold tracking-[0.2em] uppercase mb-3">— Use Cases</div>
            <h2 className="font-heading font-black text-3xl tracking-tight text-slate-900 leading-tight">Perfect for</h2>
            <div className="mt-8 grid sm:grid-cols-2 gap-4">
              {PAGE_DATA.useCases.map((u, i) => (
                <div key={u} className="rounded-xl border border-slate-200 bg-white p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                  <div className="font-heading font-black text-2xl text-blue-200">{String(i + 1).padStart(2, "0")}</div>
                  <div className="mt-2 font-semibold text-slate-800 text-sm text-justify">{u}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="text-blue-700 text-xs font-bold tracking-[0.2em] uppercase mb-4">— FAQ</div>
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-slate-900">Common Questions</h2>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {PAGE_DATA.faqs.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="bg-slate-50 rounded-xl border border-slate-100 mb-3 px-6 shadow-sm data-[state=open]:shadow-md transition-shadow">
                <AccordionTrigger className="text-left font-heading font-bold text-slate-900 hover:text-blue-700 hover:no-underline py-5">{f.q}</AccordionTrigger>
                <AccordionContent className="text-slate-600 leading-relaxed pb-5">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="py-16 bg-[#0A1F44]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div>
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight">Ready to deploy {PAGE_DATA.title}?</h2>
            <p className="mt-3 text-blue-200 max-w-xl text-justify">Talk to our telephony experts and get a tailored demo within 24 hours.</p>
          </div>
          <Link className="shrink-0" to="/#contact"><Button className="bg-blue-600 hover:bg-blue-500 text-white px-9 h-12 rounded-md shadow-lg transition-transform hover:-translate-y-0.5" size="lg">Book a Free Demo <ArrowRight className="ml-1.5" size={16} /></Button></Link>
        </div>
      </section>
      <OurProducts />
      <Footer/>
    </div>
  );
}