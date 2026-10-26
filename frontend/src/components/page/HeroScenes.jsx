import React, { useId } from "react";
import { useReducedMotion } from "framer-motion";
import {
  BarChart3, Bot, Clock, Cloud, Database, EyeOff, GitMerge, Globe, Hash, Headset, Landmark, Lock, MapPin, MessageCircle,
  MessageSquare, Mic, Monitor, Phone, PhoneCall, PhoneIncoming, PhoneOutgoing, PlayCircle, Search, ShieldCheck,
  Shuffle, Smartphone, User, UserCheck, Users, Zap, ListChecks, Voicemail, RotateCcw, Upload, Megaphone,
  MousePointerClick, MonitorPlay, Workflow, PhoneMissed, FileText,
} from "lucide-react";
import { ACCENTS } from "./kit";

// Animated hero diagrams, one per page that has no picture of its own. Each scene is a hub (what the
// product does) with the things around it; lights travel the connectors, rings pulse out of the hub and
// the cards drift. Native SVG animation (predetermined loops); reduced motion gets the still diagram.
const W = 520;
const H = 440;
const C = { x: 260, y: 200 }; // hub centre
const HUB = 132;
const NODE_W = 170;
const NODE_H = 54;

const n = (icon, label, x, y) => ({ icon, label, x, y });

export const SCENES = {
  "auto-dialer": {
    hub: { icon: PhoneOutgoing, label: "Predictive dialer" },
    nodes: [n(ListChecks, "Lead list", 90, 140), n(Database, "CRM leads", 90, 270), n(Headset, "Free agent", 430, 90), n(Voicemail, "Machine detected", 430, 200), n(RotateCcw, "Retry later", 430, 310)],
    from: [0, 1],
  },
  "bulk-voice": {
    hub: { icon: Megaphone, label: "Broadcast" },
    nodes: [n(Mic, "Record once", 90, 140), n(Upload, "Upload list", 90, 270), n(Smartphone, "Delivered", 430, 90), n(Hash, "Press 1", 430, 200), n(BarChart3, "Campaign report", 430, 310)],
    from: [0, 1],
    wave: true,
  },
  "click-to-call": {
    hub: { icon: PhoneCall, label: "Click to call" },
    nodes: [n(MousePointerClick, "Visitor clicks", 90, 200), n(Headset, "Agent rings", 430, 120), n(Smartphone, "Visitor rings", 430, 280)],
    from: [0],
  },
  crm: {
    hub: { icon: Database, label: "CRM sync" },
    nodes: [n(PhoneIncoming, "Cloud calls", 90, 140), n(MonitorPlay, "Screen-pop", 90, 270), n(Cloud, "Salesforce", 430, 90), n(Cloud, "HubSpot", 430, 200), n(Cloud, "Zoho", 430, 310)],
    from: [0],
    both: true,
  },
  ivr: {
    hub: { icon: Workflow, label: "IVR menu" },
    nodes: [n(PhoneIncoming, "Caller dials", 90, 140), n(Mic, "Call recording", 90, 270), n(Users, "1 · Sales", 430, 90), n(Clock, "2 · 24/7 Support", 430, 200), n(FileText, "3 · Billing", 430, 310)],
    from: [0],
  },
  "missed-call": {
    hub: { icon: PhoneMissed, label: "Zero-cost ring" },
    nodes: [n(Smartphone, "Customer dials", 90, 200), n(MessageSquare, "Auto SMS", 430, 90), n(PhoneCall, "Callback", 430, 200), n(Database, "Lead in CRM", 430, 310)],
    from: [0],
  },
  "call-recording": {
    hub: { icon: Mic, label: "Recording" },
    nodes: [n(PhoneIncoming, "Inbound call", 90, 120), n(PhoneOutgoing, "Outbound call", 90, 280), n(Lock, "Encrypted", 430, 90), n(Database, "Cloud archive", 430, 200), n(PlayCircle, "Playback", 430, 310)],
    from: [0, 1],
    wave: true,
  },
  "number-masking": {
    hub: { icon: ShieldCheck, label: "Masked number" },
    nodes: [n(User, "Customer", 90, 200), n(Headset, "Agent", 430, 200), n(EyeOff, "Real ID hidden", 160, 60), n(Lock, "Secure bridge", 360, 60)],
    from: [0],
    both: true,
  },
  "smart-call-routing": {
    hub: { icon: GitMerge, label: "Routing rules" },
    nodes: [n(PhoneIncoming, "Incoming call", 90, 200), n(Headset, "Skill-based", 430, 90), n(Clock, "Time-based", 430, 200), n(Users, "Team-based", 430, 310)],
    from: [0],
  },
  "virtual-number": {
    hub: { icon: Hash, label: "Virtual number" },
    nodes: [n(MapPin, "Local city code", 90, 140), n(Cloud, "Cloud hosted", 90, 270), n(Smartphone, "Mobile phone", 430, 90), n(Phone, "Landline", 430, 200), n(Monitor, "IP device", 430, 310)],
    from: [0, 1],
  },
  "toll-free": {
    hub: { icon: PhoneCall, label: "1800 number" },
    nodes: [n(Users, "Callers", 90, 200), n(Headset, "Your team", 430, 120), n(BarChart3, "Call reports", 430, 280)],
    from: [0],
  },
  "web-chat-bot": {
    hub: { icon: Bot, label: "Chat bot" },
    nodes: [n(Globe, "Website visitor", 90, 200), n(MessageSquare, "Instant answers", 430, 90), n(Headset, "Live agent", 430, 200), n(Database, "CRM sync", 430, 310)],
    from: [0],
    chat: true,
  },
  whatsapp: {
    hub: { icon: Bot, label: "WhatsApp bot" },
    nodes: [n(MessageCircle, "WhatsApp", 90, 200), n(Zap, "Instant replies", 430, 90), n(Headset, "Live agent", 430, 200), n(Database, "CRM sync", 430, 310)],
    from: [0],
    chat: true,
  },
  prison: {
    hub: { icon: ShieldCheck, label: "Secure gateway" },
    nodes: [n(User, "Inmate", 90, 140), n(UserCheck, "Voice biometrics", 90, 270), n(Users, "Approved numbers", 430, 90), n(Mic, "Monitored", 430, 200), n(Landmark, "Prepaid wallet", 430, 310)],
    from: [0, 1],
  },
  student: {
    hub: { icon: ShieldCheck, label: "Campus gateway" },
    nodes: [n(User, "Student", 90, 140), n(Clock, "Hour lockouts", 90, 270), n(Users, "Parents", 430, 90), n(PhoneIncoming, "Emergency line", 430, 200), n(Landmark, "Prepaid wallet", 430, 310)],
    from: [0, 1],
  },
};

