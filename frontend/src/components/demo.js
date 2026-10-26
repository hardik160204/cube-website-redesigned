// Every "Book a demo" button opens the same popup form (PopupContactForm listens for this event).
export const DEMO_EVENT = "cube:open-demo";
export const openDemo = () => window.dispatchEvent(new Event(DEMO_EVENT));
