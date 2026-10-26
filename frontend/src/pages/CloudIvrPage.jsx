import React from "react";
import { BarChart, Bell, CheckCircle2, Clock, Database, FileText, Globe, Landmark, Maximize, MessageSquare, Mic, Network, PhoneForwarded, PhoneOutgoing, Users } from "lucide-react";
import FlexPage, { Hi } from "../components/page/FlexPage";
import { IvrDiagram, IvrSavings } from "../components/page/IvrBlocks";

// Page copy, section by section, exactly as it was; FlexPage lays it out in the site's style.
const SECTIONS = [
  {
    kind: "hero",
    scene: "ivr",
    title: <>{"Interactive Voice Response "}<Hi>(IVR) System</Hi></>,
    body: [
      "Give every caller a fast, professional, and personalized start with Cube Software’s intelligent IVR solutions Route calls efficiently, reduce wait times, and ensure customers reach the right team—every time.",
    ],
    image: "/ivr-hero-illustration.png", imageAlt: "Interactive Voice Response (IVR) Illustration",
    button: "Free Trial",
  },
  {
    title: <>{"How do businesses use "}<Hi>IVRS?</Hi></>,
    body: [
      "IVRs help businesses create a convenient, interactive experience for customers by routing calls, answering common questions, and providing self-service options.",
    ],
    cards: [
      { icon: BarChart, title: "Improve efficiency", desc: "Automating your calls via an IVR system not only helps in streamlining your processes but also provides your staff the freedom to focus on other important activities." },
      { icon: Database, title: "Automated checking for order status", desc: "Tracking orders is easier than ever with the new IVR technology. Customers can track their orders by calling the provided contact number and punching in their user ID." },
      { icon: Users, title: "Better customer experience", desc: "Our IVR system comes with a smart feature that helps in better matching of customers with related domain experts. This helps in providing a customized user experience." },
      { icon: Clock, title: "Be available after hours", desc: "In case your company does not have a 24*7 customer support, you can set up an IVR system to respond to calls received during hours of unavailability." },
      { icon: CheckCircle2, title: "Cash on delivery verification", desc: "Providing cash on delivery without order verification can lead to huge expenses for the company. Switch to a simple IVR system for order verification." },
      { icon: Mic, title: "For local language interaction", desc: "Language inclusivity is one of the most selling features of an IVR system. Customers from different regions can get the same support without language barriers." },
    ],
  },
  {
    title: "How It Works",
    body: [
      "A hassle-free process that guarantees immediate consumer attention in a few simple steps.",
    ],
    cards: [
      { title: "Customer dials a business phone number", desc: "The customer dials a business phone number either on your ad, website, or application." },
      { title: "System plays a custom greeting", desc: "The IVR answers instantly and plays your tailored welcome message or options." },
      { title: "The request gets processed", desc: "For example, the customer gets connected to a support expert or gets the details of their account balance." },
    ],
    steps: true,
  },
  {
    title: <>{"Why is an IVR number essential "}<Hi>for your Business?</Hi></>,
    cards: [
      { icon: Network, title: "Smart call routing", desc: "IVR systems can be used to smartly route your calls in a time-based and team-based manner." },
      { icon: Mic, title: "Sound professional", desc: "Every customer gets a prime user experience with a clear and concise welcome greeting." },
      { icon: PhoneForwarded, title: "Route calls with ease", desc: "Just dial press in a few keys to get directed to your desired channel." },
      { icon: Globe, title: "Support remote working", desc: "Work in any region without worry with Cube's IVR Number." },
      { icon: Maximize, title: "Scale with ease", desc: "The Cube's IVR comes with a choice of adding/ removing agents at the click of a button. You can also use it to scale your calls without any worries!" },
      { icon: BarChart, title: "Reports and analytics", desc: "Real-time agent-wise reporting and call analytics." },
      { icon: Landmark, title: "Ivr Service for banking", desc: "The financial sector is changing at a faster pace, with customer expectations changing dramatically." },
    ],
  },
  { render: <IvrSavings key="savings" /> },
  {
    title: <>{"Integrate our IVR system with both "}<Hi>inbound and outbound calls</Hi></>,
    cards: [
      { icon: Bell, title: "Inbound calls", desc: "Inbound IVR systems are largely in demand for customer support, order tracking, and related domains. They can be used to reroute the call to the right department, to send information via SMS, and more." },
      { icon: PhoneOutgoing, title: "Outbound calls", desc: "IVRs can also be used for outbound calls, meaning that an automated message is played when the person on the other end responds. These messages can be used to accept input responses from the user. They are largely used for feedback systems and surveys." },
    ],
  },
  { render: <IvrDiagram key="diagram" /> },
  {
    title: <>{"What are you able to use "}<Hi>IVR Automation</Hi>{" for?"}</>,
    cards: [
      { icon: Users, title: "Large Scale Employment Drive", desc: "Large-scale hiring can be streamlined super easily with the help of IVR systems. These can be used to perform the initial screening of candidates, thus saving the efforts of the recruiting team." },
      { icon: MessageSquare, title: "Customer Feedback", desc: "IVR is one of the most efficient techniques for collecting feedback. It gives the consumers the agency of language choices, while also saving the staff from repetitive tasks. You can make your business better by knowing what your customers want." },
      { icon: FileText, title: "Surveys for Market Research", desc: "IVRs can be used to conduct efficient surveys with minimum efforts. You can survey a larger demographic in a short span of time with minimal human labor. A larger data set can then be used to establish better trends." },
    ],
  },
];

export default function CloudIvrPage() {
  return <FlexPage sections={SECTIONS} />;
}
