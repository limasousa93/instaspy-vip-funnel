"use client";

import { SquarePen, ChevronDown } from "lucide-react";
import { getUser, CURRENT_USER_ID } from "@/lib/mock-data/users";
import { useLastSearchedProfile } from "@/lib/instagram/last-searched-profile";
import { useVipModal } from "@/lib/context/vip-modal-context";

export function InboxMobileHeader() {
  const me = getUser(CURRENT_USER_ID);
  const displayName = useLastSearchedProfile()?.username ?? me.username;
  const { openVipModal } = useVipModal();

  return (
    <header className="flex items-center justify-between px-4 py-3 lg:hidden">
      <div className="w-6" aria-hidden="true" />
      <button onClick={openVipModal} className="flex items-center gap-1 active:opacity-40">
        <span className="text-lg font-bold text-foreground">{displayName}</span>
        <ChevronDown className="h-4 w-4 text-foreground" strokeWidth={2.5} />
        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
      </button>
      <button onClick={openVipModal} className="active:opacity-40" aria-label="Nova mensagem">
        <SquarePen className="h-6 w-6 text-foreground" strokeWidth={1.75} />
      </button>
    </header>
  );
}
