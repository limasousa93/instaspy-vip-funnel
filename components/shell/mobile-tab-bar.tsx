"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PlaySquare, Send, Search } from "lucide-react";
import Image from "next/image";
import { avatarUrl } from "@/lib/media";
import { CURRENT_USER_ID } from "@/lib/mock-data/users";
import { mockConversations } from "@/lib/mock-data/conversations";
import { useLastSearchedProfile } from "@/lib/instagram/last-searched-profile";
import { useVipModal } from "@/lib/context/vip-modal-context";

const TAB_ITEMS = [
  { href: "/feed", icon: Home },
  { href: "/reels", icon: PlaySquare },
];

export function MobileTabBar() {
  const pathname = usePathname();
  const unreadMessages = mockConversations.filter((c) => c.unread).length;
  const { openVipModal } = useVipModal();
  const lastProfile = useLastSearchedProfile();
  const profileHref = `/${lastProfile?.username ?? CURRENT_USER_ID}`;
  const profileAvatar = lastProfile?.avatarUrl ?? avatarUrl(CURRENT_USER_ID);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex h-14 items-center justify-around border-t border-border bg-background pb-[env(safe-area-inset-bottom)] lg:hidden">
      {TAB_ITEMS.map(({ href, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className="flex h-full flex-1 items-center justify-center active:opacity-40"
        >
          <Icon className={`h-6 w-6 ${pathname === href ? "text-foreground" : "text-muted-foreground"}`} strokeWidth={pathname === href ? 2.25 : 1.75} />
        </Link>
      ))}
      <Link href="/direct/inbox" className="relative flex h-full flex-1 items-center justify-center active:opacity-40">
        <Send className={`h-6 w-6 ${pathname.startsWith("/direct") ? "text-foreground" : "text-muted-foreground"}`} strokeWidth={pathname.startsWith("/direct") ? 2.25 : 1.75} />
        {unreadMessages > 0 && (
          <span className="absolute right-[26%] top-[22%] h-2 w-2 rounded-full bg-red-500" />
        )}
      </Link>
      <button onClick={openVipModal} className="flex h-full flex-1 items-center justify-center active:opacity-40">
        <Search className={`h-6 w-6 ${pathname === "/explore" ? "text-foreground" : "text-muted-foreground"}`} strokeWidth={pathname === "/explore" ? 2.25 : 1.75} />
      </button>
      <Link href={profileHref} className="relative flex h-full flex-1 items-center justify-center active:opacity-40">
        <Image
          src={profileAvatar}
          alt="Perfil"
          width={26}
          height={26}
          preload
          className={`h-[26px] w-[26px] rounded-full object-cover ${pathname === profileHref ? "ring-2 ring-foreground" : ""}`}
        />
        <span className="absolute right-[26%] top-[18%] h-2 w-2 rounded-full bg-red-500 ring-2 ring-background" />
      </Link>
    </nav>
  );
}
