import {
  ArrowRightLeft, BadgeCheck, BarChart3, Bot, Building2, CalendarOff, CheckCircle2, ClipboardCheck, Clock, Cloud, Code2,
  Crown, Database, Ear, FileText, GraduationCap, Hash, Headset, Inbox, Languages, LayoutDashboard, Link2, ListChecks,
  Lock, Mail, Megaphone, MessageCircle, MessageSquare, Mic, MonitorPlay, Moon, MousePointerClick, Network, Phone,
  PhoneCall, PhoneIncoming, PhoneMissed, PhoneOff, PhoneOutgoing, Play, Plug, Repeat, RotateCcw, Route, Search, Server,
  ShieldCheck, Smartphone, Tag, Timer, TrendingUp, Upload, User, Users, Voicemail, Webhook, Workflow, Zap,
} from "lucide-react";

// One flowchart per feature card, keyed by the card's title. Each flow is a list of stages; a stage with several
// nodes is a set of lanes that all run (different callers taking different routes at once, or every outcome of a
// process), so no part of a chart is ever idle. Every flow only spells out what the card itself says the feature
// does. Labels stay short enough to fit their node (see the test).
const n = (icon, label, sub) => ({ icon, label, sub });

export const FEATURE_FLOWS = {
  // --- Inbound ---
  "IVR menus": [
    [n(PhoneIncoming, "Caller dials", "Your business number")],
    [n(Workflow, "Main menu", "Welcome to the line")],
    [n(Hash, "Press 1", "Sales"), n(Hash, "Press 2", "Support"), n(Hash, "Press 3", "Billing")],
    [n(Workflow, "Sales menu", "1 New · 2 Existing"), n(Workflow, "Support menu", "1 Technical · 2 Account"), n(Workflow, "Billing menu", "1 Invoice · 2 Plans")],
    [n(Headset, "Right agent", "Queue for that option")],
  ],
  "Smart call routing": [
    [n(PhoneIncoming, "Incoming calls")],
    [n(Route, "Routing rules", "Skill, language, value")],
    [n(Languages, "Hindi", "Support desk"), n(Headset, "English", "Sales skill"), n(Crown, "VIP caller", "Priority queue")],
    [n(Headset, "Best-fit agent", "For every caller")],
  ],
  "Time-based routing": [
    [n(PhoneIncoming, "Calls all day")],
    [n(Clock, "Clock check", "Hours, nights, holidays")],
    [n(Users, "Business hours", "Live agents"), n(Moon, "Night", "After-hours IVR"), n(CalendarOff, "Holiday", "Voicemail")],
    [n(CheckCircle2, "Call handled", "Whatever the time")],
  ],
  "Ring groups": [
    [n(PhoneIncoming, "Incoming call")],
    [n(Users, "Ring group", "All at once or in turn")],
    [n(User, "Agent A", "Rings"), n(User, "Agent B", "Rings"), n(User, "Agent C", "Rings")],
    [n(PhoneCall, "First pick-up", "Others stop ringing")],
  ],
  "Auto attendant": [
    [n(PhoneIncoming, "Callers dial")],
    [n(Bot, "Auto attendant", "No receptionist needed")],
    [n(Hash, "Ext. 201", "Accounts"), n(Hash, "Ext. 305", "HR"), n(Headset, "Operator", "Press 0")],
    [n(PhoneCall, "Connected", "Straight through")],
  ],
  Voicemail: [
    [n(PhoneIncoming, "Incoming call")],
    [n(PhoneMissed, "No answer", "Nobody can pick up")],
    [n(Voicemail, "Voicemail", "Caller leaves a message")],
    [n(Mail, "Sent by email", "To the right person"), n(Inbox, "Saved to inbox", "Play back anytime")],
  ],

  // --- Outbound ---
  "Predictive dialing": [
    [n(ListChecks, "Lead list", "Campaign loaded")],
    [n(PhoneOutgoing, "Dialer paces", "Predictive mode")],
    [n(PhoneOff, "Busy"), n(PhoneCall, "Answered", "Live person"), n(Voicemail, "Machine")],
    [n(RotateCcw, "Retry later", "Back in the list"), n(Headset, "Free agent", "Talks, never waits"), n(Tag, "Skip & log", "Marked as machine")],
    [n(BarChart3, "Campaign report", "Every outcome")],
  ],
  "Bulk voice calls": [
    [n(Mic, "Record once", "Your message")],
    [n(Upload, "Upload list", "Your whole list")],
    [n(Megaphone, "Broadcast", "Calls go out at once")],
    [n(CheckCircle2, "Delivered", "Message played"), n(RotateCcw, "Not reached", "Retried")],
    [n(BarChart3, "Campaign report", "Who heard it")],
  ],
  "Click to call": [
    [n(MousePointerClick, "Visitor clicks", "“Call me back”")],
    [n(Headset, "Agent rings", "Cube calls you first")],
    [n(Smartphone, "Visitor rings", "Then the visitor")],
    [n(Link2, "Bridged", "Talking in seconds")],
  ],
  "Missed-call campaigns": [
    [n(PhoneMissed, "Missed call", "To your campaign line")],
    [n(Hash, "Number captured", "Call ends, free")],
    [n(MessageSquare, "Auto SMS", "Instant reply"), n(PhoneCall, "Callback", "From your team")],
    [n(Database, "Lead or opt-in", "Saved for follow-up")],
  ],
  "Call disposition": [
    [n(PhoneOff, "Calls end")],
    [n(Tag, "Agent tags each", "Disposition code")],
    [n(BadgeCheck, "Sale", "Closed"), n(Repeat, "Callback", "Booked"), n(PhoneOff, "Not interested", "Recorded")],
    [n(BarChart3, "Clean reports", "Every outcome counted")],
  ],
  "Blended campaigns": [
    [n(PhoneIncoming, "Inbound queue"), n(PhoneOutgoing, "Outbound list")],
    [n(Network, "Blending", "One agent pool")],
    [n(Users, "Same floor", "Takes both kinds")],
    [n(Zap, "No idle time", "Agents stay busy")],
  ],

  // --- Recording & QA ---
  "Call recording": [
    [n(Network, "SIP lines"), n(Phone, "Analog lines"), n(Server, "Digital lines")],
    [n(Mic, "Callisto", "Records every call")],
    [n(Database, "Compressed", "Stored securely")],
    [n(Search, "Searchable", "Find any call fast")],
  ],
  "Screen recording": [
    [n(MonitorPlay, "Agent screens", "Multi-PC capture"), n(Mic, "Call audio", "Same moment")],
    [n(Link2, "Synced", "Screen + voice")],
    [n(Play, "Replay together", "See and hear it")],
  ],
  "Multi-site sync": [
    [n(Building2, "Branch A"), n(Building2, "Branch B"), n(Building2, "Branch C")],
    [n(Cloud, "InSync", "Pulls every site")],
    [n(Database, "Central archive", "One place")],
    [n(Search, "Search all", "Across locations")],
  ],
  "Quality analysis": [
    [n(Mic, "Recorded call")],
    [n(ClipboardCheck, "Scorecard", "Reviewer scores it")],
    [n(GraduationCap, "Coaching", "Feedback to agent")],
    [n(TrendingUp, "Better calls", "Next time round")],
  ],
  "Live analytics": [
    [n(PhoneCall, "Live calls")],
    [n(BarChart3, "Real-time stats", "As they happen")],
    [n(Users, "Queues", "Who's waiting"), n(TrendingUp, "Answer rate", "Right now"), n(Timer, "Wait times", "Seconds, live")],
    [n(Zap, "Act now", "Not at month-end")],
  ],
  "Supervisor wallboards": [
    [n(Users, "Agent floor")],
    [n(LayoutDashboard, "Wallboard", "Live for team leads")],
    [n(Ear, "Listen", "Silent monitor"), n(MessageCircle, "Whisper", "Coach the agent"), n(PhoneCall, "Barge in", "Join the call")],
    [n(CheckCircle2, "Call saved", "Customer happy")],
  ],

  // --- Integrations ---
  "CRM integration": [
    [n(PhoneIncoming, "Call rings")],
    [n(Database, "CRM lookup", "Salesforce · Freshdesk")],
    [n(MonitorPlay, "Screen-pop", "Customer on screen")],
    [n(FileText, "Logged back", "Call saved to CRM")],
  ],
  "APIs & CTI connectors": [
    [n(Code2, "Your app")],
    [n(Plug, "Cube API & CTI", "Connectors")],
    [n(PhoneOutgoing, "Dial", "From your app"), n(ArrowRightLeft, "Transfer", "Between agents"), n(Mic, "Record", "On demand")],
    [n(Webhook, "Events back", "Into your app")],
  ],
  "PBX compatibility": [
    [n(Server, "Asterisk", "FreePBX"), n(Server, "3CX", "Grandstream"), n(Server, "Cisco")],
    [n(Network, "SIP connect", "Standard protocol")],
    [n(Cloud, "Cube platform", "Features on top")],
    [n(CheckCircle2, "Keep your PBX", "No rip-and-replace")],
  ],
  "SIP trunking": [
    [n(Phone, "Legacy lines", "Old PRI/analog")],
    [n(Network, "SIP trunk", "Calls over IP")],
    [n(Server, "Your PBX", "Stays as it is")],
    [n(CheckCircle2, "Moved over", "No PBX swap")],
  ],
  "Number masking": [
    [n(User, "Customer", "98•• ••210")],
    [n(Lock, "Proxy number", "080 4•• ••77")],
    [n(Headset, "Agent", "Sees only the proxy")],
    [n(ShieldCheck, "Both private", "Real numbers hidden")],
  ],
  "WhatsApp & web chat": [
    [n(MessageCircle, "WhatsApp"), n(MessageSquare, "Web chat")],
    [n(Bot, "Chatbot", "Answers first")],
    [n(CheckCircle2, "Resolved", "By the bot"), n(Headset, "To an agent", "When needed")],
    [n(Inbox, "One inbox", "Omnichannel center")],
  ],
};
