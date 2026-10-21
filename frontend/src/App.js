import "./App.css";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
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
import AutoDialer from "./pages/AutoDialer";
import ServicePage from "./pages/ServicePage";
import ConferenceBridge from "./pages/ConferenceBridge";
import PricingPage from "./pages/PricingPage"; 
import LoginPage from "./pages/LoginPage"; 
import FloatingChatWidget from "./components/FloatingChatWidget";
import PopupContactForm from "./components/PopupContactForm";
import MeetOurTeamPage from "./pages/MeetOurTeamPage";
import CareerPage from "./pages/CareerPage";
import ContactPage from './components/ContactPage';
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

// --> IMPORT THE ROBOT MASCOT HERE <--
import RobotMascot from "./components/RobotMascot"; 

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

  // If the current path is in the hiddenPaths array, do not render the widgets
  if (hiddenPaths.includes(currentPath)) {
    return null;
  }

  return (
    <>
      {/* ContactSection completely removed from here to stop the double-rendering on Home and other pages */}
      <FloatingChatWidget />
      <PopupContactForm />
    </>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/pricing" element={<PricingPage />} /> 
          <Route path="/login" element={<LoginPage />} /> 
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
          <Route path="/services/:slug" element={<ServicePage />} />
          <Route path="/meet-our-team" element={<MeetOurTeamPage />} />
          <Route path="/career" element={<CareerPage />} />
          <Route path="/contact" element={<ContactPage />} />
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
          
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        
        {/* Render the forms conditionally based on the route */}
        <GlobalLayout />

        {/* --> THE ROBOT MASCOT IS PLACED HERE SO IT APPEARS GLOBALLY <-- */}
        <RobotMascot />
        
      </BrowserRouter>
      <Toaster position="bottom-right" richColors />
    </div>
  );
}

export default App;