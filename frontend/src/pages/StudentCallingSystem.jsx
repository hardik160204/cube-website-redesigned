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
// STUDENT CALLING SYSTEM SPECIFIC DATA
// =========================================================================
const PAGE_DATA = {
  title: "Student & Hostel Calling System",
  tagline: "Managed campus communications with whitelisted directories, prepaid wallets, and automated schedule restrictions for educational institutions.",
  heroVideo: "/student-calling-image.png", 
  stats: [
    { value: "24/7", label: "Parent Access" },
    { value: "Prepaid", label: "Student Wallets" },
    { value: "Managed", label: "Time Schedules" },
  ],
  overview: [
    "Our Student Calling System provides boarding schools, university hostels, and educational campuses with a secure, managed infrastructure for student communications. It ensures students stay connected with their families while adhering to campus discipline.",
    "Administrators can easily enforce study-hour lockouts, restrict outgoing calls to parent-approved numbers, and allow families to seamlessly top up prepaid student calling accounts."
  ],
  features: [
    { icon: ListChecks, title: "Parent-Approved Directories", description: "Students can only dial whitelisted numbers approved by parents or guardians." },
    { icon: Clock, title: "Study-Hour Lockouts", description: "Automatically disable calling during classes, study hours, or late at night." },
    { icon: Landmark, title: "Prepaid Wallets", description: "Parents can easily recharge their child's calling account via a secure web portal." },
    { icon: PhoneIncoming, title: "Emergency Routing", description: "Always-on emergency numbers and direct lines to campus wardens." },
    { icon: BarChart3, title: "Usage Tracking", description: "Detailed logs allow administrators and parents to monitor call frequency and durations." },
    { icon: Users, title: "Multi-Hostel Management", description: "Manage thousands of students across different campus buildings from one dashboard." },
  ],
  benefits: [
    "Maintain campus discipline with automated time restrictions",
    "Give parents peace of mind with restricted dialing",
    "Eliminate manual phone billing with self-serve prepaid wallets",
    "Deploy ruggedized, tamper-proof SIP phones in common areas",
    "Ensure students always have access to emergency campus lines",
    "Scale effortlessly from 50 to 5,000+ students"
  ],
  useCases: ["Boarding Schools", "University Hostels", "Training Academies", "Seminaries"],
  faqs: [
    { q: "How do students make calls?", a: "Students enter their unique PIN on campus phones, which authenticates their account, checks their wallet balance, and allows them to dial their approved numbers." },
    { q: "Can parents restrict who the student calls?", a: "Yes. The system utilizes a strict whitelist. Students can only dial numbers that have been explicitly pre-approved by their parents or the administration." },
    { q: "What happens during class hours?", a: "Administrators can set global or hostel-specific schedules. During class or sleep hours, the phones will automatically block outbound calls (except for emergencies)." },
    { q: "How are funds added to the account?", a: "Parents get access to a secure online payment portal where they can instantly top up their child's calling wallet using standard payment methods." },
  ],
};

const ENTERPRISE_FEATURES = [
  { icon: ShieldCheck, title: "Safe Communications", description: "Protect students from unwanted external calls and restrict outbound dialing to safe, verified family numbers." },
  { icon: Globe, title: "Parent Portal", description: "A dedicated web interface for parents to manage funds, update whitelisted numbers, and view call history." },
  { icon: Building, title: "Campus-Wide Scalability", description: "Centralized management for multiple hostel blocks, campuses, and hundreds of endpoints." },
  { icon: Radio, title: "Campus Intercom", description: "Double as a PA system to broadcast announcements to all hostel phones simultaneously." },
];

