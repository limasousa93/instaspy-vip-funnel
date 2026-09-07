"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

const SESSION_KEY = "ig-clone-session";

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // One-time hydration-safe read: localStorage doesn't exist during SSR,
    // so the real session state can only be known once mounted on the client.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsAuthenticated(window.localStorage.getItem(SESSION_KEY) === "1");
    setIsLoading(false);
  }, []);

  function login() {
    window.localStorage.setItem(SESSION_KEY, "1");
    setIsAuthenticated(true);
    router.push("/");
  }

  function logout() {
    window.localStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
    router.push("/login");
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
