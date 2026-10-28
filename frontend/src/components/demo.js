// Every "Book a demo" button goes to the booking page (/demo); App listens for this event and navigates.
export const DEMO_EVENT = "cube:open-demo";
export const openDemo = () => window.dispatchEvent(new Event(DEMO_EVENT));
