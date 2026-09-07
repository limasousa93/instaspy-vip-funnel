"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PlaySquare, MessageCircle, Search, Heart, PlusSquare, User, Menu } from "lucide-react";
import { useState } from "react";
import { MoreMenu } from "./more-menu";
import { MetaMenu } from "./meta-menu";
import { NotificationsPanel } from "./notifications-panel";
import { mockConversations } from "@/lib/mock-data/conversations";
import { CURRENT_USER_ID } from "@/lib/mock-data/users";

const NAV_ITEMS = [
  { href: "/", label: "Página inicial", icon: Home },
  { href: "/reels", label: "Reels", icon: PlaySquare },
  { href: "/direct/inbox", label: "Mensagens", icon: MessageCircle },
  { href: "/explore", label: "Pesquisa", icon: Search },
];

export function DesktopSidebar() {
  const pathname = usePathname();
  const [notifOpen, setNotifOpen] = useState(false);
  const unreadMessages = mockConversations.filter((c) => c.unread).length;

  return (
    <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-border bg-background px-3 py-6 lg:flex">
      <Link href="/" className="mb-8 px-3 text-2xl">
        <span aria-hidden>📷</span>
      </Link>
      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href === "/direct/inbox" && pathname.startsWith("/direct"));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-4 rounded-lg px-3 py-3 text-base hover:bg-accent ${active ? "font-bold" : "font-normal"}`}
            >
              <span className="relative">
                <Icon className="h-6 w-6" />
                {href === "/direct/inbox" && unreadMessages > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                    {unreadMessages}
                  </span>
                )}
              </span>
              {label}
            </Link>
          );
        })}
        <button onClick={() => setNotifOpen(true)} className="flex items-center gap-4 rounded-lg px-3 py-3 text-left text-base hover:bg-accent">
          <Heart className="h-6 w-6" /> Notificações
        </button>
        <button className="flex items-center gap-4 rounded-lg px-3 py-3 text-left text-base hover:bg-accent">
          <PlusSquare className="h-6 w-6" /> Criar
        </button>
        <Link href={`/${CURRENT_USER_ID}`} className="flex items-center gap-4 rounded-lg px-3 py-3 text-base hover:bg-accent">
          <User className="h-6 w-6" /> Perfil
        </Link>
      </nav>
      <div className="flex flex-col gap-1">
        <MoreMenu
          trigger={
            <button className="flex items-center gap-4 rounded-lg px-3 py-3 text-left text-base hover:bg-accent">
              <Menu className="h-6 w-6" /> Mais
            </button>
          }
        />
        <MetaMenu />
      </div>
      <NotificationsPanel open={notifOpen} onOpenChange={setNotifOpen} />
    </aside>
  );
}
