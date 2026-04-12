import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crafting Blueprints",
  description: "Search 1,044 crafting blueprints with materials, mining locations, and blueprint sources.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
