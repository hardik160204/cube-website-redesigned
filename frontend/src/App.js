import "./App.css";
import "./components/site-effects.css";
import { Suspense, lazy, useEffect, useLayoutEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Toaster } from "sonner";
import { motion, MotionConfig, useReducedMotion } from "framer-motion";
import { ease } from "./lib/motion";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
import Home from "./pages/Home";
import AboutPage from "./pages/AboutPage";
import ClientVoices from "./pages/ClientVoices";
import CubeCloudCCS from './pages/CubeCloudCCS';
import CloudContactCenter from "./pages/CloudContactCenter";
import VoiceLoggerInSync from "./pages/VoiceLoggerInSync";
import CubeVoiceMail from "./pages/CubeVoiceMail";
import ScreenLogger from "./pages/ScreenLogger";
import CallBillingSoftware from "./pages/CallBillingSoftware";
import CallistoVoiceLogger from "./pages/CallistoVoiceLogger";
import IvrsServices from "./pages/IvrsServices";
import CloudIvrPage from "./pages/CloudIvrPage"; 
import CloudMissedCallPage from "./pages/CloudMissedCallPage";
import CloudAutoDialerPage from "./pages/CloudAutoDialerPage";
import CloudBulkVoiceCallPage from "./pages/CloudBulkVoiceCallPage";
import CloudWhatsappBotPage from "./pages/CloudWhatsappBotPage";
import CloudWebChatBotPage from "./pages/CloudWebChatBotPage";
import CloudTollFreeNumberPage from "./pages/CloudTollFreeNumberPage";
import CloudCrmIntegrationPage from "./pages/CloudCrmIntegrationPage";
import CloudVirtualNumberPage from "./pages/CloudVirtualNumberPage";
import CloudCallRecordingPage from "./pages/CloudCallRecordingPage";
import CloudClickToCallPage from "./pages/CloudClickToCallPage";
import CloudSmartCallRoutingPage from "./pages/CloudSmartCallRoutingPage";
import CloudNumberMaskingPage from "./pages/CloudNumberMaskingPage";
import CloudLiveAnalyticsPage from "./pages/CloudLiveAnalyticsPage";
import CloudQualityAnalysisPage from "./pages/CloudQualityAnalysisPage";
import ConferenceBridge from "./pages/ConferenceBridge";
import PricingPage from "./pages/PricingPage"; 
import FloatingChatWidget from "./components/FloatingChatWidget";
import { DEMO_EVENT } from "./components/demo";
import DemoPage from "./pages/DemoPage";
import MeetOurTeamPage from "./pages/MeetOurTeamPage";
import CareerPage from "./pages/CareerPage";
import ContactPage from './pages/ContactPage';
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import FinanceIndustryPage from './pages/FinanceIndustryPage';
import BPOIndustryPage from './pages/BPOIndustryPage';
import HealthcareIndustryPage from './pages/HealthcareIndustryPage';
import RealEstateIndustryPage from './pages/RealEstateIndustryPage';
import TelecomIndustryPage from './pages/TelecomIndustryPage';
import TravelIndustryPage from './pages/TravelIndustryPage';
import AdvertisingIndustryPage from './pages/AdvertisingIndustryPage';
import NGOIndustryPage from './pages/NGOIndustryPage';
import ElectionIndustryPage from './pages/ElectionIndustryPage';
import EducationIndustryPage from './pages/EducationIndustryPage';
import PrisonCallingSystem from './pages/PrisonCallingSystem';
import StudentCallingSystem from './pages/StudentCallingSystem';
import CallBillingBasic from './pages/CallBillingBasic'; // update path if needed
import CallBillingStandard from './pages/CallBillingStandard';
import CallBillingEnterprise from './pages/CallBillingEnterprise';

import CubeMascot from "./components/CubeMascot";
import CopyrightBar from "./components/CopyrightBar";
import CookieConsent from "./components/CookieConsent";
import SiteContent from "./components/SiteContent";
import Seo from "./components/Seo";

// The admin dashboard is its own bundle, loaded only when someone opens /admin.
const AdminApp = lazy(() => import("./admin/AdminApp"));

// Helper component to manage global layout elements based on the route
const GlobalLayout = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Define which paths should NOT have the global floating forms/widgets
  const hiddenPaths = [
    "/services/ivr",
    "/services/auto-dialer",
    "/services/cloud-contact-center", 
    "/services/missed-call",
    "/services/bulk-voice-call",
    "/services/whatsapp-bot",
    "/services/web-chat-bot",
    "/services/crm-integration",
    "/services/toll-free-number",
    "/services/virtual-number",
    "/services/call-recording",
    "/services/click-to-call",
    "/services/smart-call-routing",
    "/services/number-masking",
    "/services/live-analytics",
    "/services/quality-analysis",
    "/meet-our-team",
    "/career"
  ];

  const hidden = hiddenPaths.includes(currentPath);
  const navigate = useNavigate();

  // Every "Book a demo" button leads to the booking page.
  useEffect(() => {
    const go = () => navigate("/demo");
    window.addEventListener(DEMO_EVENT, go);
    return () => window.removeEventListener(DEMO_EVENT, go);
  }, [navigate]);

  return (
    <>
      {/* ContactSection completely removed from here to stop the double-rendering on Home and other pages */}
      {!hidden && <FloatingChatWidget />}
    </>
  );
};

