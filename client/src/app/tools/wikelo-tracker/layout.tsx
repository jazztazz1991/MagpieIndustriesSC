import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wikelo Tracker",
  description: "Track materials for Wikelo contract projects with progress bars and shopping lists.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
