import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

import Navbar from "../components/Navbar";
import Hero from "../components/home/Hero";
import LogoMarquee from "../components/home/LogoMarquee";
import CallJourney from "../components/home/CallJourney";
import Capabilities from "../components/home/Capabilities";
import Industries from "../components/home/Industries";
import Voices from "../components/home/Voices";
import Faq from "../components/home/Faq";
import ClosingCta from "../components/home/ClosingCta";
import { Footer } from "../components/HomeSections2";

// The page follows one call: hero (the call as a waveform) → its life, stage by stage →
// the infrastructure under it → who runs on it → questions → the close.
const Home = () => {
  const location = useLocation();

  // Deep links like /#journey land on their section; plain visits start at the top.
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
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <LogoMarquee />
        <CallJourney />
        <Capabilities />
        <Industries />
        <Voices />
        <Faq />
        <ClosingCta />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
