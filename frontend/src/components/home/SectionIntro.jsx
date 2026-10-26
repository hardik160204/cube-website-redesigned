import React from "react";

// Cube section heading: small uppercase label, 45px headline whose tail is in the brand blue, 18px body.
export default function SectionIntro({ label, title, highlight, body, align = "left", dark = false, className = "" }) {
  const center = align === "center";
  return (
    <div className={`flex max-w-[860px] flex-col gap-3 ${center ? "mx-auto items-center text-center" : ""} ${className}`}>
      {label && (
        <span className={`text-xs font-semibold uppercase leading-4 tracking-[0.04em] md:text-[13px] ${dark ? "text-[#00B8FF]" : "text-[#0047FF]"}`}>{label}</span>
      )}
      <h2 className={`text-[32px] font-medium leading-[1.15] md:text-[45px] md:leading-[52px] ${dark ? "text-white" : "text-[#31343a]"}`}>
        {title}
        {highlight && (
          <>
            {" "}
            <span className={dark ? "text-[#00B8FF]" : "text-primary"}>{highlight}</span>
          </>
        )}
      </h2>
      {body && <p className={`text-lg leading-7 ${dark ? "text-[#A9B3CC]" : "text-[#404348]"}`}>{body}</p>}
    </div>
  );
}
