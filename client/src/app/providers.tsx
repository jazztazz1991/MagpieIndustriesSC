"use client";

import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/nav/Navbar";
import SearchPalette from "@/components/search/SearchPalette";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import ReportBugButton from "@/components/ReportBugButton";
import ServerWakeup from "@/components/ServerWakeup";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ServerWakeup />
      <Navbar />
      <SearchPalette />
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
      <ReportBugButton />
    </AuthProvider>
  );
}
