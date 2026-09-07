"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { mockUsers } from "@/lib/mock-data/users";
import { avatarUrl } from "@/lib/media";
import { useInteractions } from "@/lib/context/interactions-context";

export function SuggestedPeopleRow({ excludeUserId }: { excludeUserId: string }) {
  const { isFollowing, toggleFollow } = useInteractions();
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const suggestions = mockUsers.filter((u) => u.id !== excludeUserId && !dismissed.has(u.id)).slice(0, 5);
  if (suggestions.length === 0) return null;

  return (
    <div className="py-4">
      <div className="mb-3 flex items-center justify-between px-4 lg:px-0">
        <p className="text-sm font-semibold text-foreground">Encontrar pessoas</p>
        <button className="text-sm font-semibold text-primary active:opacity-60">Ver tudo</button>
      </div>
      <div className="no-scrollbar momentum-scroll flex gap-3 overflow-x-auto px-4 lg:px-0">
        {suggestions.map((user, i) => (
          <div key={user.id} className="relative w-36 shrink-0 rounded-xl border border-border p-4">
            <button
              onClick={() => setDismissed((prev) => new Set(prev).add(user.id))}
              aria-label="Dispensar"
              className="absolute right-2 top-2 text-muted-foreground active:opacity-50"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex flex-col items-center gap-2 text-center">
              <Image src={avatarUrl(user.id)} alt={user.username} width={64} height={64} className="rounded-full" />
              <p className="w-full truncate text-sm font-semibold text-foreground">{user.fullName}</p>
              <p className="text-xs text-muted-foreground">{(i + 1) * 12} em comum</p>
              <button
                onClick={() => toggleFollow(user.id)}
                className={`w-full rounded-lg py-1.5 text-sm font-semibold active:opacity-70 ${
                  isFollowing(user.id) ? "bg-secondary text-foreground" : "bg-primary text-primary-foreground"
                }`}
              >
                {isFollowing(user.id) ? "Seguindo" : "Seguir"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
