import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reputation",
  description: "Browse Star Citizen reputation organizations, tier thresholds, and unlocks.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
