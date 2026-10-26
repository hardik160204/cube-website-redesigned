import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

import Hero from "../components/home/Hero";
import LogoAssembly from "../components/home/LogoAssembly";
import Products from "../components/home/Products";
import FeatureTabs from "../components/home/FeatureTabs";
import AiSection from "../components/home/AiSection";
import PricingStrip from "../components/home/PricingStrip";
import ContactCenterModules from "../components/home/ContactCenterModules";
import IndustryPicker from "../components/home/IndustryPicker";
import Integrations from "../components/home/Integrations";
import DirectLines from "../components/home/DirectLines";
import LogosAndStats from "../components/home/LogosAndStats";
import Testimonials from "../components/home/Testimonials";
import Faq from "../components/home/Faq";
import ClosingCta from "../components/home/ClosingCta";

// Homepage only, laid out section for section (structure, palette, type and motion),
// filled with Cube's own data. The header, footer and page transition live in App.js.
const Home = () => {
  const location = useLocation();

  // Deep links like /#industries land on their section; plain visits start at the top.
  useEffect(() => {
    if (!location.hash) {
      window.scrollTo(0, 0);
      return;
    }
    // Wait a tick so the section exists; no `behavior` arg, so CSS decides (smooth unless reduced motion).
    const timer = setTimeout(() => document.querySelector(location.hash)?.scrollIntoView(), 100);
    return () => clearTimeout(timer);
  }, [location]);

  return (
    <>
        <Hero />
        <LogoAssembly />
        <Products />
        <FeatureTabs />
        <AiSection />
        <PricingStrip />
        <ContactCenterModules />
        <IndustryPicker />
        <Integrations />
        <DirectLines />
        <LogosAndStats />
        <Testimonials />
        <Faq />
        <ClosingCta />
    </>
  );
};

export default Home;
