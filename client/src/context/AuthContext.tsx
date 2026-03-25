"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { apiFetch } from "@/lib/api";

interface User {
  id: string;
  username: string;
  email?: string;
  rsiHandle?: string;
  avatarUrl?: string;
  bio?: string;
  role: string;
  isAdmin?: boolean;
  isSuperAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (login: string, password: string) => Promise<string | null>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<string | null>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      apiFetch<User>("/api/auth/me")
        .then((res) => {
          if (res.success && res.data) {
            setUser(res.data);
          } else if (!res.networkError) {
            // Only clear token on auth errors, not network failures
            localStorage.removeItem("token");
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (
    loginVal: string,
    password: string
  ): Promise<string | null> => {
    const res = await apiFetch<{ token: string; user: User }>(
      "/api/auth/login",
      {
        method: "POST",
        body: JSON.stringify({ login: loginVal, password }),
      }
    );

    if (res.success && res.data) {
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      return null;
    }
    return res.error || "Login failed";
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ): Promise<string | null> => {
    const res = await apiFetch<{ token: string; user: User }>(
      "/api/auth/register",
      {
        method: "POST",
        body: JSON.stringify({ username, email, password }),
      }
    );

    if (res.success && res.data) {
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      return null;
    }
    return res.error || "Registration failed";
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
