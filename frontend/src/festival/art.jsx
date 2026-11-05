import React, { useId } from "react";
import { motion } from "framer-motion";

// What travels with the visitor's scrolling, one for each kind of festival. Plain drawings, no images.

// A clay lamp. Its flame grows as the visitor goes down the page (`flame` is a motion value).
export function Diya({ flame }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 72 72" className="block h-full w-full overflow-visible" aria-hidden="true">
      <defs>
        <radialGradient id={`${id}g`}>
          <stop offset="0" stopColor="#FFD56A" stopOpacity="0.85" />
          <stop offset="1" stopColor="#FF8A1F" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}f`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#FF6A00" />
          <stop offset="0.55" stopColor="#FFB000" />
          <stop offset="1" stopColor="#FFF3B0" />
        </linearGradient>
        <linearGradient id={`${id}c`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E9782B" />
          <stop offset="1" stopColor="#8A2E0C" />
        </linearGradient>
      </defs>
      <motion.g style={{ scale: flame, transformBox: "fill-box", transformOrigin: "50% 100%" }}>
        <circle cx="37" cy="22" r="26" fill={`url(#${id}g)`} className="f-glow" />
        <g className="f-flicker">
          <path d="M37 4C43 15 48 21 46 30 44 39 30 39 28 30 26 21 33 15 37 4Z" fill={`url(#${id}f)`} />
          <path d="M37 18C40 23 42 26 41 31 40 36 34 36 33 31 32 26 35 23 37 18Z" fill="#FFF8D6" />
        </g>
      </motion.g>
      <path d="M36 36v5" stroke="#3B1A08" strokeWidth="2" strokeLinecap="round" />
      <path d="M5 40C6 58 22 66 36 66 50 66 64 58 68 40 58 34 56 44 36 44 16 44 13 34 5 40Z" fill={`url(#${id}c)`} />
      <path d="M5 40C13 34 16 44 36 44 56 44 58 34 68 40 60 47 50 49 36 49 22 49 12 47 5 40Z" fill="#FFB547" />
      {[14, 25, 36, 47, 58].map((x, i) => (
        <circle key={x} cx={x} cy={i === 0 || i === 4 ? 53 : i === 2 ? 58 : 56} r="2" fill="#FFE6A8" />
      ))}
    </svg>
  );
}

// A water gun in Holi's colours, pointing right. `firing` pushes the plunger in.
export function Pichkari({ firing }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 128 48" className="block h-full w-full overflow-visible" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}b`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FF6FB5" />
          <stop offset="0.55" stopColor="#E11D74" />
          <stop offset="1" stopColor="#9D174D" />
        </linearGradient>
        <linearGradient id={`${id}n`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFE27A" />
          <stop offset="1" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
      <g className={firing ? "f-plunger f-plunger-on" : "f-plunger"}>
        <rect x="6" y="20" width="32" height="8" rx="2" fill="#94A3B8" />
        <rect x="1" y="8" width="9" height="32" rx="4.5" fill="#7C3AED" />
      </g>
      <rect x="34" y="11" width="58" height="26" rx="11" fill={`url(#${id}b)`} />
      <rect x="40" y="15" width="44" height="4" rx="2" fill="#fff" opacity="0.4" />
      {[50, 64, 78].map((x, i) => (
        <rect key={x} x={x} y="11" width="5" height="26" fill={["#22C55E", "#FFD23F", "#06B6D4"][i]} />
      ))}
      <path d="M90 14 112 20.5v7L90 34Z" fill={`url(#${id}n)`} />
      <rect x="111" y="21" width="8" height="6" rx="1.5" fill="#7C3AED" />
    </svg>
  );
}

const Dandiya = () => (
  <svg viewBox="0 0 64 64" className="f-spin block h-full w-full" aria-hidden="true">
    <g strokeLinecap="round">
      <path d="M14 54 50 10" stroke="#B91C1C" strokeWidth="6" />
      <path d="M50 54 14 10" stroke="#7E22CE" strokeWidth="6" />
      <path d="M21 45.500 25 40.500M33 31 37 26M43 18.500 46 15" stroke="#FFD23F" strokeWidth="6" />
      <path d="M43 45.500 39 40.500M31 31 27 26M21 18.500 18 15" stroke="#FFB703" strokeWidth="6" />
    </g>
  </svg>
);

const Lotus = () => (
  <svg viewBox="0 0 72 64" className="block h-full w-full overflow-visible" aria-hidden="true">
    <circle cx="36" cy="30" r="26" fill="#FFD56A" opacity="0.25" className="f-glow" />
    {[-60, -30, 30, 60].map((r) => (
      <path key={r} d="M36 50C26 40 26 22 36 10 46 22 46 40 36 50Z" fill={Math.abs(r) === 60 ? "#FDA4AF" : "#FB7185"} transform={`rotate(${r} 36 50)`} />
    ))}
    <path d="M36 50C26 40 26 18 36 6 46 18 46 40 36 50Z" fill="#F43F5E" />
    <path d="M12 54C22 62 50 62 60 54 50 50 22 50 12 54Z" fill="#22A06B" />
  </svg>
);

