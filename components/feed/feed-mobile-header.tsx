"use client";

import { useState } from "react";
import { Plus, ChevronDown, Heart } from "lucide-react";
import { Grand_Hotel } from "next/font/google";
import { NotificationsPanel } from "@/components/shell/notifications-panel";

const grandHotel = Grand_Hotel({ weight: "400", subsets: ["latin"] });

export function FeedMobileHeader() {
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header className="flex items-center justify-between px-4 py-3 lg:hidden">
      <button className="active:opacity-40" aria-label="Nova publicação">
        <Plus className="h-6 w-6 text-foreground" strokeWidth={2} />
      </button>
      <div className="flex items-center gap-1">
        <span className={`${grandHotel.className} text-3xl leading-none text-foreground`}>Instagram</span>
        <ChevronDown className="h-4 w-4 text-foreground" strokeWidth={2.5} />
      </div>
      <button className="relative active:opacity-40" aria-label="Notificações" onClick={() => setNotifOpen(true)}>
        <Heart className="h-6 w-6 text-foreground" strokeWidth={1.75} />
        <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-background" />
      </button>
      <NotificationsPanel open={notifOpen} onOpenChange={setNotifOpen} />
    </header>
  );
}
