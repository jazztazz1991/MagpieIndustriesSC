import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | Magpie Industries SC",
    default: "Tools | Magpie Industries SC",
  },
  description: "Star Citizen community tools — mining calculator, refinery optimizer, crafting blueprints, item finder, and more.",
  openGraph: {
    siteName: "Magpie Industries SC",
    type: "website",
  },
};

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
