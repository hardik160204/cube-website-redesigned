// The companies Cube already works with: exactly the client logos the site carries, nothing else.
// A review is shown only where the site already had that company's words; add a `review` here when a
// client gives one, and it appears on the homepage and the Client Voices page.
export const CLIENTS = [
  {
    name: "Yatra",
    logo: "/Yatra.png",
    sector: "Travel",
    review: {
      author: "Rajesh Kumar",
      role: "Head of Customer Operations",
      quote:
        "Cube Software transformed our high-volume booking support lines. Their predictive dialer and multi-level IVRS deployment cut our customer wait times down by over 45% during peak holiday booking surges. The support from the team has been extraordinary.",
    },
  },
  {
    name: "Religare",
    logo: "/1.jpg",
    sector: "Financial services",
    review: {
      author: "Amitabh Sen",
      role: "Chief Risk Officer",
      quote:
        "Compliance and tamper-proof audit trails are non-negotiable in financial lending. Cube's encrypted voice logging and secure database retrieval have made regulatory audits completely effortless for us. A highly secure and dependable solution.",
    },
  },
  { name: "EaseMyTrip", logo: "/2.png", sector: "Travel" },
  { name: "SwipeLoan", logo: "/4.png", sector: "Lending" },
  { name: "MIBS", logo: "/5.jpeg" },
  { name: "Smart City Bhopal", logo: "/6.png", sector: "Government" },
  { name: "MTNL", logo: "/7.png", sector: "Telecom" },
  { name: "UPSC", logo: "/upsc.png", sector: "Government" },
  { name: "CARS24", logo: "/cars24.png", sector: "Automotive" },
];


export const CLIENT_LOGOS = CLIENTS.map((c) => c.logo);

// Technology partners whose systems Cube works with.
export const PARTNER_LOGOS = ["/10.png", "/11.png", "/Avaya.jpeg", "/DigiCon.png", "/Fusion.png", "/Mitel.png", "/ABSIndia.png"];
