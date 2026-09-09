"use client";

import { useState } from "react";
import { Search, UserRound } from "lucide-react";
import { BlurredAvatar } from "@/components/ui/blurred-avatar";
import { getUser, avatarUrl } from "@/lib/mock-data/users";
import { mockMessageRequests } from "@/lib/mock-data/message-requests";
import { maskUsername } from "@/lib/format";
import { NotesBar } from "./notes-bar";
import { MessageRequestsList } from "./message-requests-list";
import type { Conversation } from "@/lib/types";

export function ConversationList({
  conversations,
  activeId,
  onSelect,
  onLockedSelect,
}: {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onLockedSelect?: () => void;
}) {
  const [tab, setTab] = useState<"messages" | "requests">("messages");

  return (
    <div className="flex w-full flex-col border-r border-border lg:w-96">
      <div className="px-4 pb-3 pt-1">
        <div className="flex items-center gap-2 rounded-full bg-secondary px-3 py-2.5">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="truncate text-sm text-muted-foreground">Pesquise ou pergunte à Meta AI</span>
        </div>
      </div>
      <NotesBar />
      <div className="flex items-center justify-between px-4 py-3">
        <button onClick={() => setTab("messages")} className={`text-base font-semibold ${tab === "messages" ? "text-foreground" : "text-muted-foreground"}`}>
          Mensagens
        </button>
        <button onClick={() => setTab("requests")} className="text-base font-semibold text-blue-500">
          Pedidos ({mockMessageRequests.length})
        </button>
      </div>
      {tab === "requests" ? (
        <MessageRequestsList />
      ) : (
        <ul>
          {conversations.map((c) => {
            const user = getUser(c.userId);
            const displayName = c.displayNameOverride ?? user.username;
            const preview = c.previewOverride ?? `${c.lastMessage} · ${c.timeAgo}`;
            const avatarSrc = c.avatarOverride ?? avatarUrl(user.id);
            return (
              <li key={c.id}>
                <button
                  onClick={() => (c.locked ? onLockedSelect?.() : onSelect(c.id))}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-accent ${activeId === c.id ? "bg-accent" : ""}`}
                >
                  {c.ring ? (
                    <div className="shrink-0 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[2px]">
                      <BlurredAvatar src={avatarSrc} alt={displayName} size={44} className="ring-2 ring-background" />
                    </div>
                  ) : c.noAvatar ? (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-muted">
                      <UserRound className="h-7 w-7 text-muted-foreground" />
                    </div>
                  ) : (
                    <BlurredAvatar src={avatarSrc} alt={displayName} size={48} />
                  )}
                  <span className="min-w-0 flex-1">
                    <p className={`truncate text-sm ${c.unread ? "font-semibold text-foreground" : "text-foreground"}`}>{maskUsername(displayName)}</p>
                    <p className={`truncate text-xs ${c.unread ? "font-semibold text-foreground" : "text-muted-foreground"}`}>{preview}</p>
                  </span>
                  {c.pending ? (
                    <span className="h-4 w-4 shrink-0 rounded-full border-2 border-dashed border-muted-foreground" />
                  ) : (
                    c.unread && <span className="h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
