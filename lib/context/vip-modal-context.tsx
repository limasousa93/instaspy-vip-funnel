"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { VipUnlockModal } from "@/components/feed/vip-unlock-modal";
import { useSession } from "@/lib/context/session-context";

interface VipModalContextValue {
  openVipModal: () => void;
}

const VipModalContext = createContext<VipModalContextValue | null>(null);

export function VipModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { hasVipAccess } = useSession();

  // Toda ação bloqueada pro VIP (curtir, DM, reels, etc.) só abre o banner
  // "Seja VIP" — é o clique em "DESBLOQUEAR" dentro dele (VipUnlockCard)
  // que leva pra /resultado, não a ação que disparou o banner.
  function openVipModal() {
    if (hasVipAccess) return;
    setOpen(true);
  }

  return (
    <VipModalContext.Provider value={{ openVipModal }}>
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
