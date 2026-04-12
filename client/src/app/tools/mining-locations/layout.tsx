import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Where to Mine",
  description: "Mining locations across Stanton, Pyro, and Nyx with ship and FPS ore availability.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
