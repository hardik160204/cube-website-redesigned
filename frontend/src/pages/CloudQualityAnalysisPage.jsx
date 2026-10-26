import React from "react";
import { BarChart, Bot, CheckCircle2, Ear, FileText, Headset, LineChart, ListChecks, MessageSquare, ShieldCheck, Star, Target, Users } from "lucide-react";
import FlexPage, { Hi } from "../components/page/FlexPage";

// Page copy, section by section, exactly as it was; FlexPage lays it out in the site's style.
const SECTIONS = [
  {
    kind: "hero",
    title: <><Hi>Quality Analysis</Hi></>,
    body: [
      "Ensure every conversation meets your highest standards. Evaluate agent performance, ensure compliance, and deliver actionable coaching using comprehensive call scoring and analytics.",
    ],
    image: "/qa-hero-vector.svg", imageAlt: "Quality Analysis",
    button: "Start Evaluating",
  },
  {
    title: <>{"Elevate Your "}<Hi>Customer Experience</Hi></>,
    body: [
      "Quality Analysis (QA) is the systematic process of reviewing, scoring, and analyzing customer interactions across your call center to ensure agents are delivering optimal service and adhering to company policies.",
      "By using custom evaluation forms, audio playback, and analytics, QA managers can identify knowledge gaps, correct behavioral issues, and provide targeted coaching to transform average agents into top performers.",
    ],
    tiles: [{ icon: Ear, label: "Listen" }, { icon: ListChecks, label: "Score" }, { icon: Target, label: "Coach" }, { icon: BarChart, label: "Improve" }],
  },
  {
    title: <>{"How do "}<Hi>businesses</Hi>{" use QA Software?"}</>,
    cards: [
      { icon: ShieldCheck, title: "Compliance Verification", desc: "Ensure agents are reading mandatory legal disclaimers, verifying customer identities correctly, and maintaining strict industry compliance." },
      { icon: FileText, title: "Script Adherence", desc: "Score agents on whether they followed the designated sales or support script, ensuring a consistent brand voice across all interactions." },
      { icon: Target, title: "Targeted Coaching", desc: "Identify specific weaknesses (like poor objection handling or lack of empathy) and create personalized coaching plans for individual agents." },
      { icon: Star, title: "Performance Appraisals", desc: "Use objective, data-driven QA scores to determine agent bonuses, promotions, or the need for additional training." },
      { icon: MessageSquare, title: "Customer Sentiment", desc: "Analyze how customers react to certain phrases or policies to refine company-wide messaging and improve customer satisfaction." },
      { icon: Users, title: "Onboarding New Hires", desc: "Play highly-scored benchmark calls to trainees to demonstrate what a 'perfect call' sounds like during the onboarding process." },
    ],
  },
  {
    title: "How It Works",
    cards: [
      { title: "Call Sampling & Selection", desc: "The system automatically records all calls and intelligently selects a random or filtered sample for the QA team to review." },
      { title: "Review & Scorecard Evaluation", desc: "The QA analyst listens to the audio while simultaneously filling out a customized digital evaluation scorecard on the dashboard." },
      { title: "Feedback & Agent Sign-Off", desc: "The final score and notes are pushed to the agent's dashboard. The agent reviews the feedback, acknowledges it, and applies the coaching." },
    ],
    steps: true,
  },
  {
    title: <>{"Why choose our "}<Hi>QA Platform?</Hi></>,
    cards: [
      { icon: ListChecks, title: "Customizable Scorecards", desc: "Build unique evaluation forms with weighted questions, yes/no toggles, and drop-down criteria tailored to different departments." },
      { icon: Ear, title: "Live Call Barging & Whisper", desc: "Don't wait for the recording. Supervisors can silently monitor live calls and whisper instructions to agents without the customer hearing." },
      { icon: LineChart, title: "Trend Analytics", desc: "Track agent performance over time. View visual heatmaps of common failure points across your entire floor to adjust training protocols." },
      { icon: MessageSquare, title: "In-Line Annotations", desc: "Leave time-stamped comments directly on the audio waveform so agents know exactly which part of the conversation needs improvement." },
      { icon: CheckCircle2, title: "Calibration Workflows", desc: "Ensure all QA analysts score consistently. Have multiple supervisors grade the same call and compare results to standardize your quality benchmarks." },
      { icon: Bot, title: "Automated Sampling", desc: "Instead of searching manually, set the system to auto-assign 5 random calls per agent per week directly to the QA team's queue." },
    ],
  },
  {
    title: <>{"Methods of "}<Hi>Evaluation</Hi></>,
    cards: [
      { icon: Headset, title: "Manual QA", desc: "The traditional approach where a human supervisor listens to call recordings, assesses tone and empathy, and manually scores the interaction using a digital form." },
      { icon: Bot, title: "AI-Automated QA", desc: "Utilize AI to transcribe calls and automatically flag compliance violations, measure sentiment, and score 100% of interactions without human intervention." },
      { icon: Users, title: "Peer & Self Review", desc: "Allow agents to listen to and score their own calls, or blindly score their peers. This builds self-awareness and fosters a collaborative coaching environment." },
    ],
  },
  {
    kind: "cta",
    title: "Ready to standardize your service quality?",
    body: [
      "Stop relying on guesswork. Use data-driven scorecards to coach your team, ensure compliance, and deliver exceptional experiences on every call.",
    ],
    button: "Start Building Scorecards",
  },
];

export default function CloudQualityAnalysisPage() {
  return <FlexPage sections={SECTIONS} />;
}
