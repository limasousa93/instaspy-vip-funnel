"use client";

import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { getUser, avatarUrl, CURRENT_USER_ID } from "@/lib/mock-data/users";
import type { Conversation } from "@/lib/types";

export function ConversationView({ conversation, onBack }: { conversation: Conversation; onBack: () => void }) {
  const user = getUser(conversation.userId);

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center gap-3 border-b border-border px-4 py-3">
        <button onClick={onBack} className="lg:hidden" aria-label="Voltar">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <Image src={avatarUrl(user.id)} alt={user.username} width={32} height={32} className="rounded-full" />
        <span className="text-sm font-semibold text-foreground">{user.username}</span>
      </header>
      <div className="flex-1 space-y-2 overflow-y-auto p-4">
        {conversation.messages.map((m) => (
          <div key={m.id} className={`flex ${m.fromUserId === CURRENT_USER_ID ? "justify-end" : "justify-start"}`}>
            <span
              className={`max-w-[70%] rounded-2xl px-3 py-2 text-sm ${
                m.fromUserId === CURRENT_USER_ID ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
              }`}
            >
              {m.text}
            </span>
          </div>
        ))}
      </div>
      <div className="border-t border-border p-3">
        <input
          placeholder="Mensagem..."
          className="w-full rounded-full bg-secondary px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
      </div>
    </div>
  );
}