const Rakhi = () => (
  <svg viewBox="0 0 64 64" className="f-spin-slow block h-full w-full" aria-hidden="true">
    <path d="M2 34C12 28 22 30 26 32M62 34C52 28 42 30 38 32" stroke="#E11D48" strokeWidth="3.500" fill="none" strokeLinecap="round" />
    {Array.from({ length: 10 }, (_, i) => (
      <ellipse key={i} cx="32" cy="16" rx="5" ry="9" fill={i % 2 ? "#FBBF24" : "#FB7185"} transform={`rotate(${i * 36} 32 32)`} />
    ))}
    <circle cx="32" cy="32" r="9" fill="#BE123C" />
    <circle cx="32" cy="32" r="4.500" fill="#FDE68A" />
  </svg>
);

// A flag on its way up the pole.
const Flag = () => (
  <svg viewBox="0 0 72 54" className="block h-full w-full overflow-visible" aria-hidden="true">
    <g className="f-wave">
      <rect x="6" y="4" width="60" height="15" fill="#FF9933" />
      <rect x="6" y="19" width="60" height="15" fill="#FFFFFF" />
      <rect x="6" y="34" width="60" height="15" fill="#138808" />
      <circle cx="36" cy="26.500" r="6" fill="none" stroke="#000080" strokeWidth="1.400" />
      {Array.from({ length: 12 }, (_, i) => (
        <line key={i} x1="36" y1="26.500" x2="36" y2="20.500" stroke="#000080" strokeWidth="0.700" transform={`rotate(${i * 30} 36 26.500)`} />
      ))}
    </g>
    <rect x="3" y="0" width="3.500" height="54" rx="1.700" fill="#8A8F98" />
  </svg>
);

const Kite = () => (
  <svg viewBox="0 0 64 80" className="f-bob block h-full w-full overflow-visible" aria-hidden="true">
    <path d="M32 2 60 32 32 62 4 32Z" fill="#FB7185" />
    <path d="M32 2 60 32H4Z" fill="#FBBF24" />
    <path d="M32 2V62M4 32H60" stroke="#7C2D12" strokeWidth="1.300" />
    <path d="M32 62C26 68 38 72 32 78" stroke="#0E7490" strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M26 72 32 70 26 66ZM38 76 32 74 38 70Z" fill="#34D399" />
  </svg>
);

const Crescent = () => (
  <svg viewBox="0 0 64 64" className="block h-full w-full overflow-visible" aria-hidden="true">
    <circle cx="30" cy="32" r="28" fill="#F5D67A" opacity="0.2" className="f-glow" />
    <path d="M42 8A25 25 0 1 0 42 56 20 20 0 1 1 42 8Z" fill="#F5D67A" />
    <path d="M48 20l2.400 6.300 6.700.3-5.200 4.200 1.800 6.500-5.700-3.700-5.700 3.700 1.800-6.500-5.200-4.200 6.700-.3Z" fill="#FFF7D1" />
  </svg>
);

const Bauble = () => (
  <svg viewBox="0 0 64 72" className="f-bob block h-full w-full overflow-visible" aria-hidden="true">
    <circle cx="32" cy="44" r="25" fill="#DC2626" />
    <path d="M9 38C20 44 44 44 55 38M8 50C20 56 44 56 56 50" stroke="#FCD34D" strokeWidth="3" fill="none" />
    <circle cx="23" cy="34" r="6" fill="#fff" opacity="0.4" />
    <rect x="26" y="12" width="12" height="9" rx="2" fill="#FCD34D" />
    <path d="M32 12C26 2 38 2 32 12Z" fill="none" stroke="#FCD34D" strokeWidth="2.400" />
  </svg>
);

const Rocket = () => (
  <svg viewBox="0 0 56 84" className="block h-full w-full overflow-visible" aria-hidden="true">
    <path d="M28 2C42 16 44 40 40 56H16C12 40 14 16 28 2Z" fill="#F472B6" />
    <path d="M28 2C35 9 39 18 41 28H15C17 18 21 9 28 2Z" fill="#FDE68A" />
    <circle cx="28" cy="36" r="6.500" fill="#1E1B4B" stroke="#FDE68A" strokeWidth="2" />
    <path d="M16 44 4 62 17 56ZM40 44 52 62 39 56Z" fill="#7C3AED" />
    <path d="M20 58C20 68 28 82 28 82 28 82 36 68 36 58Z" fill="#FFB000" className="f-flicker" />
  </svg>
);

export const RIDERS = { dandiya: Dandiya, lotus: Lotus, rakhi: Rakhi, flag: Flag, kite: Kite, crescent: Crescent, bauble: Bauble, rocket: Rocket };
