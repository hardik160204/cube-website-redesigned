import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { ease } from "../lib/motion";

const INPUT_CLASS = "w-full px-4 py-3 bg-white/[0.04] border border-white/10 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-ring transition-colors";

export default function PopupContactForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    company: "",
    website: "",
    designation: "",
  });

  // --- SMART TRIGGERS: 20s Inactivity & Exit Intent ---
  useEffect(() => {
    if (hasTriggered) return;

    let idleTimer;

    const triggerPopup = () => {
      setIsOpen(true);
      setHasTriggered(true); // Ensures it only pops up once per session
    };

    // 1. Inactivity Logic (20 seconds)
    const resetIdleTimer = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(triggerPopup, 20000); // 20,000 ms = 20 seconds
    };

    // 2. Exit Intent Logic (Mouse leaves top of window)
    const handleMouseLeave = (e) => {
      // clientY <= 0 means the mouse crossed the top edge of the browser viewport
      if (e.clientY <= 0) {
        triggerPopup();
      }
    };

    // Start the initial idle timer
    resetIdleTimer();

    // Listen for activity to reset the timer
    const activityEvents = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
    activityEvents.forEach(event => document.addEventListener(event, resetIdleTimer));
    
    // Listen for exit intent
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      clearTimeout(idleTimer);
      activityEvents.forEach(event => document.removeEventListener(event, resetIdleTimer));
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [hasTriggered]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API Call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsOpen(false);
      console.log("Lead captured:", form);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="dark fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 pointer-events-auto">

          {/* Frosted Glass Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-background/70 backdrop-blur-sm"
          />

          {/* Popup Card */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.18, ease } }}
            exit={{ opacity: 0, y: 8, transition: { duration: 0.12, ease } }}
            className="glass bg-popover/95 relative w-full max-w-4xl rounded-3xl z-10 flex flex-col overflow-hidden"
          >
            {/* Floating Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 ring-1 ring-inset ring-white/10 text-foreground hover:bg-white/20 transition-colors"
              aria-label="Close modal"
            >
              <X size={18} strokeWidth={2.5} />
            </button>

            {/* Header */}
            <div className="pt-8 pb-6 px-8 text-center z-10">
              <h2 className="font-heading font-bold text-2xl sm:text-3xl text-foreground tracking-tight">
                "Stop Juggling Tools—Switch to Cube's Cloud Telephony"
              </h2>
            </div>

            {/* Content Flex Container */}
            <div className="flex flex-col md:flex-row px-6 pb-8 gap-6 md:gap-8">
              
              {/* Left Side: Image */}
              <div className="w-full md:w-5/12 shrink-0">
                <div className="w-full h-[250px] md:h-full rounded-2xl overflow-hidden shadow-inner">
                  <img 
                    src="https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=800&q=80" 
                    alt="Professional on phone" 
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              </div>

              {/* Right Side: Form */}
              <div className="w-full md:w-7/12 flex flex-col justify-center">
                <form onSubmit={handleSubmit} className="flex flex-col h-full justify-between gap-4">
                  
                  {/* Grid of Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="name"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Name"
                      className={INPUT_CLASS}
                    />
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Phone Number"
                      className={INPUT_CLASS}
                    />
                    <input
                      type="email"
                      name="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Business Email"
                      className={INPUT_CLASS}
                    />
                    <input
                      type="text"
                      name="company"
                      required
                      value={form.company}
                      onChange={handleChange}
                      placeholder="Company Name"
                      className={INPUT_CLASS}
                    />
                    <input
                      type="url"
                      name="website"
                      value={form.website}
                      onChange={handleChange}
                      placeholder="Website URL"
                      className={INPUT_CLASS}
                    />
                    <input
                      type="text"
                      name="designation"
                      value={form.designation}
                      onChange={handleChange}
                      placeholder="Designation"
                      className={INPUT_CLASS}
                    />
                  </div>

                  {/* Submit Button */}
                  <Button type="submit" disabled={isSubmitting} className="w-full h-14 text-lg mt-4">
                    {isSubmitting ? "Sending Request..." : "Get in Touch"}
                  </Button>

                </form>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}