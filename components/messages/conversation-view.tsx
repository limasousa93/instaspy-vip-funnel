"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, Play, Send, Camera, Mic, Image as ImageIcon, MessageCircleMore, CirclePlus, Phone, Video, Tag } from "lucide-react";
import { getUser, avatarUrl, CURRENT_USER_ID } from "@/lib/mock-data/users";
import { maskUsername } from "@/lib/format";
import type { Conversation } from "@/lib/types";

// Barras de onda decorativas (não tocam áudio de verdade) — altura fixa por
// índice, não Math.random(), pra não gerar mismatch de hydration SSR/cliente.
const WAVEFORM_BARS = Array.from({ length: 24 }, (_, i) => 4 + Math.round(Math.abs(Math.sin(i * 1.7)) * 13));

// Roxo fixo pra bolha de saída (igual ao layout de referência) — não é o
// token `primary` do tema, que aqui é cinza claro e serve pra outra coisa.
const OUTGOING_BUBBLE = "bg-violet-600 text-white";

// Trechos sensíveis da conversa da bianca_diniz que devem aparecer
// embaçados dentro da bolha de texto, sem tocar no resto da frase.
const BLUR_PHRASES = [
  "ja tava em casa qndo cheguei",
  "ei quer ver nosso",
  "que tinha gravado.",
  "estiver longe de mim",
  "não posso ta perto",
];

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const BLUR_REGEX = new RegExp(`(${BLUR_PHRASES.map(escapeRegExp).join("|")})`, "g");

// Ponto a partir do qual a "sombra" embaçada progressiva começa a aparecer
// sobre a conversa da bianca_diniz: o áudio de 0:09 enviado por "você".
const FOG_TRIGGER_MESSAGE_ID = "m12";
const FOG_MIN_BLUR = 6;
const FOG_MAX_BLUR = 22;
const FOG_MIN_OPACITY = 0.25;
const FOG_MAX_OPACITY = 0.6;

