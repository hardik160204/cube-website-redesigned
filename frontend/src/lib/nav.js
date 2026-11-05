import { Factory, Layers, Link2 } from "lucide-react";
import { INDUSTRIES, PLATFORM, RESOURCES, SOLUTIONS } from "../components/home/catalog";
import { ICONS } from "./editable";

// The site header's menu as plain data (icons by name), which is what the dashboard's "Navigation bar" page
// edits and saves. Until something is saved there, the server returns null and the site shows this one.
// Its wording comes straight from the catalog, because site edits find text by its exact built-in words.

const nameOf = (icon) => {
  ICONS.set(icon.displayName, icon);
  return icon.displayName;
};
export const navIcon = (name) => ICONS.get(name) || Link2;

const fromCatalog = ({ title, desc, href, icon }) => ({ label: title, desc, href, icon: nameOf(icon) });
const rich = ({ heading, icon, featured, links }) => ({
  label: heading,
  icon: nameOf(icon),
  featured,
  links: links.map(({ label, desc, href, icon: linkIcon }) => ({ label, desc, href, icon: nameOf(linkIcon) })),
});
const simple = (label, icon, items) => ({ label, icon: nameOf(icon), featured: null, links: items.map(fromCatalog) });
const column = (label, hrefs) => ({ label, icon: "", featured: null, links: RESOURCES.filter((r) => hrefs.includes(r.href)).map(fromCatalog) });

export const DEFAULT_NAV = {
  items: [
    { label: "Platform", layout: "rich", extras: false, groups: PLATFORM.filter((c) => c.heading !== "Record").map(rich) },
    {
      label: "Solutions",
      layout: "simple",
      extras: false,
      groups: [simple("Solutions", Layers, SOLUTIONS), simple("Industries", Factory, INDUSTRIES), rich(PLATFORM.find((c) => c.heading === "Record"))],
    },
    { label: "Features", href: "/#features" },
    {
      label: "Resources",
      layout: "columns",
      extras: true,
      groups: [column("Company", ["/about", "/meet-our-team", "/career", "/blog"]), column("Customers", ["/client-voices", "/#faq", "/contact"])],
    },
    { label: "Pricing", href: "/pricing" },
  ],
  expert: true,
  demo: true,
};
