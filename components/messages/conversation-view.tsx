"use client";

import Image from "next/image";
import { ArrowLeft, Play } from "lucide-react";
import { getUser, avatarUrl, CURRENT_USER_ID } from "@/lib/mock-data/users";
import type { Conversation } from "@/lib/types";

// Barras de onda decorativas (não tocam áudio de verdade) — altura fixa por
// índice, não Math.random(), pra não gerar mismatch de hydration SSR/cliente.
const WAVEFORM_BARS = Array.from({ length: 24 }, (_, i) => 4 + Math.round(Math.abs(Math.sin(i * 1.7)) * 13));

// Roxo fixo pra bolha de saída (igual ao layout de referência) — não é o
// token `primary` do tema, que aqui é cinza claro e serve pra outra coisa.
const OUTGOING_BUBBLE = "bg-violet-600 text-white";

function AudioBubble({ duration, outgoing }: { duration: string; outgoing: boolean }) {
  return (
    <div
      className={`flex max-w-[75%] flex-col gap-1 rounded-2xl px-3 py-2 ${
        outgoing ? OUTGOING_BUBBLE : "bg-secondary text-foreground"
      }`}
    >
      <div className="flex items-center gap-2">
        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${outgoing ? "bg-white/20" : "bg-foreground/10"}`}>
          <Play className="h-3.5 w-3.5 fill-current" />
        </span>
        <span className="flex h-6 flex-1 items-center gap-[2px]">
          {WAVEFORM_BARS.map((h, i) => (
            <span key={i} className="w-[2px] shrink-0 rounded-full bg-current opacity-70" style={{ height: `${h}px` }} />
          ))}
        </span>
        <span className="shrink-0 text-xs opacity-80">{duration}</span>
      </div>
      <span className="text-xs opacity-70">Ver transcrição</span>
    </div>
  );
}

export function ConversationView({ conversation, onBack }: { conversation: Conversation; onBack: () => void }) {
  const user = getUser(conversation.userId);

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center gap-3 border-b border-border px-4 py-3">
        <button onClick={onBack} className="lg:hidden" aria-label="Voltar">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <Image src={conversation.avatarOverride ?? avatarUrl(user.id)} alt={user.username} width={32} height={32} className="h-[32px] w-[32px] rounded-full object-cover blur-sm" />
        <span className="text-sm font-semibold text-foreground">{conversation.displayNameOverride ?? user.username}</span>
      </header>
      <div className="flex-1 space-y-2 overflow-y-auto p-4">
        {conversation.messages.map((m) => {
          const outgoing = m.fromUserId === CURRENT_USER_ID;
          return (
            <div key={m.id} className={`flex ${outgoing ? "justify-end" : "justify-start"}`}>
              {m.kind === "audio" && m.audioDuration ? (
                <AudioBubble duration={m.audioDuration} outgoing={outgoing} />
              ) : m.kind === "photo" && m.photoUrl ? (
                <Image
                  src={m.photoUrl}
                  alt=""
                  width={240}
                  height={300}
                  className="h-auto w-[220px] rounded-2xl object-cover"
                />
              ) : (
                <span
                  className={`max-w-[70%] rounded-2xl px-3 py-2 text-sm ${
                    outgoing ? OUTGOING_BUBBLE : "bg-secondary text-foreground"
                  }`}
                >
                  {m.text}
                </span>
              )}
            </div>
          );
        })}
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