function renderMessageText(text: string) {
  const parts = text.split(BLUR_REGEX);
  return parts.map((part, i) =>
    BLUR_PHRASES.includes(part) ? (
      <span key={i} className="rounded-sm blur-[3px] select-none">
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

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
  const isBiancaConversation = conversation.id === "c1";

  const scrollRef = useRef<HTMLDivElement>(null);
  const fogTriggerRef = useRef<HTMLDivElement>(null);
  const [fog, setFog] = useState({ blur: 0, opacity: 0 });

  useEffect(() => {
    if (!isBiancaConversation) return;
    const container = scrollRef.current;
    if (!container) return;
    // Abre a conversa já no final (mensagens mais recentes) — o embaçado
    // só aparece ao rolar pra cima, em direção às mensagens mais antigas.
    container.scrollTop = container.scrollHeight;
  }, [isBiancaConversation]);

  useEffect(() => {
    if (!isBiancaConversation) return;
    const container = scrollRef.current;
    const trigger = fogTriggerRef.current;
    if (!container || !trigger) return;

    function handleScroll() {
      if (!container || !trigger) return;
      const containerRect = container.getBoundingClientRect();
      const triggerRect = trigger.getBoundingClientRect();
      const triggerTop = triggerRect.top - containerRect.top + container.scrollTop;

      if (container.scrollTop > triggerTop || triggerTop <= 0) {
        setFog({ blur: 0, opacity: 0 });
        return;
      }

      const progress = Math.min(1, (triggerTop - container.scrollTop) / triggerTop);
      setFog({
        blur: FOG_MIN_BLUR + progress * (FOG_MAX_BLUR - FOG_MIN_BLUR),
        opacity: FOG_MIN_OPACITY + progress * (FOG_MAX_OPACITY - FOG_MIN_OPACITY),
      });
    }

    handleScroll();
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [isBiancaConversation]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="flex shrink-0 items-center gap-3 border-b border-border px-4 py-3">
        <button onClick={onBack} className="lg:hidden" aria-label="Voltar">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <Image
          src={conversation.avatarOverride ?? avatarUrl(user.id)}
          alt={maskUsername(conversation.displayNameOverride ?? user.username)}
          width={36}
          height={36}
          className="h-[36px] w-[36px] rounded-full object-cover blur-sm"
        />
        <span className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-foreground">{maskUsername(conversation.displayNameOverride ?? user.username)}</p>
          <p className="truncate text-xs text-muted-foreground">Online há 47 min</p>
        </span>
        <div className="flex shrink-0 items-center gap-4">
          <button aria-label="Ligar">
            <Phone className="h-5 w-5 text-foreground" />
          </button>
          <button aria-label="Chamada de vídeo">
            <Video className="h-6 w-6 text-foreground" />
          </button>
          <button aria-label="Etiquetas" className="relative">
            <Tag className="h-5 w-5 text-foreground" />
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-blue-500" />
          </button>
        </div>
      </header>
      <div className="relative min-h-0 flex-1">
        <div ref={scrollRef} className="h-full space-y-2 overflow-y-auto p-4">
        {conversation.messages.map((m) => {
          const outgoing = m.fromUserId === CURRENT_USER_ID;
          return (
            <div
              key={m.id}
              ref={m.id === FOG_TRIGGER_MESSAGE_ID ? fogTriggerRef : undefined}
              className={`flex items-end gap-1.5 ${outgoing ? "justify-end" : "justify-start"}`}
            >
              {!outgoing && (
                <Image
                  src={conversation.avatarOverride ?? avatarUrl(user.id)}
                  alt=""
                  width={24}
                  height={24}
                  className="h-6 w-6 shrink-0 rounded-full object-cover blur-sm"
                />
              )}
              {m.kind === "audio" && m.audioDuration ? (
                <AudioBubble duration={m.audioDuration} outgoing={outgoing} />
              ) : m.kind === "photo" && m.photoUrl ? (
                <div className="flex items-center gap-2">
                  <div className={`relative ${conversation.id === "c1" ? "w-[132px]" : "w-[220px]"}`}>
                    <Image
                      src={m.photoUrl}
                      alt=""
                      width={240}
                      height={300}
                      className="h-auto w-full rounded-2xl object-cover"
                    />
                    {conversation.id === "c1" && (
                      <Play
                        className="absolute right-2 top-2 h-[20%] w-[20%] fill-white text-white"
                        strokeWidth={0}
                      />
                    )}
                  </div>
                  {conversation.id === "c1" && <Send className="h-5 w-5 shrink-0 text-foreground" />}
                </div>
              ) : (
                <span
                  className={`max-w-[70%] rounded-2xl px-3 py-2 text-sm ${
                    outgoing ? OUTGOING_BUBBLE : "bg-secondary text-foreground"
                  }`}
                >
                  {m.text ? renderMessageText(m.text) : m.text}
                </span>
              )}
            </div>
          );
        })}
        </div>
        {isBiancaConversation && fog.opacity > 0 && (
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backdropFilter: `blur(${fog.blur}px)`,
              backgroundColor: `rgba(0, 0, 0, ${fog.opacity})`,
              transition: "backdrop-filter 120ms linear, background-color 120ms linear",
            }}
          />
        )}
      </div>
      <div className="flex shrink-0 items-center gap-3 border-t border-border p-3">
        <div className="flex flex-1 items-center gap-2 rounded-full bg-secondary py-1 pl-1 pr-4">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-600">
            <Camera className="h-4 w-4 text-white" />
          </span>
          <input
            placeholder="Mensagem..."
            className="w-full min-w-0 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        </div>
        <Mic className="h-6 w-6 shrink-0 text-foreground" />
        <ImageIcon className="h-6 w-6 shrink-0 text-foreground" />
        <MessageCircleMore className="h-6 w-6 shrink-0 text-foreground" />
        <CirclePlus className="h-6 w-6 shrink-0 text-foreground" />
      </div>
    </div>
  );
}