const MODULES_DATA = [
  {
    id: "management",
    iconColor: "text-blue-600",
    icon: Users,
    title: "Student & Directory Management",
    items: [
      { text: "Unique PIN authentication for every student", icon: Lock },
      { text: "Parent-managed whitelisted contact directories", icon: ListChecks },
      { text: "Bulk import for student onboarding and graduations", icon: Database },
      { text: "Always-allow emergency and warden routing", icon: AlertTriangle },
    ]
  },
  {
    id: "controls",
    iconColor: "text-amber-500",
    icon: Clock,
    title: "Schedules & Access Control",
    items: [
      { text: "Automated curfew and study-hour lockouts", icon: CalendarClock },
      { text: "Maximum call duration limits per session", icon: Hourglass }, 
      { text: "Hostel-specific or grade-specific policy rules", icon: Building },
      { text: "Instant system-wide lockdown capabilities", icon: ShieldCheck },
    ]
  },
  {
    id: "billing",
    iconColor: "text-emerald-500",
    icon: Landmark,
    title: "Prepaid Wallet System",
    items: [
      { text: "Self-serve parent recharge portal", icon: Globe },
      { text: "Automated low-balance notifications", icon: Bell },
      { text: "Per-minute billing based on domestic/international rates", icon: Percent },
      { text: "Transparent digital receipts and usage ledgers", icon: Receipt },
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

const ContactCenterModules = () => {
  return (
    <section className="py-24 bg-[#FAFAFA] border-t border-slate-200">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-8 items-start">
          
          <div className="lg:w-[35%] lg:sticky lg:top-32 shrink-0 z-10">
            <h2 className="font-heading font-black text-4xl sm:text-5xl text-slate-900 leading-[1.15] tracking-tight">
              Management Modules for Secure Communications
            </h2>
          </div>

          <div className="lg:w-[65%] flex items-stretch overflow-x-auto gap-6 pb-12 pt-4 px-4 -mx-4 lg:px-4 lg:-mx-4 snap-x snap-mandatory [scrollbar-width:thin] [scrollbar-color:#cbd5e1_transparent] [&::-webkit-scrollbar]:h-2.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full">
            {MODULES_DATA.map((module) => (
              <div 
                key={module.id} 
                className="min-w-[320px] max-w-[320px] md:min-w-[400px] md:max-w-[400px] shrink-0 snap-center bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-slate-100 flex flex-col hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] transition-shadow duration-300"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-slate-50 ${module.iconColor}`}>
                  <module.icon strokeWidth={2} size={28} />
                </div>
                
                <h3 className="font-heading font-bold text-[22px] text-slate-900 mb-8 leading-snug">
                  {module.title}
                </h3>
                
                <ul className="flex flex-col gap-5 flex-grow">
                  {module.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className={`mt-0.5 shrink-0 ${module.iconColor}`}>
                        <item.icon size={18} strokeWidth={2.5} />
                      </div>
                      <span className="text-[15px] text-slate-600 font-medium leading-relaxed">
                        {item.text}
                      </span>
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


export default function StudentCallingSystem() {
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const totalFeatures = PAGE_DATA.features.length;
  const maxSlide = Math.max(0, totalFeatures - cardsToShow);

  if (currentSlide > maxSlide) setCurrentSlide(maxSlide);
  const prevSlide = () => setCurrentSlide((p) => Math.max(p - 1, 0));
  const nextSlide = () => setCurrentSlide((p) => Math.min(p + 1, maxSlide));

  const networkNodes = [
    { id: 'satellite', Icon: Radio, x: -280, y: -160, path: "M -80 -60 L -140 -60 L -280 -160", dashed: false },
    { id: 'browser', Icon: AppWindow, x: -140, y: -240, path: "M -80 -60 L -140 -240", dashed: false },
    { id: 'email', Icon: AtSign, x: 0, y: -290, path: "M 0 -80 L 0 -290", dashed: false },
    { id: 'laptop', Icon: Laptop, x: 140, y: -240, path: "M 80 -60 L 140 -240", dashed: false },
    { id: 'users', Icon: Users, x: 280, y: -140, path: "M 100 -60 L 140 -100 L 280 -140", dashed: true },
    { id: 'phoneOut', Icon: PhoneOutgoing, x: 300, y: 20, path: "M 100 -20 L 300 20", dashed: true },
    { id: 'lockRight', Icon: Lock, x: 200, y: 160, path: "M 80 60 L 200 160", dashed: true },
    { id: 'phoneRecRight', Icon: Phone, x: 340, y: 160, path: "M 200 160 L 340 160", dashed: true }, 
    { id: 'briefcase', Icon: Briefcase, x: 240, y: 280, path: "M 100 160 L 140 280 L 240 280", dashed: false },
    { id: 'lockBottomLeft', Icon: Lock, x: -100, y: 310, path: "M -100 160 L -100 310", dashed: true },
    { id: 'globe', Icon: Globe, x: -180, y: 200, path: "M -80 60 L -180 200", dashed: false },
    { id: 'lockFarLeft', Icon: Lock, x: -300, y: 260, path: "M -180 200 L -300 260", dashed: true }, 
    { id: 'phoneIn', Icon: PhoneIncoming, x: -320, y: -20, path: "M -100 0 L -320 -20", dashed: false },
    { id: 'lockMidLeft', Icon: Lock, x: -280, y: 100, path: "M -100 30 L -280 100", dashed: false },
  ];

  return (
    <div className="bg-white text-slate-900 flex flex-col min-h-screen">
      <Navbar />

      <section className="relative w-full min-h-[100dvh] flex flex-col overflow-hidden bg-[#0A1F44]">
        
        <img
          src={PAGE_DATA.heroVideo}
          alt={`${PAGE_DATA.title} Background`}
          className="absolute inset-0 w-full h-full object-cover object-center z-0 opacity-80"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#0A1F44]/90 via-[#0A1F44]/2 to-transparent z-10 pointer-events-none" />
        
        <div className="w-full h-24 lg:h-32 shrink-0 pointer-events-none z-10"></div>
        
        <div className="relative z-20 flex-grow flex flex-col justify-center w-full max-w-7xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
          <nav className="flex items-center gap-1.5 text-xs text-blue-200 mb-6">
            <Link className="hover:text-white transition-colors" to="/">Home</Link>
            <ChevronRight size={13} />
            <span className="text-blue-300">Products</span>
            <ChevronRight size={13} />
            <span className="text-white font-semibold">{PAGE_DATA.title}</span>
          </nav>
          
          <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight max-w-4xl leading-[1.05] animate-fade-up">
            {PAGE_DATA.title}
          </h1>
          <p className="mt-5 text-lg text-blue-100 max-w-2xl leading-relaxed text-justify animate-fade-up">
            {PAGE_DATA.tagline}
          </p>
          
          <div className="mt-8 flex flex-wrap gap-4 animate-fade-up">
            <Link to="/#contact">
              <Button className="bg-blue-600 hover:bg-blue-500 text-white px-8 h-12 rounded-md shadow-lg transition-transform hover:-translate-y-0.5" size="lg">
                Book Demo
              </Button>
            </Link>
            <Link to="/#contact">
              <Button className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white px-8 h-12 rounded-md group" size="lg" variant="outline">
                Talk to Sales
                <ArrowRight className="ml-1 transition-transform group-hover:translate-x-1" size={16} />
              </Button>
            </Link>
          </div>
        </div>

        <div className="relative z-30 w-full shrink-0 border-t border-white/10 bg-[#0A1F44]/40 backdrop-blur-md py-6 mt-auto">
          <div className="max-w-[1400px] mx-auto grid grid-cols-3 divide-x divide-white/10">
            {PAGE_DATA.stats.map((s) => (
              <div key={s.label} className="text-center px-2 sm:px-4">
                <div className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-white mb-1 md:mb-2 drop-shadow-md">
                  {s.value}
                </div>
                <div className="font-bold tracking-[0.1em] sm:tracking-[0.15em] uppercase text-blue-200/80 text-[10px] sm:text-xs md:text-sm">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>

      <section className="py-24 bg-white overflow-hidden border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-16 lg:gap-20 xl:gap-28 items-center">
          <div className="relative z-10 order-1 lg:order-2 lg:pl-8 xl:pl-12">
            <div className="text-blue-700 text-xs font-bold tracking-[0.2em] uppercase mb-4">— Overview</div>
            <h2 className="font-heading font-bold text-3xl sm:text-3xl text-slate-900 leading-snug mb-5">
              The Engine Behind <span className="text-blue-600">{PAGE_DATA.title}</span>
            </h2>
            <div className="space-y-4">
              {PAGE_DATA.overview.map((p, i) => (
                <p key={i} className="text-slate-600 leading-relaxed text-justify">
                  {p}
                </p>
              ))}
            </div>
            <div className="mt-10">
              <Link to="/#contact">
                <Button className="bg-[#0A1F44] hover:bg-blue-700 text-white px-8 h-14 text-base rounded-md shadow-lg transition-transform hover:-translate-y-1" size="lg">
                  Book A Demo
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative h-[600px] sm:h-[700px] flex items-center justify-center order-2 lg:order-1 w-full mt-10 lg:mt-0">
            <div className="relative flex items-center justify-center scale-[0.45] sm:scale-75 lg:scale-85 xl:scale-95 w-full h-full">
              <div className="absolute z-0 pointer-events-none mt-16">
                <svg width="450" height="300" viewBox="0 0 450 300" className="overflow-visible">
                  <motion.path 
                    d="M 120 180 Q 50 180 50 120 Q 50 60 110 50 Q 130 -10 225 -10 Q 320 -10 340 50 Q 400 60 400 120 Q 400 180 330 180 L 120 180 Z" 
                    fill="none" 
                    stroke="#2563eb" 
                    strokeWidth="14" 
                    strokeLinejoin="round"
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.g 
                    stroke="#2563eb" 
                    strokeWidth="12" 
                    fill="#2563eb"
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <path d="M 160 180 L 160 220 L 125 220" fill="none" />
                    <circle cx="125" cy="220" r="24" />
                    <path d="M 225 180 L 225 260" fill="none" />
                    <circle cx="225" cy="260" r="24" />
                    <path d="M 290 180 L 290 220 L 325 220" fill="none" />
                    <circle cx="325" cy="220" r="24" />
                  </motion.g>
                </svg>
              </div>

              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <svg className="absolute w-[1000px] h-[1000px] overflow-visible" viewBox="-500 -500 1000 1000">
                  {networkNodes.map((node, i) => (
                    <g key={`line-group-${i}`}>
                      <path 
                        d={node.path}
                        fill="none"
                        stroke="#93c5fd" 
                        strokeWidth="2"
                        strokeDasharray={node.dashed ? "6 6" : "none"}
                        opacity="0.4"
                      />
                      <motion.path 
                        d={node.path}
                        fill="none"
                        stroke="#3b82f6" 
                        strokeWidth="5" 
                        initial={{ opacity: 0.1 }}
                        animate={{ opacity: [0.1, 0.7, 0.1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }}
                      />
                    </g>
                  ))}
                </svg>
              </div>

              <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                <div className="relative w-[380px] h-[480px] mt-16 ml-[60px] pointer-events-auto">
                  <motion.div
                    animate={{ y: [-5, 5, -5] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="w-full h-full flex items-end justify-center"
                  >
                    <img 
                      src="/transparent-person.png" 
                      alt="System User" 
                      className="max-w-full max-h-full object-contain drop-shadow-2xl"
                    />
                  </motion.div>
                </div>
              </div>

              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                {networkNodes.map((node, i) => (
                  <motion.div
                    key={`icon-${i}`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1, x: node.x, y: node.y }}
                    transition={{ duration: 0.6, delay: i * 0.1, type: "spring", bounce: 0.4 }}
                    className="absolute"
                  >
                    <motion.div
                      animate={{ y: [-8, 8, -8] }}
                      transition={{ duration: 3 + (i * 0.3), repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
                      className="w-[72px] h-[72px] rounded-full bg-white shadow-xl border-[2px] border-blue-500 flex items-center justify-center relative group"
                    >
                      <node.Icon className="w-8 h-8 text-[#0A1F44]" strokeWidth={1.5} />
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <ContactCenterModules />

      <section className="pt-24 pb-12 bg-[#FAFAFA] overflow-hidden relative">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-16 text-center"
          >
            <h2 className="font-heading font-black text-4xl sm:text-5xl tracking-tight text-slate-900 leading-tight">
              Everything {PAGE_DATA.title} gives you
            </h2>
          </motion.div>

          <div className="relative w-full">
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className={`absolute -left-2 sm:-left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                currentSlide === 0 ? "bg-white text-slate-300 shadow-sm cursor-not-allowed opacity-50" : "bg-blue-50 text-[#1f638b] hover:bg-[#1f638b] hover:text-white shadow-lg cursor-pointer"
              }`}
            >
              <ChevronLeft size={26} strokeWidth={2.5} />
            </button>
            <button
              onClick={nextSlide}
              disabled={currentSlide === maxSlide}
              className={`absolute -right-2 sm:-right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                currentSlide === maxSlide ? "bg-white text-slate-300 shadow-sm cursor-not-allowed opacity-50" : "bg-blue-50 text-[#1f638b] hover:bg-[#1f638b] hover:text-white shadow-lg cursor-pointer"
              }`}
            >
              <ChevronRight size={26} strokeWidth={2.5} />
            </button>

            <div className="overflow-hidden px-2 py-6 mx-8 sm:mx-10">
              <div 
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * (100 / cardsToShow)}%)` }}
              >
                {PAGE_DATA.features.map((f, i) => {
                  const imageUrl = FEATURE_IMAGES[i % FEATURE_IMAGES.length];
                  return (
                    <div key={f.title} className="shrink-0 px-3 transition-all duration-500" style={{ width: `${100 / cardsToShow}%` }}>
                      <div className="bg-white rounded-[32px] p-5 border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] hover:-translate-y-3 transition-all duration-500 flex flex-col h-full group">
                        <div className="w-full h-48 overflow-hidden rounded-[20px] mb-5">
                          <img src={imageUrl} alt={f.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        </div>
                        <div className="flex flex-col flex-grow items-center text-center px-2">
                          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-3">
                            <f.icon size={18} />
                          </div>
                          <h3 className="font-heading font-bold text-xl text-slate-900 mb-2 group-hover:text-[#1f638b] transition-colors">{f.title}</h3>
                          <p className="text-[14px] text-slate-500 leading-relaxed mb-4">{f.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-24 pt-12 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-blue-700 text-xs font-bold tracking-[0.2em] uppercase mb-3">— Key Features</div>
          <h2 className="font-heading font-black text-3xl sm:text-4xl tracking-tight text-slate-900 leading-tight max-w-3xl">
            Empowering managed communications with reliability and security.
          </h2>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ENTERPRISE_FEATURES.map((f, i) => {
              const accent = ["blue", "red", "amber", "blue"][i % 4];
              const accents = {
                blue: "bg-blue-50 text-blue-700 group-hover:bg-blue-700",
                red: "bg-red-50 text-red-600 group-hover:bg-red-600",
                amber: "bg-amber-50 text-amber-500 group-hover:bg-amber-500",
              };
              return (
                <div key={f.title} className="group bg-white rounded-2xl border border-slate-100 p-8 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-colors duration-300 group-hover:text-white ${accents[accent]}`}>
                    <f.icon size={22} />
                  </div>
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
            <h2 className="font-heading font-black text-3xl tracking-tight text-slate-900 leading-tight">
              Why institutions choose it
            </h2>
            <ul className="mt-8 space-y-4">
              {PAGE_DATA.benefits.map((b) => (
                <li key={b} className="flex items-start gap-3 text-slate-700 text-justify">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 size={14} />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-blue-700 text-xs font-bold tracking-[0.2em] uppercase mb-3">— Use Cases</div>
            <h2 className="font-heading font-black text-3xl tracking-tight text-slate-900 leading-tight">
              Perfect for
            </h2>
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

      {/* --- FAQ SECTION --- */}
      <section className="py-24 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="text-blue-700 text-xs font-bold tracking-[0.2em] uppercase mb-4">— FAQ</div>
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-slate-900">Common Questions</h2>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {PAGE_DATA.faqs.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="bg-slate-50 rounded-xl border border-slate-100 mb-3 px-6 shadow-sm data-[state=open]:shadow-md transition-shadow">
                <AccordionTrigger className="text-left font-heading font-bold text-slate-900 hover:text-blue-700 hover:no-underline py-5">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 leading-relaxed pb-5">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="py-16 bg-[#0A1F44]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div>
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight">
              Ready to deploy {PAGE_DATA.title}?
            </h2>
            <p className="mt-3 text-blue-200 max-w-xl text-justify">
              Talk to our telephony experts and get a tailored demo for your campus within 24 hours.
            </p>
          </div>
          <Link className="shrink-0" to="/#contact">
            <Button className="bg-blue-600 hover:bg-blue-500 text-white px-9 h-12 rounded-md shadow-lg transition-transform hover:-translate-y-0.5" size="lg">
              Book a Free Demo <ArrowRight className="ml-1.5" size={16} />
            </Button>
          </Link>
        </div>
      </section>

      <OurProducts />
      <Footer/>
    </div>
  );
}