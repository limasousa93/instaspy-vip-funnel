"use client";

import Image from "next/image";
import { getUser, avatarUrl } from "@/lib/mock-data/users";
import { mockMessageRequests } from "@/lib/mock-data/message-requests";
import { useInteractions } from "@/lib/context/interactions-context";
import { maskUsername } from "@/lib/format";

export function MessageRequestsList() {
  const { isFollowing, toggleFollow } = useInteractions();

  if (mockMessageRequests.length === 0) {
    return <p className="px-4 py-8 text-center text-sm text-muted-foreground">Nenhum pedido de mensagem por aqui.</p>;
  }

  return (
    <ul>
      {mockMessageRequests.map((r) => {
        const user = getUser(r.userId);
        return (
          <li key={r.id} className="flex items-center gap-3 px-4 py-3">
            <Image src={avatarUrl(user.id)} alt={maskUsername(user.username)} width={48} height={48} className="h-[48px] w-[48px] rounded-full object-cover blur-sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">{maskUsername(user.username)}</p>
              <p className="truncate text-xs text-muted-foreground">{r.preview} · {r.timeAgo}</p>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => toggleFollow(user.id)}
                  className="rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground"
                >
                  {isFollowing(user.id) ? "Aceito" : "Aceitar"}
                </button>
                <button className="rounded-lg bg-secondary px-4 py-1.5 text-xs font-semibold text-foreground">Excluir</button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
