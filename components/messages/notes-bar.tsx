"use client";

import Image from "next/image";
import { Music2 } from "lucide-react";
import { getUser, avatarUrl, CURRENT_USER_ID } from "@/lib/mock-data/users";
import { mockInboxNotes } from "@/lib/mock-data/inbox-notes";
import { useLastSearchedProfile } from "@/lib/instagram/last-searched-profile";

function NoteBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-14 w-20 shrink-0 items-end justify-center">
      <div className="relative mb-2 w-20 rounded-2xl bg-secondary px-2 py-1.5 text-center text-[10px] leading-tight text-foreground">
        <span className="line-clamp-2">{children}</span>
        <div className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-secondary" />
      </div>
    </div>
  );
}

export function NotesBar() {
  const me = getUser(CURRENT_USER_ID);
  const lastProfile = useLastSearchedProfile();
  const myAvatar = lastProfile?.avatarUrl ?? avatarUrl(me.id);
  const myUsername = lastProfile?.username ?? me.username;

  return (
    <div className="no-scrollbar momentum-scroll flex gap-4 overflow-x-auto px-4 pb-2 pt-8">
      <div className="flex w-16 shrink-0 flex-col items-center gap-1.5">
        <NoteBubble>Pergunte algo aos amigos...</NoteBubble>
        <Image src={myAvatar} alt={myUsername} width={56} height={56} className="h-[56px] w-[56px] rounded-full object-cover" />
        <span className="max-w-16 truncate text-xs text-foreground">Sua nota</span>
      </div>
      {mockInboxNotes.map((note) => {
        const user = getUser(note.userId);
        return (
          <div key={note.userId} className="flex w-16 shrink-0 flex-col items-center gap-1.5">
            <NoteBubble>
              {note.audioTitle ? (
                <span className="flex items-center justify-center gap-1">
                  <Music2 className="h-2.5 w-2.5 shrink-0" />
                  <span className="truncate">{note.audioTitle}</span>
                </span>
              ) : (
                note.text
              )}
            </NoteBubble>
            <Image src={avatarUrl(user.id)} alt={user.username} width={56} height={56} className="h-[56px] w-[56px] rounded-full object-cover blur-sm" />
            <span className="max-w-16 truncate text-xs text-foreground">{user.username}</span>
          </div>
        );
      })}
    </div>
  );
}
