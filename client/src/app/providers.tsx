"use client";

import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/nav/Navbar";
import SearchPalette from "@/components/search/SearchPalette";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Navbar />
      <SearchPalette />
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
    </AuthProvider>
  );
}