// Page-to-page transition. The header and footer stay put; the new page rises in while a logo-coloured
// bar sweeps across the top. The transform is cleared once it lands, so nothing inside a page loses its
// fixed or sticky positioning. New pages start at the top unless the link targets a section.
const RouteTransition = ({ children }) => {
  const { pathname, hash } = useLocation();
  const reduce = useReducedMotion();
  useLayoutEffect(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);
  return (
    <>
      <motion.div
        key={`bar-${pathname}`}
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-[linear-gradient(90deg,#FF0000,#2300DC,#0047FF,#00B8FF)]"
        initial={reduce ? false : { transform: "scaleX(0)", opacity: 1 }}
        animate={{ transform: "scaleX(1)", opacity: 0 }}
        transition={{ transform: { duration: 0.6, ease }, opacity: { duration: 0.3, delay: 0.55 } }}
      />
      <motion.main
        key={pathname}
        initial={reduce ? false : { opacity: 0, transform: "translateY(16px)" }}
        animate={{ opacity: 1, transform: "translateY(0px)", transitionEnd: { transform: "none" } }}
        transition={{ duration: 0.5, ease }}
      >
        {children}
      </motion.main>
    </>
  );
};

function Site() {
  return (
    <div className="App cl-root cube-brand min-h-screen bg-white pb-9 text-[#31343A]">
        <SiteHeader />
        <RouteTransition>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/pricing" element={<PricingPage />} /> 
          <Route path="/client-voices" element={<ClientVoices />} />
          
          {/* --- NAVBAR ROUTING FOR CONTACT CENTERS --- */}
          <Route path="/services/cloud-contact-center" element={<CubeCloudCCS />} />
          <Route path="/services/ai-contact-center" element={<CloudContactCenter />} />

          <Route path="/services/voice-logger-insync" element={<VoiceLoggerInSync />} />
          <Route path="/services/cube-voice-mail" element={<CubeVoiceMail />} />
          <Route path="/services/voice-mail" element={<CubeVoiceMail />} />
          <Route path="/services/screen-logger" element={<ScreenLogger />} />
          <Route path="/services/call-billing" element={<CallBillingSoftware />} />
          <Route path="/services/callisto-voice-logger" element={<CallistoVoiceLogger />} />
          <Route path="/services/voice-logger" element={<CallistoVoiceLogger />} />
          <Route path="/services/ivrs" element={<IvrsServices />} />
          
          {/* New Custom Pages */}
          <Route path="/services/ivr" element={<CloudIvrPage />} /> 
          <Route path="/services/auto-dialer" element={<CloudAutoDialerPage />} />
          <Route path="/services/missed-call" element={<CloudMissedCallPage />} />
          <Route path="/services/bulk-voice-call" element={<CloudBulkVoiceCallPage />} />
          <Route path="/services/whatsapp-bot" element={<CloudWhatsappBotPage />} />
          <Route path="/services/web-chat-bot" element={<CloudWebChatBotPage />} />
          <Route path="/services/crm-integration" element={<CloudCrmIntegrationPage />} />
          <Route path="/services/toll-free-number" element={<CloudTollFreeNumberPage />} />
          <Route path="/services/virtual-number" element={<CloudVirtualNumberPage />} />
          <Route path="/services/call-recording" element={<CloudCallRecordingPage />} />
          <Route path="/services/click-to-call" element={<CloudClickToCallPage />} />
          <Route path="/services/smart-call-routing" element={<CloudSmartCallRoutingPage />} />
          <Route path="/services/number-masking" element={<CloudNumberMaskingPage />} />
          <Route path="/services/live-analytics" element={<CloudLiveAnalyticsPage />} />
          <Route path="/services/quality-analysis" element={<CloudQualityAnalysisPage />} />
          
          <Route path="/services/conference-bridge" element={<ConferenceBridge />} />
          <Route path="/services/:slug" element={<Navigate to="/" replace />} />
          <Route path="/meet-our-team" element={<MeetOurTeamPage />} />
          <Route path="/career" element={<CareerPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/demo" element={<DemoPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/industries/finance" element={<FinanceIndustryPage />} />
          <Route path="/industries/bpo" element={<BPOIndustryPage />} />
          <Route path="/industries/healthcare" element={<HealthcareIndustryPage />} />
          <Route path="/industries/real-estate" element={<RealEstateIndustryPage />} />
          <Route path="/industries/telecom" element={<TelecomIndustryPage />} />
          <Route path="/industries/travel" element={<TravelIndustryPage />} />
          <Route path="/industries/advertising" element={<AdvertisingIndustryPage />} />
          <Route path="/industries/ngo" element={<NGOIndustryPage />} />
          <Route path="/industries/election" element={<ElectionIndustryPage />} />
          <Route path="/industries/education" element={<EducationIndustryPage />} />
          <Route path="/prison-calling" element={<PrisonCallingSystem />} />
          <Route path="/student-calling" element={<StudentCallingSystem />} />
          <Route path="/billing/basic" element={<CallBillingBasic />} />
          <Route path="/billing/standard" element={<CallBillingStandard />} />
          <Route path="/billing/enterprise" element={<CallBillingEnterprise />} />
          
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </RouteTransition>
        <SiteFooter />
        <CopyrightBar />
        <CookieConsent />

        {/* Render the forms conditionally based on the route */}
        <GlobalLayout />

        {/* Cube, the mascot, on every page */}
        <CubeMascot />

        {/* Text and image edits made in the admin's visual editor */}
        <SiteContent />
        <Seo />
    </div>
  );
}

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <Routes>
          <Route
            path="/admin/*"
            element={
              <Suspense fallback={null}>
                <div className="cl-root cube-brand">
                  <AdminApp />
                </div>
              </Suspense>
            }
          />
          <Route path="*" element={<Site />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="bottom-right" richColors />
    </MotionConfig>
  );
}

export default App;