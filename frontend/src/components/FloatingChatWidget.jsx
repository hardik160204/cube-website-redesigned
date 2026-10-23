import React, { useState } from "react";
import { X, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ease } from "../lib/motion";

const BUBBLE_CLASS = "bg-white/[0.06] border border-white/10 p-3 rounded-tr-xl rounded-bl-xl rounded-br-xl text-sm text-foreground/90 max-w-[90%]";

const FAQS = [
  {
    question: "How do I book a demo?",
    answer: "You can book a demo by clicking the 'Book Demo' button at the top of the page, or by navigating to our Contact section to fill out a request form. Our team will reach out within 24 hours!"
  },
  {
    question: "What are your pricing plans?",
    answer: "We offer flexible pricing starting at $19/month for our Starter plan and $49/month for our Professional Contact Center plan. Check out our Pricing page for a full feature breakdown."
  },
  {
    question: "Do you offer 24/7 technical support?",
    answer: "Yes! Our Professional and Enterprise tiers include dedicated 24/7 technical hotline access to ensure your business-critical communications never experience downtime."
  },
  {
    question: "Can I get a custom Enterprise quote?",
    answer: "Absolutely. Please email us at sales@cube-software.com or call our expert line at +91 120 405 7109 to get a customized architecture breakdown."
  }
];

export default function FloatingChatWidget() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState(null);

  const whatsappNumber = "919899570753"; 
  const whatsappMessage = "Hello Cube Software, I would like to know more about your cloud telephony solutions.";

  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(whatsappMessage);
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, "_blank");
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    setSelectedFaq(null);
  };

  return (
    <div className="fixed bottom-[130px] right-6 z-50 flex flex-col items-end gap-4">
      
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.18, ease } }}
            exit={{ opacity: 0, y: 8, transition: { duration: 0.12, ease } }}
            className="dark glass bg-popover/95 w-80 sm:w-96 rounded-2xl overflow-hidden flex flex-col"
          >
            {/* Chat Header */}
            <div className="bg-white/[0.03] border-b border-white/10 text-foreground p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {selectedFaq && (
                  <button onClick={() => setSelectedFaq(null)} aria-label="Back to topics" className="hover:bg-white/10 p-1 rounded-md transition-colors">
                    <ChevronLeft size={20} />
                  </button>
                )}
                <div>
                  <h3 className="font-semibold text-sm">Cube Support</h3>
                  <p className="text-[11px] text-muted-foreground">Typically replies instantly</p>
                </div>
              </div>
              <button onClick={toggleChat} aria-label="Close chat" className="text-muted-foreground hover:text-foreground transition-colors rounded-md">
                <X size={20} />
              </button>
            </div>

            {/* Chat Body */}
            <div className="p-4 min-h-[300px] max-h-[450px] overflow-y-auto flex flex-col">
              {!selectedFaq ? (
                <div className="space-y-4 flex-1">
                  <div className={BUBBLE_CLASS}>
                    Hi there! 👋 Choose a topic below or reach out to our team directly.
                  </div>

                  <div className="flex flex-col gap-2 mt-4">
                    {FAQS.map((faq, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedFaq(faq)}
                        className="text-left bg-white/[0.03] border border-white/10 hover:border-primary/50 hover:bg-primary/10 text-blue-400 hover:text-foreground text-sm p-3 rounded-xl transition-colors"
                      >
                        {faq.question}
                      </button>
                    ))}
                  </div>

                  {/* Integrated WhatsApp Button */}
                  <div className="mt-6 pt-4 border-t border-white/10">
                    <button
                      onClick={handleWhatsAppClick}
                      className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-bold py-3 px-4 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.305-.88-.653-1.473-1.46-1.646-1.757-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                      </svg>
                      Continue on WhatsApp
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <div className="bg-primary text-primary-foreground p-3 rounded-tl-xl rounded-bl-xl rounded-br-xl text-sm max-w-[90%]">
                      {selectedFaq.question}
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className={`${BUBBLE_CLASS} leading-relaxed`}>
                      {selectedFaq.answer}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden button for the mascot to click */}
      <button
        onClick={toggleChat}
        className="chat-widget-trigger-button-class hidden"
        aria-hidden="true"
      />
    </div>
  );
}