"use client";

import Image from "next/image";
import { getUser, avatarUrl } from "@/lib/mock-data/users";
import type { Conversation } from "@/lib/types";

export function ConversationList({
  conversations,
  activeId,
  onSelect,
}: {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="w-full border-r border-border lg:w-96">
      <div className="flex items-center justify-between px-4 py-4">
        <h2 className="text-lg font-semibold text-foreground">Mensagens</h2>
      </div>
      <ul>
        {conversations.map((c) => {
          const user = getUser(c.userId);
          return (
            <li key={c.id}>
              <button
                onClick={() => onSelect(c.id)}
                className={`flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-accent ${activeId === c.id ? "bg-accent" : ""}`}
              >
                <Image src={avatarUrl(user.id)} alt={user.username} width={48} height={48} className="rounded-full" />
                <span className="min-w-0 flex-1">
                  <p className={`truncate text-sm ${c.unread ? "font-semibold text-foreground" : "text-foreground"}`}>{user.username}</p>
                  <p className="truncate text-xs text-muted-foreground">{c.lastMessage} · {c.timeAgo}</p>
                </span>
                {c.unread && <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
