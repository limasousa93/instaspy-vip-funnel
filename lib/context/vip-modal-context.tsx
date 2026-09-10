"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { VipUnlockModal } from "@/components/feed/vip-unlock-modal";

interface VipModalContextValue {
  openVipModal: () => void;
}

const VipModalContext = createContext<VipModalContextValue | null>(null);

export function VipModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <VipModalContext.Provider value={{ openVipModal: () => setOpen(true) }}>
      {children}
      <VipUnlockModal open={open} onClose={() => setOpen(false)} />
    </VipModalContext.Provider>
  );
}

export function useVipModal(): VipModalContextValue {
  const ctx = useContext(VipModalContext);
  if (!ctx) throw new Error("useVipModal must be used within VipModalProvider");
  return ctx;
}
