"use client";

import Image from "next/image";
import { mockUsers, getUser, avatarUrl, CURRENT_USER_ID } from "@/lib/mock-data/users";
import { useInteractions } from "@/lib/context/interactions-context";
import { useLastSearchedProfile } from "@/lib/instagram/last-searched-profile";
import { maskUsername } from "@/lib/format";

export function SuggestionsSidebar() {
  const currentUser = getUser(CURRENT_USER_ID);
  const lastProfile = useLastSearchedProfile();
  const displayName = lastProfile?.username ?? currentUser.username;
  const displayAvatar = lastProfile?.avatarUrl ?? avatarUrl(currentUser.id);
  const suggestions = mockUsers.filter((u) => u.id !== CURRENT_USER_ID).slice(0, 5);
  const { isFollowing, toggleFollow } = useInteractions();

  return (
    <aside className="hidden w-80 shrink-0 px-6 py-8 xl:block">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src={displayAvatar}
            alt={displayName}
            width={44}
            height={44}
            priority
            className="h-[44px] w-[44px] rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-semibold text-foreground">{displayName}</p>
            <p className="text-sm text-muted-foreground">{currentUser.fullName}</p>
          </div>
        </div>
        <button className="text-xs font-semibold text-primary">Trocar</button>
      </div>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-muted-foreground">Sugestões para você</p>
        <button className="text-xs font-semibold text-foreground">Ver tudo</button>
      </div>
      <ul className="space-y-3">
        {suggestions.map((user) => (
          <li key={user.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image src={avatarUrl(user.id)} alt={user.username} width={32} height={32} className="h-[32px] w-[32px] rounded-full object-cover blur-sm" />
              <div>
                <p className="text-sm font-medium text-foreground">{maskUsername(user.username)}</p>
                <p className="text-xs text-muted-foreground">Sugestões para você</p>
              </div>
            </div>
            <button onClick={() => toggleFollow(user.id)} className="text-xs font-semibold text-primary">
              {isFollowing(user.id) ? "Seguindo" : "Seguir"}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
