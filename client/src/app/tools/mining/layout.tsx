import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mining Calculator",
  description: "Calculate mining viability, compare lasers, and estimate profits for Star Citizen ores.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
