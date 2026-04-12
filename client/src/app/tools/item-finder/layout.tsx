import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Item Finder",
  description: "Find any Star Citizen item across crafting, loot tables, missions, mining, and Wikelo contracts.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
