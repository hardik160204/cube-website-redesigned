import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "./ui/button";

const PRODUCTS = [
  {
    key: "cloud-contact-center",
    title: "Contact Center Solution",
    tagline: "Get results with a powerful inbound, outbound and blended cloud contact center solution with full call disposition.",
    heroImage: "/contact-center.png",
  },
  {
    key: "voice-logger",
    title: "Callisto Voice Logger",
    tagline: "The ideal call recording solution — every conversation captured, compressed and searchable.",
    heroImage: "/voice-logger.png",
  },
  {
    key: "call-billing",
    title: "Call Billing Software",
    tagline: "Take command of telecom resources and costs across every office, hotel and facility.",
    heroImage: "/call-billing.png",
  },
  {
    key: "screen-logger",
    title: "Screen Logger",
    tagline: "Next-generation multi-PC screen recording over the network — see what your customers experienced.",
    heroImage: "/screen-logger.png",
  },
  {
    key: "voice-mail",
    title: "Cube Voice Mail",
    tagline: "Never miss a message — exchange, deliver and process voice messages automatically.",
    heroImage: "/voice-mail.png",
  },
  {
    key: "voice-logger-insync",
    title: "Voice Logger InSync",
    tagline: "Centralise critical recording data from every location into one synchronised archive.",
    heroImage: "/voice-logger-insync.png",
  },
];

export default function OurProducts() {
  return (
    <section className="py-24 bg-white overflow-hidden border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-14"
        >
          <h2 className="font-heading font-black text-4xl sm:text-5xl tracking-tight text-slate-900">
            Our Products
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {PRODUCTS.map((srv, i) => (
            <motion.div
              key={srv.key}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
              className="bg-white rounded-[20px] border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-5 flex flex-col justify-between group hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] hover:-translate-y-2 transition-all duration-500 cursor-pointer"
            >
              <div>
                <div className="w-full h-[200px] overflow-hidden rounded-xl mb-6 relative border border-slate-50">
                  <img 
                    src={srv.heroImage} 
                    alt={srv.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                </div>
                
                <div className="flex flex-col items-center text-center px-2">
                  <h3 className="font-heading font-bold text-xl text-slate-900 mb-3 transition-colors group-hover:text-[#1f638b]">
                    {srv.title}
                  </h3>
                  <p className="text-sm text-slate-600 mb-6 line-clamp-3 leading-relaxed text-justify">
                    {srv.tagline}
                  </p>
                </div>
              </div>

              <div className="w-full flex justify-center pt-2">
                <Link to={`/services/${srv.key}`}>
                  <Button className="bg-[#1f638b] hover:bg-[#13425e] text-white px-8 h-10 rounded-lg shadow-sm transition-colors font-medium">
                    Learn More
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}