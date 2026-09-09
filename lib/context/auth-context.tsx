"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useRouter } from "next/navigation";

const SESSION_KEY = "ig-clone-session";

interface AuthContextValue {
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  function logout() {
    window.localStorage.removeItem(SESSION_KEY);
    router.push("/");
  }

  return <AuthContext.Provider value={{ logout }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
