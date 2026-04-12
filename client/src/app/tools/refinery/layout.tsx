import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refinery Optimizer",
  description: "Compare refinery methods by yield, time, and profit with live UEX prices.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
