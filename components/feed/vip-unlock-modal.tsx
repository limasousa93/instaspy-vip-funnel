"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { VipUnlockCard } from "./vip-unlock-banner";

export function VipUnlockModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      const raf = requestAnimationFrame(() => setEntered(true));
      return () => cancelAnimationFrame(raf);
    }
    setEntered(false);
    const timeout = window.setTimeout(() => setMounted(false), 200);
    return () => window.clearTimeout(timeout);
  }, [open]);

  if (!mounted) return null;

  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-6 transition-opacity duration-200 ${
        entered ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`flex w-full max-w-sm flex-col items-center gap-4 transition-all duration-200 ${
          entered ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black shadow-lg active:opacity-70"
        >
          <X className="h-5 w-5" strokeWidth={2.5} />
        </button>
        <VipUnlockCard />
      </div>
    </div>
  );
}
