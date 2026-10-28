import { useEffect, useState } from "react";
import { api } from "./api";

// Content managed in the admin's "Team & social links" page. Until something is saved there, the server
// returns null for it and the site shows the built-in defaults below.

// The leadership cards on Meet Our Team. Images are site paths or uploaded-image URLs; linkedin "" = none yet.
export const DEFAULT_TEAM = [
  {
    name: "Rajeev Varshney",
    role: "Chief Technical Officer",
    image: "/rajeev-sir-image.webp",
    bio: "The architect behind our robust, highly scalable, zero-downtime cloud infrastructure. Rajeev leads our core R&D initiatives, pushing the boundaries of AI-driven telecommunications.",
    linkedin: "",
  },
  {
    name: "Vivek Gupta",
    role: "Chief Operating Officer",
    image: "/vivek-sir-image.webp",
    bio: "Mastermind behind our seamless day-to-day operations and unmatched customer success delivery. Vivek streamlines cross-functional team efficiencies to ensure rapid product deployment.",
    linkedin: "https://www.linkedin.com/in/vivek-gupta-056b5230",
  },
  {
    name: "Surendra Kumar",
    role: "Head Of Finance Department",
    image: "/surendar-sir-image.webp",
    bio: "Crafting our global brand narrative and expanding our market footprint. Anita leverages data-driven digital strategies to position Cube Software as the undisputed leader in cloud telephony.",
    linkedin: "",
  },
  {
    name: "Imran Ahmad",
    role: "VP Direct Sales",
    image: "/imran-sir-image.webp",
    bio: "Building lasting relationships with Fortune 500 clients. Ravi leads our high-performance global sales organization, tailoring complex communication architectures to meet specific client needs.",
    linkedin: "",
  },
  ...Array.from({ length: 5 }, () => ({ name: "Name to be added", role: "Role to be announced", image: "", bio: "", linkedin: "" })),
];

// Footer social links; empty ones are hidden.
export const SOCIAL_KEYS = [
  ["facebook", "Facebook"],
  ["linkedin", "LinkedIn"],
  ["instagram", "Instagram"],
  ["youtube", "YouTube"],
  ["x", "X (Twitter)"],
];
export const DEFAULT_SOCIALS = {
  facebook: "https://www.facebook.com/CSPLNOIDA/",
  linkedin: "https://www.linkedin.com/company/cube-software-private-limited-cspl-/",
  instagram: "",
  youtube: "",
  x: "",
};

let cache = null;
let pending = null;
export function useSiteData() {
  const [data, setData] = useState(cache);
  useEffect(() => {
    if (cache) return undefined;
    let live = true;
    (pending ||= api("/site").catch(() => ({}))).then((d) => {
      cache = d;
      if (live) setData(d);
    });
    return () => {
      live = false;
    };
  }, []);
  return { team: data?.team || DEFAULT_TEAM, socials: data?.socials || DEFAULT_SOCIALS };
}
