import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Phone, ChevronDown, Menu, X, LogIn, ArrowRight, CheckCircle2, 
  Bot, PhoneCall, Building, MessageSquare, Headset, BrainCircuit, 
  ShieldCheck, AudioLines, PhoneOutgoing, Radio, Headphones, 
  LayoutDashboard, Landmark, Activity, Megaphone, MonitorPlay,
  Mic, Database, Receipt, Cloud, HeartPulse, TowerControl,
  Plane, Target, Heart, Flag, GraduationCap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";

// --- NAVIGATION DATA ---
const MENU_ITEMS = [
  { label: "Home", href: "#home" },
  {
    label: "Services", // <-- TRIGGERS SERVICES MEGA MENU
    children: [], 
  },
  {
    label: "Products", // <-- TRIGGERS PRODUCTS MEGA MENU
    children: [],
  },
  { label: "About", href: "/about" },
  { label: "Pricing", href: "/pricing" },
  { label: "Industries", href: "#industries" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact Us", href: "/contact" },
];

// =========================================================================
// MEGA MENU DATA: SERVICES
// =========================================================================
const SERVICES_MEGA_DATA = [
  {
    id: "calling-solutions",
    label: "Cloud Services",
    icon: PhoneCall,
    items: [
      { icon: Cloud, title: "Cloud Contact Center", desc: "Complete omnichannel contact center", href: "/services/cloud-contact-center" },
      { icon: PhoneOutgoing, title: "Auto Dialer", desc: "Predictive, Progressive & Preview dialing engine", href: "/services/auto-dialer" },
      { icon: Radio, title: "IVRS Services", desc: "Custom IVR solutions built from scratch", href: "/services/ivrs" },
      { icon: Headphones, title: "Conference Bridge", desc: "Full-featured secure audio conferencing", href: "/services/conference-bridge" }
    ]
  },
{
    id: "industry-solutions",
    label: "Industry Solutions",
    icon: Building,
    items: [
      { icon: Headset, title: "BPO – KPO", desc: "High-volume dialing & monitoring", href: "/industries/bpo" },
      { icon: Landmark, title: "Financial Services", desc: "Compliant recording & secure calling", href: "/industries/finance" },
      { icon: HeartPulse, title: "Healthcare", desc: "Patient-first communication suites", href: "/industries/healthcare" },
      { icon: Building, title: "Real Estate", desc: "Lead follow-up and site visit scheduling", href: "/industries/real-estate" },
      { icon: TowerControl, title: "Telecom", desc: "Carrier-grade telecom solutions", href: "/industries/telecom" },
      { icon: Plane, title: "Travel & Tourism", desc: "Peak season booking support", href: "/industries/travel" },
      { icon: Target, title: "Advertising", desc: "Campaign tracking & lead generation", href: "/industries/advertising" },
      { icon: Heart, title: "NGOs", desc: "Awareness & mass fundraising", href: "/industries/ngo" },
      { icon: Flag, title: "Election Campaigns", desc: "Voter outreach & surveys", href: "/industries/election" },
      { icon: GraduationCap, title: "Education", desc: "Student engagement & admissions", href: "/industries/education" },
    ]
  },
  {
    id: "whatsapp-solution",
    label: "WhatsApp Solution",
    icon: MessageSquare,
    items: [
      { icon: MessageSquare, title: "WhatsApp API", desc: "Official WhatsApp Business API integration", href: "/#contact" },
      { icon: Bot, title: "WhatsApp Chatbot", desc: "Automate customer support on WhatsApp", href: "/#contact" },
      { icon: Megaphone, title: "Broadcast Messaging", desc: "Send promotional messages at scale", href: "/#contact" },
    ]
  }
];

// =========================================================================
// MEGA MENU DATA: PRODUCTS
// =========================================================================
const PRODUCTS_MEGA_DATA = [
  {
    id: "voice",
    label: "Voice",
    icon: PhoneCall,
    items: [
      { icon: Cloud, title: "Contact Center Solution", desc: "Complete omnichannel contact center", href: "/services/ai-contact-center" },
      { icon: MessageSquare, title: "Cube Voice Mail", desc: "Exchange and process voice messages instantly", href: "/services/voice-mail" },
      { icon: Radio, title: "IVRS (Interactive Voice Response System)", desc: "Custom IVR solutions built from scratch", href: "/services/ivrs" },
      { icon: Headphones, title: "Conference Bridge", desc: "Secure multi-party audio conferencing rooms", href: "/services/conference-bridge" },
      { icon: GraduationCap, title: "Student Calling System", desc: "Secure calling solution for educational campuses", href: "/student-calling" },
      { icon: ShieldCheck, title: "Prison Calling System", desc: "Highly secure and managed inmate calling solutions", href: "/prison-calling" },
    ]
  },
  {
    id: "recordings",
    label: "Recordings",
    icon: Mic,
    items: [
      { icon: Mic, title: "Callisto Voice Logger", desc: "Crystal clear multi-protocol call recording", href: "/services/voice-logger" },
      { icon: MonitorPlay, title: "Callisto Screen Recording", desc: "Multi-PC screen recording synced with audio", href: "/services/screen-logger" },
      { icon: Database, title: "Callisto In-Sync", desc: "Centralised multi-site recording sync engine", href: "/services/voice-logger-insync" },
    ]
  },
  {
    id: "billing",
    label: "Billing",
    icon: Receipt,
    items: [
      { icon: Receipt, title: "Call Billing Software Basic", desc: "Essential telecom resource & cost management", href: "/billing/basic" },
      { icon: Receipt, title: "Call Billing Software Standard", desc: "Advanced billing rules and departmental tracking", href: "/billing/standard" },
      { icon: Receipt, title: "Call Billing Software Enterprise", desc: "Multi-site management with custom API integrations", href: "/billing/enterprise" }
    ]
  }
];

const QUICK_LINKS = [
  { label: "Click to Call", href: "/services/click-to-call" },
  { label: "Omni-channel Solution", href: "/#contact" },
];

const CONTACT_INFO = {
  expertLine: "+91 806 869 4440",
};

const Navbar = ({ onBookDemo }) => {
  // 'transparent' | 'glass' | 'solid'
  const [navState, setNavState] = useState("transparent");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const [activeMegaTab, setActiveMegaTab] = useState(0); 
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const isHome = location.pathname === "/";

      // FORCE SOLID STATE FOR SPECIFIC PAGES (WHITE BACKGROUND, DARK TEXT)
      if (location.pathname === "/contact" || location.pathname === "/careers" || location.pathname === "/career") {
        setNavState("solid");
        return;
      }

      const vh = window.innerHeight;
      // Keep glass over the entire hero video (85% of screen height) before snapping to solid white
      const solidThreshold = isHome ? vh * 1.6 : vh * 0.85; 
      
      if (scrollY <= 20) {
        setNavState("transparent");
      } else if (scrollY > 20 && scrollY < solidThreshold) {
        setNavState("glass");
      } else {
        setNavState("solid");
      }
    };
    
    window.addEventListener("scroll", onScroll);
    onScroll(); 
    
    return () => window.removeEventListener("scroll", onScroll);
  }, [location.pathname]);

  const go = (href) => {
    setMobileOpen(false);
    setHoveredMenu(null);
    if (!href) return; 
    if (href.startsWith("/")) {
      navigate(href);
      return;
    }
    if (location.pathname === "/") {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/" + href);
    }
  };

  const bookDemo = () => {
    setMobileOpen(false);
    if (onBookDemo && location.pathname === "/") onBookDemo();
    else go("#contact");
  };

  const isActive = (link) => {
    if (link.href === "/about") return location.pathname === "/about";
    if (link.href === "/pricing") return location.pathname === "/pricing";
    
    // Exact path matching for active states
    if (link.label === "Services") {
      return ["/services/cloud-contact-center", "/services/auto-dialer", "/services/ivrs", "/industries/"].some(path => location.pathname.includes(path));
    }
    if (link.label === "Products") {
      return ["/services/voice-logger", "/services/call-billing", "/services/screen-logger", "/services/voice-mail", "/services/conference-bridge", "/services/voice-logger-insync"].some(path => location.pathname.includes(path));
    }
    
    if (link.href === "#home") return location.pathname === "/";
    return false;
  };

  const getNavClasses = () => {
    if (navState === "solid") return "bg-white/95 backdrop-blur-md shadow-md border-b border-slate-100";
    if (navState === "glass") return "bg-[#0A1F44]/50 backdrop-blur-md border-b border-white/10 shadow-sm";
    return "bg-transparent border-b-transparent";
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      
      <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            display: flex;
            width: max-content;
            animation: marquee 30s linear infinite;
          }
          .animate-marquee:hover {
            animation-play-state: paused;
          }
          .marquee-group {
            display: flex;
            align-items: center;
            gap: 2rem;
            padding-right: 2rem;
          }
        `}
      </style>

      {/* Top utility bar */}
      <div className="bg-[#84081b] text-white text-xs sm:text-sm h-10 flex items-center overflow-hidden">
        <div className="animate-marquee">
          {[1, 2, 3, 4].map((index) => (
            <span key={index} className="marquee-group">
              <span className="font-semibold tracking-wide whitespace-nowrap">Voice Without Limits.</span>
              <span className="text-yellow-400 text-lg leading-none">•</span>
              <span className="font-semibold tracking-wide whitespace-nowrap">Connect More. Pay Less.</span>
              <span className="text-yellow-400 text-lg leading-none">•</span>
              <span className="font-semibold tracking-wide whitespace-nowrap">35+ Years of Telephony Excellence</span>
              <span className="text-yellow-400 text-lg leading-none">•</span>
              <span className="font-semibold tracking-wide whitespace-nowrap">Enterprise Features. Small Business Pricing.</span>
              <span className="text-yellow-400 text-lg leading-none">•</span>
            </span>
          ))}
        </div>
      </div>

      {/* Main nav */}
      <nav className={`transition-all duration-500 ease-in-out ${getNavClasses()}`}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex items-center justify-between h-20">
          
          {/* LOGO */}
          <span onClick={() => go("/")} className="cursor-pointer shrink-0 flex items-center group mr-2 xl:mr-4">
            <img 
              // Uses 75 for dark text (solid state), 77 for white text (glass/transparent state)
              src={navState === "solid" ? "/logo75.png" : "/logo-77.png"} 
              alt="Cube Software Logo" 
              className="h-10 sm:h-12 w-auto object-contain transition-all duration-300 group-hover:scale-105"
            />
          </span>

          {/* CENTER LINKS */}
          <div className="hidden lg:flex flex-1 justify-center items-center gap-1 xl:gap-4 h-full">
            {MENU_ITEMS.map((link) => {

              // -------------------------------------------------------------
              // MEGA MENU FOR BOTH "SERVICES" AND "PRODUCTS"
              // -------------------------------------------------------------
              if (link.label === "Services" || link.label === "Products") {
                const megaData = link.label === "Services" ? SERVICES_MEGA_DATA : PRODUCTS_MEGA_DATA;

                return (
                  <div
                    key={link.label}
                    className="relative h-20 flex items-center"
                    onMouseEnter={() => {
                      setHoveredMenu(link.label);
                      setActiveMegaTab(0); // Reset tab when hovering a new menu
                    }}
                    onMouseLeave={() => setHoveredMenu(null)}
                  >
                    <button
                      type="button"
                      className={`px-2 xl:px-3 py-2 text-[13px] xl:text-[14px] font-bold rounded-md flex items-center gap-1 transition-colors whitespace-nowrap cursor-pointer ${
                        navState === "solid"
                          ? (isActive(link) || hoveredMenu === link.label ? "text-blue-700" : "text-slate-800 hover:text-blue-700")
                          : (isActive(link) || hoveredMenu === link.label ? "text-blue-300" : "text-white/90 hover:text-white")
                      }`}
                    >
                      {link.label} 
                      <ChevronDown 
                        size={14} 
                        className={`mt-0.5 transition-transform duration-300 ${hoveredMenu === link.label ? "rotate-180" : ""}`} 
                      />
                    </button>

                    <AnimatePresence>
                      {hoveredMenu === link.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 15 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="fixed top-[120px] left-0 right-0 mx-auto w-full max-w-[950px] bg-white border border-slate-100 shadow-[0_30px_60px_rgba(0,0,0,0.15)] rounded-2xl overflow-hidden flex flex-col z-50 cursor-default"
                        >
                          <div className="flex h-[420px]">
                            {/* Left Sidebar (Categories) */}
                            <div className="w-[300px] bg-slate-50 p-4 border-r border-slate-100 flex flex-col gap-1.5 overflow-y-auto">
                              <div className="text-[11px] font-bold tracking-widest text-slate-400 uppercase px-3 mb-2 mt-2">
                                {link.label === "Services" ? "Solutions" : "Categories"}
                              </div>
                              {megaData.map((tab, index) => (
                                <button
                                  key={tab.id}
                                  onMouseEnter={() => setActiveMegaTab(index)}
                                  className={`flex items-center justify-between w-full px-4 py-3.5 rounded-xl transition-all duration-200 ${
                                    activeMegaTab === index 
                                      ? "bg-white shadow-sm text-blue-700 font-bold border border-slate-100" 
                                      : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900 font-medium border border-transparent"
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <tab.icon size={18} className={activeMegaTab === index ? "text-blue-600" : "text-slate-400"} />
                                    <span className="text-[14px]">{tab.label}</span>
                                  </div>
                                  {activeMegaTab === index && <ArrowRight size={16} className="text-blue-600" />}
                                </button>
                              ))}
                            </div>

                            {/* Right Content Area */}
                            <div className="flex-1 bg-white p-8 overflow-y-auto">
                              <div className="flex items-center justify-between mb-6">
                                <h3 className="font-heading font-black text-xl text-slate-800">
                                  {megaData[activeMegaTab].label}
                                </h3>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-x-8 gap-y-8">
                                {megaData[activeMegaTab].items.map((item, i) => (
                                  <div key={i} onClick={() => go(item.href)} className="flex items-start gap-4 group/item cursor-pointer">
                                    <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover/item:bg-blue-600 group-hover/item:text-white transition-colors duration-300 shadow-sm border border-blue-100">
                                      <item.icon size={20} />
                                    </div>
                                    <div>
                                      <h4 className="font-bold text-slate-900 group-hover/item:text-blue-600 text-[14px] mb-1 transition-colors">
                                        {item.title}
                                      </h4>
                                      <p className="text-[13px] text-slate-500 leading-snug">
                                        {item.desc}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Bottom Quick Links Bar */}
                          <div className="bg-[#F8FAFC] px-8 py-5 border-t border-slate-100 flex items-center gap-6">
                            {QUICK_LINKS.map((qLink, i) => (
                              <button key={i} onClick={() => go(qLink.href)} className="flex items-center gap-2 text-[13px] font-bold text-slate-600 hover:text-blue-700 transition-colors">
                                <div className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                                  <CheckCircle2 size={10} strokeWidth={3} />
                                </div>
                                {qLink.label}
                              </button>
                            ))}
                          </div>

                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              // -------------------------------------------------------------
              // STANDARD LINKS (e.g. About, Pricing, etc)
              // -------------------------------------------------------------
              return (
                <button
                  key={link.label}
                  type="button"
                  onClick={() => go(link.href)}
                  className={`px-2 xl:px-3 py-2 text-[13px] xl:text-[14px] font-bold rounded-md transition-colors whitespace-nowrap ${
                    navState === "solid"
                      ? (isActive(link) ? "text-blue-700" : "text-slate-800 hover:text-blue-700")
                      : (isActive(link) ? "text-blue-300" : "text-white/90 hover:text-white")
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          {/* RIGHT: CTA & ACTIONS */}
          <div className="hidden lg:flex items-center shrink-0 gap-3 xl:gap-5 ml-2">
            <a 
              href={`tel:${CONTACT_INFO.expertLine.replace(/\s/g, "")}`} 
              className={`flex items-center gap-2 text-[13px] xl:text-[14px] font-bold transition-colors whitespace-nowrap ${
                navState === "solid" ? "text-slate-800 hover:text-blue-700" : "text-white/90 hover:text-white"
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                navState === "solid" ? "bg-blue-50 text-blue-600" : "bg-white/20 text-white"
              }`}>
                <Phone size={14} />
              </div>
              <span className="hidden xl:inline">{CONTACT_INFO.expertLine}</span>
            </a>

            <div className={`w-px h-5 transition-colors ${navState === "solid" ? "bg-slate-300" : "bg-white/30"}`}></div>

            <button 
              type="button"
              onClick={() => go("/login")}
              className={`flex items-center gap-1.5 text-[13px] xl:text-[14px] font-bold transition-colors outline-none whitespace-nowrap ${
                navState === "solid" ? "text-slate-800 hover:text-blue-700" : "text-white/90 hover:text-white"
              }`}
            >
              <LogIn size={16} className={navState === "solid" ? "text-blue-600" : "text-white"} />
              Login
            </button>

            <Button
              onClick={bookDemo}
              className={`ml-1 xl:ml-2 rounded-lg px-5 xl:px-6 py-4 xl:py-5 text-[13px] xl:text-[14px] font-bold transition-transform hover:-translate-y-0.5 whitespace-nowrap ${
                navState === "solid" 
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20" 
                  : "bg-white text-blue-700 hover:bg-blue-50 shadow-lg"
              }`}
            >
              Book Demo
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className={`lg:hidden p-2 shrink-0 transition-colors ${navState === "solid" ? "text-slate-800" : "text-white"}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* --- MOBILE DROPDOWN --- */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-slate-100 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="px-4 py-4 flex flex-col gap-2">
              
              {MENU_ITEMS.map((link) => {
                
                // MOBILE MEGA MENU FOR "SERVICES" AND "PRODUCTS"
                if (link.label === "Services" || link.label === "Products") {
                  const megaData = link.label === "Services" ? SERVICES_MEGA_DATA : PRODUCTS_MEGA_DATA;

                  return (
                    <div key={`mobile-mega-${link.label}`} className="mb-2">
                      <div className="px-3 pt-2 pb-2 text-xs font-bold uppercase tracking-widest text-blue-600/70">
                        {link.label}
                      </div>
                      <div className="space-y-4 px-2">
                        {megaData.map((cat) => (
                          <div key={cat.id}>
                            <div className="flex items-center gap-2 text-[14px] font-bold text-slate-800 mb-2 mt-2 px-3">
                              <cat.icon size={16} className="text-blue-600" /> {cat.label}
                            </div>
                            <div className="space-y-1 pl-4 border-l-2 border-slate-100 ml-4">
                              {cat.items.map((item) => (
                                <button
                                  key={item.title}
                                  onClick={() => go(item.href)}
                                  className="w-full text-left px-4 py-2.5 text-[14px] font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors"
                                >
                                  {item.title}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }

                // STANDARD MOBILE LINKS
                return (
                  <button
                    key={link.label}
                    type="button"
                    onClick={() => go(link.href)}
                    className="w-full text-left px-3 py-3 text-[15px] font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors"
                  >
                    {link.label}
                  </button>
                );
              })}

              <div className="h-px bg-slate-100 my-2"></div>

              <a 
                href={`tel:${CONTACT_INFO.expertLine.replace(/\s/g, "")}`} 
                className="flex items-center gap-3 text-left px-3 py-3 text-[15px] font-bold text-slate-800 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                  <Phone size={14} className="text-blue-600" />
                </div>
                {CONTACT_INFO.expertLine}
              </a>

              <button 
                type="button"
                onClick={() => go("/login")}
                className="flex items-center gap-3 text-left px-3 py-3 text-[15px] font-bold text-slate-800 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center">
                  <LogIn size={14} className="text-slate-600" />
                </div>
                Customer Portal Login
              </button>

              <Button onClick={bookDemo} className="mt-4 mb-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-xl font-bold shadow-lg shadow-blue-600/20">
                Book Demo
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;