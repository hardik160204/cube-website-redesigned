import "./App.css";
import "./components/site-effects.css";
import { Suspense, lazy, useEffect, useLayoutEffect } from "react";
import { editing } from "./lib/editable";
import { currentFestival } from "./lib/festivals";
import { useSiteData } from "./lib/site";
import { useConsent } from "./lib/consent";
import { googleAnalytics } from "./lib/ga";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { Toaster } from "sonner";
import { motion, MotionConfig, useReducedMotion } from "framer-motion";
import { ease } from "./lib/motion";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
import Home from "./pages/Home";
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ClientVoices = lazy(() => import("./pages/ClientVoices"));
const CubeCloudCCS = lazy(() => import("./pages/CubeCloudCCS"));
const CloudContactCenter = lazy(() => import("./pages/CloudContactCenter"));
const VoiceLoggerInSync = lazy(() => import("./pages/VoiceLoggerInSync"));
const CubeVoiceMail = lazy(() => import("./pages/CubeVoiceMail"));
const ScreenLogger = lazy(() => import("./pages/ScreenLogger"));
const CallBillingSoftware = lazy(() => import("./pages/CallBillingSoftware"));
const CallistoVoiceLogger = lazy(() => import("./pages/CallistoVoiceLogger"));
const IvrsServices = lazy(() => import("./pages/IvrsServices"));
const CloudIvrPage = lazy(() => import("./pages/CloudIvrPage"));
const CloudMissedCallPage = lazy(() => import("./pages/CloudMissedCallPage"));
const CloudAutoDialerPage = lazy(() => import("./pages/CloudAutoDialerPage"));
const CloudBulkVoiceCallPage = lazy(() => import("./pages/CloudBulkVoiceCallPage"));
const CloudWhatsappBotPage = lazy(() => import("./pages/CloudWhatsappBotPage"));
const CloudWebChatBotPage = lazy(() => import("./pages/CloudWebChatBotPage"));
const CloudTollFreeNumberPage = lazy(() => import("./pages/CloudTollFreeNumberPage"));
const CloudCrmIntegrationPage = lazy(() => import("./pages/CloudCrmIntegrationPage"));
const CloudVirtualNumberPage = lazy(() => import("./pages/CloudVirtualNumberPage"));
const CloudCallRecordingPage = lazy(() => import("./pages/CloudCallRecordingPage"));
const CloudClickToCallPage = lazy(() => import("./pages/CloudClickToCallPage"));
const CloudSmartCallRoutingPage = lazy(() => import("./pages/CloudSmartCallRoutingPage"));
const CloudNumberMaskingPage = lazy(() => import("./pages/CloudNumberMaskingPage"));
const CloudLiveAnalyticsPage = lazy(() => import("./pages/CloudLiveAnalyticsPage"));
const CloudQualityAnalysisPage = lazy(() => import("./pages/CloudQualityAnalysisPage"));
const ConferenceBridge = lazy(() => import("./pages/ConferenceBridge"));
const VisualSupportPage = lazy(() => import("./pages/VisualSupportPage"));
const CustomPage = lazy(() => import("./pages/CustomPage"));
const PricingPage = lazy(() => import("./pages/PricingPage"));
import { DEMO_EVENT } from "./components/demo";
const DemoPage = lazy(() => import("./pages/DemoPage"));
const MeetOurTeamPage = lazy(() => import("./pages/MeetOurTeamPage"));
const CareerPage = lazy(() => import("./pages/CareerPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const BlogPostPage = lazy(() => import("./pages/BlogPostPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage"));
const RefundPolicyPage = lazy(() => import("./pages/RefundPolicyPage"));
const DataDeletionPage = lazy(() => import("./pages/DataDeletionPage"));
const UnsubscribePage = lazy(() => import("./pages/UnsubscribePage"));
const FinanceIndustryPage = lazy(() => import("./pages/FinanceIndustryPage"));
const BPOIndustryPage = lazy(() => import("./pages/BPOIndustryPage"));
const HealthcareIndustryPage = lazy(() => import("./pages/HealthcareIndustryPage"));
const RealEstateIndustryPage = lazy(() => import("./pages/RealEstateIndustryPage"));
const TelecomIndustryPage = lazy(() => import("./pages/TelecomIndustryPage"));
const TravelIndustryPage = lazy(() => import("./pages/TravelIndustryPage"));
const AdvertisingIndustryPage = lazy(() => import("./pages/AdvertisingIndustryPage"));
const NGOIndustryPage = lazy(() => import("./pages/NGOIndustryPage"));
const ElectionIndustryPage = lazy(() => import("./pages/ElectionIndustryPage"));
const EducationIndustryPage = lazy(() => import("./pages/EducationIndustryPage"));
const PrisonCallingSystem = lazy(() => import("./pages/PrisonCallingSystem"));
const StudentCallingSystem = lazy(() => import("./pages/StudentCallingSystem"));
const CallBillingBasic = lazy(() => import("./pages/CallBillingBasic"));
const CallBillingStandard = lazy(() => import("./pages/CallBillingStandard"));
const CallBillingEnterprise = lazy(() => import("./pages/CallBillingEnterprise"));

import CubeMascot from "./components/CubeMascot";
import CopyrightBar from "./components/CopyrightBar";
import CookieConsent from "./components/CookieConsent";
import SiteContent from "./components/SiteContent";
import Seo from "./components/Seo";
import PageGate from "./components/PageGate";

// The admin dashboard is its own bundle, loaded only when someone opens /admin.
const AdminApp = lazy(() => import("./admin/AdminApp"));
// So is a festival's theme, loaded only while one is on.
const Festival = lazy(() => import("./festival/Festival"));

// What the dashboard sets for the whole site: font sizes, the festival showing now, and Google Analytics (only for
// visitors who allowed analytics after being told about it; never while editing or inside the dashboard's preview).
function SiteLook() {
  const { fonts, festival, google } = useSiteData();
  const consent = useConsent();
  const gaId = google?.gaId;
  useEffect(() => {
    if (!gaId || editing() || window.top !== window.self) return undefined;
    googleAnalytics(gaId, Boolean(consent?.analytics && consent?.ga));
    return () => googleAnalytics(gaId, false);
  }, [gaId, consent]);
  useEffect(() => {
    if (!fonts) return undefined;
    const root = document.documentElement;
    for (const k of ["all", "head", "body", "nav"]) root.style.setProperty(`--fs-${k}`, String((fonts[k] ?? 100) / 100));
    return () => ["all", "head", "body", "nav"].forEach((k) => root.style.removeProperty(`--fs-${k}`));
  }, [fonts]);
  const active = currentFestival(festival);
  return active && !editing() ? (
    <Suspense fallback={null}>
      <Festival key={active.key} festival={active} />
    </Suspense>
  ) : null;
}

// Helper component to manage global layout elements based on the route
const GlobalLayout = () => {
  const navigate = useNavigate();

  // Every "Book a demo" button leads to the booking page.
  useEffect(() => {
    const go = () => navigate("/demo");
    window.addEventListener(DEMO_EVENT, go);
    return () => window.removeEventListener(DEMO_EVENT, go);
  }, [navigate]);

  return null;
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
        id="main"
        tabIndex={-1}
        className="focus:outline-none"
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
        {/* First thing a keyboard user reaches: jumps past the menus to the page itself. */}
        <a
          href="#main"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById("main")?.focus();
          }}
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2.5 focus:font-medium focus:text-[#0A0626] focus:shadow-lg"
        >
          Skip to content
        </a>
        <SiteHeader />
        <RouteTransition>
        <PageGate>
        {/* Pages arrive as their own small files; the space is held so the footer doesn't jump while one loads. */}
        <Suspense fallback={<div className="min-h-screen" />}>
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
          <Route path="/services/co-browsing" element={<VisualSupportPage feature="co-browsing" />} />
          <Route path="/services/screen-sharing" element={<VisualSupportPage feature="screen-sharing" />} />
          {/* Pages built in the admin; unknown addresses still go to the homepage */}
          <Route path="/services/:slug" element={<CustomPage />} />
          <Route path="/meet-our-team" element={<MeetOurTeamPage />} />
          <Route path="/career" element={<CareerPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/demo" element={<DemoPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/refund-policy" element={<RefundPolicyPage />} />
          <Route path="/data-deletion" element={<DataDeletionPage />} />
          <Route path="/unsubscribe" element={<UnsubscribePage />} />
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
          
          
          <Route path="*" element={<CustomPage />} />
        </Routes>
        </Suspense>
        </PageGate>
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
        <SiteLook />
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