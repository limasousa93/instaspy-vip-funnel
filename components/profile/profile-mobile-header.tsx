"use client";

import { Plus, ChevronDown, Menu } from "lucide-react";
import { MoreMenu } from "@/components/shell/more-menu";

export function ProfileMobileHeader({ username }: { username: string }) {
  return (
    <header className="flex items-center justify-between px-4 py-3 lg:hidden">
      <button className="active:opacity-40" aria-label="Nova publicação">
        <Plus className="h-6 w-6 text-foreground" strokeWidth={2} />
      </button>
      <button className="flex items-center gap-1 active:opacity-40">
        <span className="text-lg font-bold text-foreground">{username}</span>
        <ChevronDown className="h-4 w-4 text-foreground" strokeWidth={2.5} />
        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
      </button>
      <div className="flex items-center gap-5">
        <button className="relative active:opacity-40" aria-label="Threads">
          <svg viewBox="0 0 192 192" className="h-6 w-6 fill-foreground">
            <path d="M141.5 88.4c-.7-.3-1.4-.7-2.1-1 -1.2-31.2-18.3-49-46.9-49.2 -13.9-.1-25.5 3.3-33.6 15 -5.9 8.5-8.4 18.5-9 29.5l14.2 1c.5-8.4 2.3-16 6.4-21.9 5.4-7.8 13.5-9.9 22-9.8 18.6.1 27.6 11.1 28.3 32.1 -6.6-1.1-13.9-1.7-21.8-1.4 -22.2.8-38.6 12.9-37.6 32.4 1 20 20 29.7 39.6 28.9 16.9-.7 27.5-9.7 33.4-21.4 4.6 5.5 6.9 12.7 6.5 21.4 -.6 15.6-13.5 25.4-32.4 26.1 -21.8.8-38.6-9.1-40.4-26.5l-14.6 1.1c2.5 24.5 24.9 39.5 54.5 38.4 26.7-1 46.7-16.4 47.5-40.9C156.9 108 152.1 96.3 141.5 88.4zM97.1 128.5c-9.4.5-19.7-3.4-20.1-12.5 -.3-6.7 4.8-14.2 20.7-14.8 1.9-.1 3.7-.1 5.5-.1 5.9 0 11.5.6 16.5 1.6C118 116.6 109.4 127.8 97.1 128.5z" />
          </svg>
          <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white">1</span>
        </button>
        <MoreMenu
          trigger={
            <button className="active:opacity-40" aria-label="Menu">
              <Menu className="h-6 w-6 text-foreground" strokeWidth={2} />
            </button>
          }
        />
      </div>
    </header>
  );
}
