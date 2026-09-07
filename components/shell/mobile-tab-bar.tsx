"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PlaySquare, Search, Heart } from "lucide-react";
import Image from "next/image";
import { avatarUrl } from "@/lib/media";
import { CURRENT_USER_ID } from "@/lib/mock-data/users";

const TAB_ITEMS = [
  { href: "/", icon: Home },
  { href: "/reels", icon: PlaySquare },
  { href: "/explore", icon: Search },
];

export function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex h-14 items-center justify-around border-t border-border bg-background lg:hidden">
      {TAB_ITEMS.map(({ href, icon: Icon }) => (
        <Link key={href} href={href} className="flex h-full flex-1 items-center justify-center">
          <Icon className={`h-6 w-6 ${pathname === href ? "text-foreground" : "text-muted-foreground"}`} strokeWidth={pathname === href ? 2.5 : 2} />
        </Link>
      ))}
      <button className="flex h-full flex-1 items-center justify-center text-muted-foreground">
        <Heart className="h-6 w-6" />
      </button>
      <Link href={`/${CURRENT_USER_ID}`} className="flex h-full flex-1 items-center justify-center">
        <Image src={avatarUrl(CURRENT_USER_ID)} alt="Perfil" width={26} height={26} className="rounded-full" />
      </Link>
    </nav>
  );
}
