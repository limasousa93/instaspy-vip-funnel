"use client";

import Image from "next/image";
import { mockUsers, getUser, avatarUrl, CURRENT_USER_ID } from "@/lib/mock-data/users";
import { useInteractions } from "@/lib/context/interactions-context";

export function SuggestionsSidebar() {
  const currentUser = getUser(CURRENT_USER_ID);
  const suggestions = mockUsers.filter((u) => u.id !== CURRENT_USER_ID).slice(0, 5);
  const { isFollowing, toggleFollow } = useInteractions();

  return (
    <aside className="hidden w-80 shrink-0 px-6 py-8 xl:block">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image src={avatarUrl(currentUser.id)} alt={currentUser.username} width={44} height={44} className="rounded-full" />
          <div>
            <p className="text-sm font-semibold text-foreground">{currentUser.username}</p>
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
              <Image src={avatarUrl(user.id)} alt={user.username} width={32} height={32} className="rounded-full" />
              <div>
                <p className="text-sm font-medium text-foreground">{user.username}</p>
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
