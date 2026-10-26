import React from "react";
import { Activity, ArrowUpRight, BarChart, BellRing, Clock, Download, Ear, Eye, Filter, LineChart, Monitor, PieChart, ShieldCheck, Target, Users } from "lucide-react";
import FlexPage, { Hi } from "../components/page/FlexPage";

// Page copy, section by section, exactly as it was; FlexPage lays it out in the site's style.
const SECTIONS = [
  {
    kind: "hero",
    title: <>{"Real-Time "}<Hi>Live Analytics</Hi></>,
    body: [
      "Turn your call data into actionable insights. Monitor live queues, track agent performance, and visualize comprehensive reporting dashboards to make data-driven decisions instantly.",
    ],
    image: "/analytics-hero-vector.svg", imageAlt: "Real-Time Analytics",
    button: "View Live Dashboard",
  },
  {
    title: <>{"Stop Guessing, "}<Hi>Start Measuring</Hi></>,
    body: [
      "Live Analytics provides supervisors and management with an instant, bird's-eye view of your entire communications infrastructure. From active calls in the queue to individual agent statuses, everything is visualized in real-time.",
      "By converting raw telephony data into intuitive charts and graphs, our dashboard allows you to identify bottlenecks immediately, monitor Service Level Agreements (SLAs), and dynamically allocate resources before customer wait times increase.",
    ],
    tiles: [{ icon: Activity, label: "Real-Time" }, { icon: Monitor, label: "Wallboards" }, { icon: BarChart, label: "Custom KPIs" }, { icon: Download, label: "Auto-Export" }],
  },
  {
    title: <>{"How do "}<Hi>businesses</Hi>{" use Live Analytics?"}</>,
    cards: [
      { icon: Target, title: "SLA Monitoring", desc: "Track average speed of answer (ASA) and first-call resolution (FCR) in real-time to ensure your team is hitting their daily service level targets." },
      { icon: Users, title: "Agent Performance Tracking", desc: "Monitor individual metrics such as total talk time, average handle time (AHT), and idle duration to identify top performers and those needing coaching." },
      { icon: ArrowUpRight, title: "Campaign ROI Analysis", desc: "Compare the call volumes and conversion rates of different virtual numbers to determine which marketing campaigns yield the best ROI." },
      { icon: Ear, title: "Live QA & Coaching", desc: "Supervisors can use the live dashboard to silently monitor active calls, whisper coaching advice to the agent, or barge in to save a critical interaction." },
      { icon: Clock, title: "Peak Hour Staffing", desc: "Analyze historical heatmaps of call volumes by hour and day of the week to accurately forecast and schedule agent shifts." },
      { icon: LineChart, title: "Call Abandonment Analysis", desc: "Identify exactly how long customers wait before hanging up. Use this data to optimize IVR menus, queue music, and routing efficiency." },
    ],
  },
  {
    title: "How It Works",
    cards: [
      { title: "Instant Data Capture", desc: "Every time a call connects, rings, holds, or drops, our cloud servers capture the event data with millisecond precision." },
      { title: "Real-Time Processing", desc: "The analytics engine aggregates this massive stream of data, calculating complex metrics like averages and percentages instantly." },
      { title: "Visual Dashboard Display", desc: "The processed data is pushed directly to your web-based wallboards and reporting grids, updating live without requiring a page refresh." },
    ],
    steps: true,
  },
  {
    title: <>{"Why choose our "}<Hi>Reporting Suite?</Hi></>,
    cards: [
      { icon: Monitor, title: "Custom Wallboards", desc: "Design specific layouts to cast on large TV screens on your call center floor. Motivate teams with live leaderboards and critical queue alerts." },
      { icon: Ear, title: "Whisper, Snoop & Barge", desc: "Supervisors can click on any live call to listen silently (Snoop), speak only to the agent (Whisper), or join a 3-way conference (Barge-in)." },
      { icon: Filter, title: "Granular Filtering", desc: "Slice and dice your data. Filter reports by specific date ranges, agent groups, geographic regions, or specific DID numbers." },
      { icon: BellRing, title: "Threshold Alerts", desc: "Set custom trigger rules. Receive an instant SMS or Email notification if hold times exceed 5 minutes or if too many agents go on break simultaneously." },
      { icon: ShieldCheck, title: "Role-Based Access", desc: "Control who sees what. Grant managers full administrative access while restricting standard agents to only view their own individual performance metrics." },
      { icon: Download, title: "Automated Export & APIs", desc: "Schedule end-of-day reports to be emailed automatically as PDFs or Excel files, or use our Analytics API to pull raw data into PowerBI or Tableau." },
    ],
  },
  {
    title: <>{"Comprehensive "}<Hi>Reporting Views</Hi></>,
    cards: [
      { icon: Users, title: "Agent Status Dashboard", desc: "A live color-coded view showing exactly what every agent is doing right now (On Call, Available, Wrap-up, Break) and their individual talk time for the day." },
      { icon: Eye, title: "Live Queue Monitor", desc: "Monitor the pulse of your call center. See exactly how many callers are currently waiting in line, the longest wait time, and the real-time abandonment rate." },
      { icon: PieChart, title: "Historical Campaign Reports", desc: "Generate deep historical insights over weeks or months. Analyze geographic trends, call outcome dispositions, and overall connection ratios." },
    ],
  },
  {
    kind: "cta",
    title: "Ready to visualize your success?",
    body: [
      "Stop relying on guesswork. Empower your managers with the real-time data they need to optimize performance and elevate your customer experience.",
    ],
    button: "Explore Dashboard Features",
  },
];

export default function CloudLiveAnalyticsPage() {
  return <FlexPage sections={SECTIONS} />;
}
