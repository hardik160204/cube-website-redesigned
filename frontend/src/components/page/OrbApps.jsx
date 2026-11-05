import React from "react";
import { Facebook, Instagram, Linkedin, Phone } from "lucide-react";

// The apps revolving round the Cube orb, on the orb's two orbits (site-effects.css keeps each one upright).
const WhatsApp = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.91-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.05 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.89 9.88z" />
  </svg>
);

const INSTAGRAM = "linear-gradient(45deg,#F58529,#DD2A7B 50%,#8134AF 80%,#515BD4)";
const INNER = [
  { angle: 0, Icon: Facebook, background: "#1877F2", chip: "#1877F2" },
  { angle: 120, Icon: Phone, background: "#16A34A", chip: "#22C55E" },
  { angle: 240, Icon: Instagram, background: INSTAGRAM, chip: "#DD2A7B" },
];
const OUTER = [
  { angle: 60, Icon: Linkedin, background: "#0A66C2", chip: "#0A66C2" },
  { angle: 240, Icon: WhatsApp, background: "#25D366", chip: "#25D366" },
];

function Orbit({ apps, radius, className }) {
  return (
    <span className={className}>
      {apps.map(({ angle, Icon, background, chip }) => (
        <i key={angle} className="cl-app" style={{ transform: `rotate(${angle}deg) translateY(-${radius}px)` }}>
          <span className="cl-app-tilt" style={{ transform: `rotate(${-angle}deg)` }}>
            <span className="cl-app-chip" style={{ background, "--chip": chip }}>
              <Icon size={27} />
            </span>
          </span>
        </i>
      ))}
    </span>
  );
}

export default function OrbApps() {
  return (
    <>
      <Orbit apps={INNER} radius={180} className="cl-ai-orbit" />
      <Orbit apps={OUTER} radius={230} className="cl-ai-orbit cl-outer" />
    </>
  );
}
