"use client";

import { createContext, useContext, type ReactNode } from "react";

interface SessionValue {
  hasVipAccess: boolean;
  hasUpsellAccess: boolean;
  hasDownsellAccess: boolean;
}

const SessionContext = createContext<SessionValue>({ hasVipAccess: false, hasUpsellAccess: false, hasDownsellAccess: false });

export function SessionProvider({ value, children }: { value: SessionValue; children: ReactNode }) {
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionValue {
  return useContext(SessionContext);
}
