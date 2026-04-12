import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ship Compare",
  description: "Compare Star Citizen ships side by side — stats, loadouts, and capabilities.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
