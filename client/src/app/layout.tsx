import type { Metadata } from "next";
import "@/styles/globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Magpie Industries SC",
  description:
    "A Star Citizen community app for orgs, friend groups, and solo players.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>
        <Providers>
          {children}
          <footer style={{
            borderTop: "1px solid var(--border)",
            padding: "1.5rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "1rem",
            marginTop: "2rem",
            opacity: 0.7,
          }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
              Market data
            </span>
            <a href="https://uexcorp.space" target="_blank" rel="noopener noreferrer">
              <img src="/img/uex-powered-badge.png" alt="Powered by UEX" style={{ height: "28px" }} />
            </a>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