// Connector from a node's inner edge to the hub's facing side, with horizontal tangents.
const link = (nd) => {
  const left = nd.x < C.x;
  const top = nd.y < C.y - HUB / 2 && Math.abs(nd.x - C.x) < 160;
  const x1 = top ? nd.x : left ? nd.x + NODE_W / 2 : nd.x - NODE_W / 2;
  const y1 = top ? nd.y + NODE_H / 2 : nd.y;
  const x2 = top ? nd.x : left ? C.x - HUB / 2 : C.x + HUB / 2;
  const y2 = top ? C.y - HUB / 2 : C.y;
  if (top) return `M ${x1} ${y1} C ${x1} ${y1 + 30}, ${C.x + (nd.x - C.x) * 0.4} ${y2 - 30}, ${C.x + (nd.x - C.x) * 0.4} ${y2}`;
  const mx = (x1 + x2) / 2;
  return `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
};

function Packet({ d, i, reverse, id }) {
  return (
    <g>
      <circle r="9" fill="#00B8FF" opacity="0.35" filter={`url(#${id}-blur)`}>
        <animateMotion dur="2.6s" begin={`${i * 0.45}s`} repeatCount="indefinite" path={d} keyPoints={reverse ? "1;0" : "0;1"} keyTimes="0;1" calcMode="linear" />
      </circle>
      <circle r="4" fill="#FFFFFF">
        <animateMotion dur="2.6s" begin={`${i * 0.45}s`} repeatCount="indefinite" path={d} keyPoints={reverse ? "1;0" : "0;1"} keyTimes="0;1" calcMode="linear" />
      </circle>
    </g>
  );
}

function NodeCard({ nd, i, reduce }) {
  const Icon = nd.icon;
  const accent = ACCENTS[i % ACCENTS.length];
  return (
    <g>
      {!reduce && <animateTransform attributeName="transform" type="translate" values="0 0; 0 -5; 0 0" dur={`${5 + (i % 3)}s`} begin={`${i * 0.4}s`} repeatCount="indefinite" />}
      <rect x={nd.x - NODE_W / 2} y={nd.y - NODE_H / 2} width={NODE_W} height={NODE_H} rx="16" fill="#130B3E" stroke="rgb(255 255 255 / 0.12)" />
      <rect x={nd.x - NODE_W / 2 + 10} y={nd.y - 15} width="30" height="30" rx="9" fill={accent} />
      <Icon x={nd.x - NODE_W / 2 + 17} y={nd.y - 8} width="16" height="16" color="#FFFFFF" strokeWidth={2.2} />
      <text x={nd.x - NODE_W / 2 + 50} y={nd.y + 5} fontSize="13" fontWeight="500" fill="#FFFFFF">
        {nd.label}
      </text>
    </g>
  );
}

