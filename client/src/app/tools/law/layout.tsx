import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Law System",
  description: "Star Citizen crimes, fines, CrimeStat levels, and jurisdiction comparison.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