function Hub({ hub, id, reduce }) {
  const Icon = hub.icon;
  return (
    <g>
      {!reduce &&
        [0, 1.2, 2.4].map((b) => (
          <circle key={b} cx={C.x} cy={C.y} r="70" fill="none" stroke="#00B8FF" strokeWidth="1.5" opacity="0">
            <animate attributeName="r" values="70;150" dur="3.6s" begin={`${b}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;0" dur="3.6s" begin={`${b}s`} repeatCount="indefinite" />
          </circle>
        ))}
      <g>
        {!reduce && <animateTransform attributeName="transform" type="rotate" from={`0 ${C.x} ${C.y}`} to={`360 ${C.x} ${C.y}`} dur="24s" repeatCount="indefinite" />}
        <circle cx={C.x} cy={C.y} r="100" fill="none" stroke="rgb(0 184 255 / 0.3)" strokeDasharray="4 8" />
        <circle cx={C.x} cy={C.y - 100} r="4" fill="#FF0000" />
        <circle cx={C.x + 100} cy={C.y} r="3" fill="#00B8FF" />
      </g>
      <rect x={C.x - HUB / 2 - 8} y={C.y - HUB / 2 - 8} width={HUB + 16} height={HUB + 16} rx="40" fill="#0047FF" opacity="0.25" filter={`url(#${id}-blur)`} />
      <rect x={C.x - HUB / 2} y={C.y - HUB / 2} width={HUB} height={HUB} rx="34" fill={`url(#${id}-hub)`} />
      <rect x={C.x - HUB / 2} y={C.y - HUB / 2} width={HUB} height={HUB} rx="34" fill="none" stroke="rgb(255 255 255 / 0.35)" />
      <Icon x={C.x - 24} y={C.y - 40} width="48" height="48" color="#FFFFFF" strokeWidth={1.8} />
      <text x={C.x} y={C.y + 38} textAnchor="middle" fontSize="14" fontWeight="600" fill="#FFFFFF">
        {hub.label}
      </text>
    </g>
  );
}

// Voice waveform under the hub (recording).
function Wave({ reduce }) {
  return (
    <g>
      {Array.from({ length: 22 }, (_, i) => {
        const x = C.x - 110 + i * 10.5;
        const h = 8 + ((i * 7) % 22);
        return (
          <rect key={i} x={x} y={392 - h / 2} width="5" height={h} rx="2.5" fill={i % 3 ? "#00B8FF" : "#3D7BFF"}>
            {!reduce && (
              <>
                <animate attributeName="height" values={`${h};${h * 2.2};${h}`} dur={`${0.9 + (i % 4) * 0.2}s`} repeatCount="indefinite" />
                <animate attributeName="y" values={`${392 - h / 2};${392 - h * 1.1};${392 - h / 2}`} dur={`${0.9 + (i % 4) * 0.2}s`} repeatCount="indefinite" />
              </>
            )}
          </rect>
        );
      })}
    </g>
  );
}

// A chat bubble with a typing indicator under the hub (bots).
function Typing({ reduce }) {
  return (
    <g>
      <rect x={C.x - 46} y={368} width="92" height="40" rx="20" fill="#FFFFFF" />
      {[0, 1, 2].map((k) => (
        <circle key={k} cx={C.x - 18 + k * 18} cy={388} r="5" fill="#0047FF">
          {!reduce && <animate attributeName="opacity" values="0.25;1;0.25" dur="1.2s" begin={`${k * 0.2}s`} repeatCount="indefinite" />}
        </circle>
      ))}
    </g>
  );
}

function Defs({ id }) {
  return (
    <defs>
      <linearGradient id={`${id}-hub`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#00B8FF" />
        <stop offset="0.55" stopColor="#0047FF" />
        <stop offset="1" stopColor="#2300DC" />
      </linearGradient>
      <linearGradient id={`${id}-line`} x1="0" y1="0" x2={W} y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#00B8FF" />
        <stop offset="1" stopColor="#3D7BFF" />
      </linearGradient>
      <filter id={`${id}-blur`} x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="10" />
      </filter>
    </defs>
  );
}

export function HeroScene({ name }) {
  const reduce = useReducedMotion();
  const id = useId().replace(/:/g, "");
  const s = SCENES[name];
  const paths = s.nodes.map(link);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} aria-hidden="true" className="mx-auto h-auto w-full max-w-[500px]">
      <Defs id={id} />
      {paths.map((d, i) => (
        <path key={i} d={d} fill="none" stroke={`url(#${id}-line)`} strokeWidth="2" strokeDasharray="6 6" opacity="0.6">
          {!reduce && <animate attributeName="stroke-dashoffset" values="24;0" dur="1.2s" repeatCount="indefinite" />}
        </path>
      ))}
      <Hub hub={s.hub} id={id} reduce={reduce} />
      {s.wave && <Wave reduce={reduce} />}
      {s.chat && <Typing reduce={reduce} />}
      {s.nodes.map((nd, i) => (
        <NodeCard key={nd.label} nd={nd} i={i} reduce={reduce} />
      ))}
      {!reduce &&
        paths.map((d, i) => (
          <React.Fragment key={i}>
            <Packet d={d} i={i} id={id} reverse={!s.from.includes(i)} />
            {s.both && <Packet d={d} i={i + 2} id={id} reverse={s.from.includes(i)} />}
          </React.Fragment>
        ))}
    </svg>
  );
}

// Contact Center Solution: a live floor. The wallboard carries the page's own figures; inbound, outbound and
// blended calls stream into the ACD, which hands them to a 3×3 floor of agents whose status lights cycle
// (on call, ready, wrap-up) out of step; a live call's waveform runs underneath.
const STATUS = ["#00B8FF", "#3D7BFF", "#FF0000"];
const AGENTS = [0, 1, 2].flatMap((r) => [0, 1, 2].map((c) => ({ x: 412 + c * 54, y: 196 + r * 70 })));
const CHANNELS = [
  { icon: PhoneIncoming, label: "Inbound", y: 196 },
  { icon: PhoneOutgoing, label: "Outbound", y: 266 },
  { icon: Shuffle, label: "Blended", y: 336 },
];
const HUBC = { x: 268, y: 266 };

export function ContactCenterLive({ stats }) {
  const reduce = useReducedMotion();
  const id = useId().replace(/:/g, "");
  const inbound = CHANNELS.map((ch) => `M 150 ${ch.y} C 200 ${ch.y}, 200 ${HUBC.y}, ${HUBC.x - 62} ${HUBC.y}`);
  const outbound = [196, 266, 336].map((y) => `M ${HUBC.x + 62} ${HUBC.y} C 340 ${HUBC.y}, 340 ${y}, 386 ${y}`);
  return (
    <svg viewBox="0 0 560 470" aria-hidden="true" className="mx-auto h-auto w-full max-w-[530px]">
      <Defs id={id} />

      {/* Wallboard */}
      <rect x="16" y="14" width="528" height="86" rx="20" fill="#130B3E" stroke="rgb(255 255 255 / 0.12)" />
      {stats.map((s, i) => (
        <g key={s.label}>
          {i > 0 && <line x1={16 + i * 176} y1="30" x2={16 + i * 176} y2="84" stroke="rgb(255 255 255 / 0.1)" />}
          <text x={104 + i * 176} y="56" textAnchor="middle" fontSize="22" fontWeight="600" fill="#FFFFFF">
            {s.value}
          </text>
          <text x={104 + i * 176} y="78" textAnchor="middle" fontSize="10.5" letterSpacing="1.2" fill="#8FA0C8">
            {s.label.toUpperCase()}
          </text>
        </g>
      ))}
      <circle cx="524" cy="32" r="4" fill="#00B8FF">
        {!reduce && <animate attributeName="opacity" values="1;0.2;1" dur="1.6s" repeatCount="indefinite" />}
      </circle>

      {/* Connectors */}
      {[...inbound, ...outbound].map((d, i) => (
        <path key={i} d={d} fill="none" stroke={`url(#${id}-line)`} strokeWidth="2" strokeDasharray="6 6" opacity="0.55">
          {!reduce && <animate attributeName="stroke-dashoffset" values="24;0" dur="1.2s" repeatCount="indefinite" />}
        </path>
      ))}

      {/* Channels */}
      {CHANNELS.map((ch, i) => {
        const Icon = ch.icon;
        return (
          <g key={ch.label}>
            <rect x="20" y={ch.y - 24} width="130" height="48" rx="15" fill="#130B3E" stroke="rgb(255 255 255 / 0.12)" />
            <rect x="30" y={ch.y - 14} width="28" height="28" rx="8" fill={ACCENTS[i]} />
            <Icon x="37" y={ch.y - 7} width="14" height="14" color="#FFFFFF" strokeWidth={2.2} />
            <text x="68" y={ch.y + 5} fontSize="13" fontWeight="500" fill="#FFFFFF">
              {ch.label}
            </text>
          </g>
        );
      })}

      {/* ACD hub */}
      {!reduce &&
        [0, 1.2, 2.4].map((b) => (
          <circle key={b} cx={HUBC.x} cy={HUBC.y} r="62" fill="none" stroke="#00B8FF" strokeWidth="1.5" opacity="0">
            <animate attributeName="r" values="62;120" dur="3.6s" begin={`${b}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.55;0" dur="3.6s" begin={`${b}s`} repeatCount="indefinite" />
          </circle>
        ))}
      <g>
        {!reduce && <animateTransform attributeName="transform" type="rotate" from={`0 ${HUBC.x} ${HUBC.y}`} to={`360 ${HUBC.x} ${HUBC.y}`} dur="18s" repeatCount="indefinite" />}
        <circle cx={HUBC.x} cy={HUBC.y} r="78" fill="none" stroke="rgb(0 184 255 / 0.35)" strokeDasharray="3 9" />
        <circle cx={HUBC.x} cy={HUBC.y - 78} r="4" fill="#FF0000" />
      </g>
      <circle cx={HUBC.x} cy={HUBC.y} r="70" fill="#0047FF" opacity="0.3" filter={`url(#${id}-blur)`} />
      <circle cx={HUBC.x} cy={HUBC.y} r="62" fill={`url(#${id}-hub)`} />
      <circle cx={HUBC.x} cy={HUBC.y} r="62" fill="none" stroke="rgb(255 255 255 / 0.35)" />
      <text x={HUBC.x} y={HUBC.y - 2} textAnchor="middle" fontSize="24" fontWeight="700" fill="#FFFFFF">
        ACD
      </text>
      <text x={HUBC.x} y={HUBC.y + 20} textAnchor="middle" fontSize="11" letterSpacing="1.5" fill="#DCE6FF">
        IVR · PD
      </text>

      {/* Agent floor */}
      {AGENTS.map((a, i) => (
        <g key={i}>
          <circle cx={a.x} cy={a.y} r="22" fill="#130B3E" stroke={STATUS[i % 3]} strokeWidth="2.5">
            {!reduce && (
              <animate
                attributeName="stroke"
                values={[0, 1, 2, 0].map((k) => STATUS[(i + k) % 3]).join(";")}
                dur="7.2s"
                begin={`${(i * 0.9) % 7}s`}
                repeatCount="indefinite"
                calcMode="discrete"
              />
            )}
          </circle>
          <Headset x={a.x - 9} y={a.y - 9} width="18" height="18" color="#FFFFFF" strokeWidth={1.8} />
        </g>
      ))}

      {/* Legend + live waveform */}
      {[
        ["On call", STATUS[0]],
        ["Ready", STATUS[1]],
        ["Wrap-up", STATUS[2]],
      ].map(([t, col], i) => (
        <g key={t}>
          <circle cx={392 + i * 56} cy="440" r="4" fill={col} />
          <text x={400 + i * 56} y="444" fontSize="10.5" fill="#A9B3CC">
            {t}
          </text>
        </g>
      ))}
      {Array.from({ length: 26 }, (_, i) => {
        const h = 6 + ((i * 7) % 18);
        const y = 436;
        return (
          <rect key={i} x={24 + i * 11} y={y - h / 2} width="5" height={h} rx="2.5" fill={i % 3 ? "#00B8FF" : "#3D7BFF"} opacity="0.85">
            {!reduce && (
              <>
                <animate attributeName="height" values={`${h};${h * 1.9};${h}`} dur={`${0.8 + (i % 4) * 0.2}s`} repeatCount="indefinite" />
                <animate attributeName="y" values={`${y - h / 2};${y - h * 0.95};${y - h / 2}`} dur={`${0.8 + (i % 4) * 0.2}s`} repeatCount="indefinite" />
              </>
            )}
          </rect>
        );
      })}

      {/* Calls in flight */}
      {!reduce &&
        [...inbound, ...outbound].map((d, i) => <Packet key={i} d={d} i={i} id={id} />)}
    </svg>
  );
}
