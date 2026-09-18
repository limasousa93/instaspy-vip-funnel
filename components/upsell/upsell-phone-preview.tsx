"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import Image from "next/image";
import {
  Archive,
  Camera,
  ChevronLeft,
  Crown,
  Lock,
  MessageCircle,
  MoreHorizontal,
  MoreVertical,
  Phone,
  Play,
  Plus,
  RotateCcw,
  Search,
  Smile,
  Video,
  Wrench,
  X,
} from "lucide-react";
import { photoUrl } from "@/lib/media";
import { buildCheckoutUrl } from "@/lib/tracking/checkout-url";
import { trackEvent } from "@/lib/tracking/track-event";

interface ChatMessage {
  from: "received" | "sent";
  time: string;
  kind?: "photo" | "video" | "audio";
  text?: string;
  audioDuration?: string;
}

interface Contact {
  id: string;
  name: string;
  preview: string;
  time: string;
  unread?: number;
  clickable?: boolean;
  messages?: ChatMessage[];
}

const CONTACTS: Contact[] = [
  {
    id: "felipe",
    name: "Grupo Sex****",
    preview: "📷 Foto",
    time: "09:09",
    clickable: true,
    messages: [
      { from: "received", text: "Bom dia! Como foi sua noite? 😄 Dormiu bem?", time: "08:55" },
      { from: "sent", text: "Bom dia! Dormi super bem, acordei disposto hoje ☀️ Café já tá pronto aqui também ☕", time: "08:56" },
      { from: "received", text: "Que ótimo! Aqui também foi tranquilo 😊", time: "08:58" },
      { from: "sent", text: "Vou treinar daqui a pouco, bateu aquela vontade 💪", time: "09:01" },
      { from: "received", text: "Vai com tudo! Depois me conta como foi 🔥", time: "09:02" },
      { from: "sent", kind: "audio", audioDuration: "0:42", time: "09:05" },
      { from: "received", kind: "photo", time: "09:06" },
      { from: "sent", text: "Kkkkkk manda mais 😍🔥", time: "09:07" },
      { from: "received", kind: "video", time: "09:08" },
      { from: "sent", text: "To named vendo isso aqui 🙈", time: "09:09" },
      { from: "received", kind: "audio", audioDuration: "0:19", time: "09:10" },
      { from: "sent", text: "Combinado então, mais tarde a gente se fala 😉", time: "09:11" },
    ],
  },
  {
    id: "livia",
    name: "Apaix*****",
    preview: "Oi boa tarde",
    time: "09:08",
    clickable: true,
    messages: [
      { from: "received", text: "Oi, amiga! Já viu o céu hoje? 😍 Tá simplesmente lindo!", time: "10:18" },
      { from: "sent", text: "Vi sim! 😍 Tava toda hora olhando pela janela. As nuvens tão diferentes, parece até um quadro. ☁️", time: "10:19" },
      { from: "received", text: "E os passarinhos... que espetáculo! Fazem a gente lembrar como a vida é linda, né? 🐦💙", time: "10:20" },
      { from: "sent", kind: "photo", time: "10:21" },
      { from: "received", text: "É, Deus capricha nos detalhes né? ✨", time: "10:22" },
      { from: "sent", kind: "audio", audioDuration: "1:05", time: "10:23" },
      { from: "received", kind: "video", time: "10:24" },
      { from: "sent", text: "Ameiii, guarda isso pra mim 🙈💕", time: "10:25" },
      { from: "received", kind: "audio", audioDuration: "0:33", time: "10:26" },
      { from: "sent", text: "Combinado! Bora aproveitar bastante esse dia 😁", time: "10:27" },
    ],
  },
  { id: "whatsapp", name: "WhatsApp Business", preview: "Prepare-se para a temporada mais movimentada do ano 🎁", time: "Ontem", unread: 17 },
  { id: "mainha", name: "Ma***❤️", preview: "Chegou bem? Manda msg quando puder 🙏", time: "09:15" },
  { id: "vo", name: "Vó***🙏💕", preview: "Deus te abençoe hoje, netinha 💗", time: "terça-feira" },
  { id: "facul", name: "Am***👯‍♀️", preview: "Duda: gente marca o rolê pra sábado?? 🎉", time: "08:40", unread: 5 },
  { id: "zueira", name: "Gr***😂", preview: "Bru: aaaaaaa nao aguento 🤣🤣", time: "07:58", unread: 12 },
  { id: "trabalho", name: "Tr***💼", preview: "Reunião remarcada para 15h", time: "segunda-feira" },
  { id: "camila", name: "Ca***🌸", preview: "Consegui o vestido!! Vem ver 👗", time: "domingo" },
  { id: "familia", name: "Fa***❤️👨‍👩‍👧", preview: "Papai: cheguem cedo domingo", time: "sábado", unread: 3 },
  { id: "personal", name: "Pe***🏋️‍♀️", preview: "Treino de amanhã confirmado às 7h", time: "sexta-feira" },
  { id: "manicure", name: "Ma***💅", preview: "Oi linda, remarcamos pra quinta?", time: "quinta-feira" },
  { id: "exbestie", name: "Ex***😒", preview: "...", time: "12/08/2026" },
  { id: "igreja", name: "Gr***🙏✨", preview: "Pastora Ana: não esqueçam o encontro de sexta", time: "quarta-feira", unread: 2 },
  { id: "fernanda", name: "Fe***💗", preview: "Amiga socorro, olha essa foto 😱", time: "terça-feira" },
  { id: "bia", name: "Pr***🎀", preview: "Vc vai no aniversário da vovó?", time: "segunda-feira" },
  { id: "casamento", name: "Gr***👰💍", preview: "Noiva: já escolhi o buquê 💐", time: "30/08/2026", unread: 8 },
  { id: "vizinha", name: "Vi***🏠", preview: "Vc viu a encomenda que chegou?", time: "29/08/2026" },
  { id: "yoga", name: "Yo***🧘‍♀️", preview: "Aula de amanhã mudou de horário", time: "28/08/2026" },
  { id: "maes", name: "Mã***👶", preview: "Tem festinha no playground sábado!", time: "27/08/2026", unread: 4 },
  { id: "nutri", name: "Nu***💊", preview: "Sua dieta da semana chegou 📋", time: "26/08/2026" },
  { id: "dermato", name: "Dr***🩺", preview: "Confirmando sua consulta de terça", time: "25/08/2026" },
  { id: "viagem", name: "Gr***🧳✈️", preview: "Já reservei o hotel!! 🏨", time: "24/08/2026", unread: 6 },
  { id: "cunhada", name: "Cu***🤍", preview: "Beijos, até domingo!", time: "23/08/2026" },
  { id: "sogra", name: "So***🙄", preview: "Vocês vêm almoçar aqui?", time: "22/08/2026" },
  { id: "chadepanela", name: "Gr***🎁", preview: "Fal: já separei os presentes 🎀", time: "21/08/2026", unread: 1 },
  { id: "marcelo", name: "Ma***🎥", preview: "Oi, tô ao vivo no Zoom mostrando como...", time: "quarta-feira", unread: 7 },
  { id: "vkuarta", name: "#7***🎥", preview: "+55 11 99884-5307 entrou usando o link do grupo", time: "quarta-feira", unread: 7 },
  { id: "desconhecido", name: "+55 81 99445-4142", preview: "?????", time: "04/09/2026" },
  { id: "enfermagem", name: "En***💉", preview: "Olá! Você participou da nossa Aula Fechada sobre...", time: "sexta-feira", unread: 1 },
];

// Runs de emoji (inclui ZWJ e seletor de variação, pra família/sequências
// compostas tipo 👨‍👩‍👧 não quebrarem no meio).
const EMOJI_RUN_REGEX = /[\p{Extended_Pictographic}\p{Emoji_Presentation}‍️]+/gu;

// Safari/iOS tem um bug antigo de renderização: `filter: blur()` em elemento
// `inline` (display padrão de <span>) às vezes simplesmente não aparece,
// principalmente dentro de contêiner com `overflow`/`white-space: nowrap`
// (como o `.truncate` da lista). Forçar `inline-block` + o filter via style
// inline (além da classe do Tailwind) resolve — o elemento passa a ter seu
// próprio contexto de composição em vez de ficar "solto" no fluxo de texto.
const BLUR_TEXT_STYLE: CSSProperties = { filter: "blur(4px)", WebkitFilter: "blur(4px)" };

/** Borra todo o texto de uma mensagem, deixando só os emojis legíveis. */
function renderBlurredText(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  const regex = new RegExp(EMOJI_RUN_REGEX);
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text))) {
    if (match.index > lastIndex) {
      nodes.push(
        <span key={`t-${lastIndex}`} className="inline-block select-none" style={BLUR_TEXT_STYLE}>
          {text.slice(lastIndex, match.index)}
        </span>,
      );
    }
    nodes.push(<span key={`e-${match.index}`}>{match[0]}</span>);
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    nodes.push(
      <span key={`t-${lastIndex}`} className="inline-block select-none" style={BLUR_TEXT_STYLE}>
        {text.slice(lastIndex)}
      </span>,
    );
  }
  return nodes;
}

/**
 * Avatar com foto aleatória (picsum, seed = id do contato) sempre borrada.
 * `overflow-hidden` + `border-radius` no pai, com filter no filho, é outra
 * combinação que o Safari/iOS às vezes recusa a renderizar (mesmo bug de
 * WebKit documentado em `BLUR_TEXT_STYLE` acima) — `-webkit-filter` inline
 * e `translateZ(0)` no pai forçam o Safari a compor tudo numa camada só.
 */
function ContactAvatar({ contact, size = 36 }: { contact: Contact; size?: number }) {
  return (
    <div
      className="relative shrink-0 overflow-hidden rounded-full bg-white/10"
      style={{ width: size, height: size, transform: "translateZ(0)", WebkitTransform: "translateZ(0)" }}
    >
      <Image
        src={photoUrl(`${contact.id}-avatar`, 120, 120)}
        alt=""
        fill
        sizes={`${size}px`}
        className="object-cover"
        style={{ filter: "blur(6px)", WebkitFilter: "blur(6px)" }}
      />
    </div>
  );
}

const WHATSAPP_GLYPH_PATH =
  "M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.86 9.86 0 0 0 12.04 2zm0 18.13h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.36c0-4.54 3.7-8.24 8.25-8.24a8.2 8.2 0 0 1 5.83 2.42 8.19 8.19 0 0 1 2.41 5.83c0 4.55-3.7 8.21-8.24 8.21zm4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.97-.14.17-.29.19-.53.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.24-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.15.16-.25.25-.42.08-.17.04-.31-.02-.43-.06-.12-.56-1.36-.77-1.86-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.24 3.74.59.26 1.06.41 1.42.52.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.14-1.18-.06-.11-.23-.17-.48-.29z";

/** Avatar redondo com a mesma imagem/ícone do WhatsApp já usado na lista (contato "WhatsApp Business"), pra usar na aba "Você" do rodapé. */
function WhatsAppRoundIcon({ size = 19 }: { size?: number }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center overflow-hidden rounded-full"
      style={{ width: size, height: size, backgroundColor: "#25D366" }}
    >
      <svg viewBox="0 0 24 24" width={size * 0.62} height={size * 0.62} fill="#fff">
        <path d={WHATSAPP_GLYPH_PATH} />
      </svg>
    </div>
  );
}

/** Banner "estilo Seja VIP" — mesmo padrão do VipUnlockCard (components/feed/vip-unlock-banner.tsx), adaptado pro upgrade do WhatsApp. */
function VipUpgradeBanner({ checkoutUrl, onClose }: { checkoutUrl: string; onClose: () => void }) {
  function handleUnlock() {
    trackEvent("InitiateCheckout", { currency: "BRL", value: 19.9 });
    window.location.href = buildCheckoutUrl(checkoutUrl);
  }

  return (
    <div
      className="absolute inset-0 z-30 flex items-center justify-center bg-black/70 px-6"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div className="flex w-full max-w-[260px] flex-col items-center gap-3" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-black shadow-lg active:opacity-70"
        >
          <X className="h-4 w-4" strokeWidth={2.5} />
        </button>

        <div className="flex w-full flex-col gap-3 rounded-2xl bg-[#111214] p-4" style={{ border: "1px solid rgba(255,255,255,0.12)" }}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/5">
              <Crown className="h-5 w-5 fill-amber-400 text-amber-400" />
            </div>
            <p className="text-left text-xs font-bold leading-snug text-white">
              Atualize e tenha acesso a tudo por apenas <span style={{ color: "#25D366" }}>R$ 19,90</span>
            </p>
          </div>

          <button
            type="button"
            onClick={handleUnlock}
            className="w-full rounded-full py-2.5 text-sm font-bold text-white active:opacity-90"
            style={{
              background: "linear-gradient(180deg, #2fe677, #1fb959)",
              boxShadow: "0 6px 18px rgba(37,211,102,0.4), inset 0 1px 0 rgba(255,255,255,0.3)",
            }}
          >
            Desbloquear
          </button>
        </div>
      </div>
    </div>
  );
}

// Fase de cada onda (não Math.random(), pra ficar determinístico e não gerar
// mismatch de hydration — mesma técnica de components/messages/conversation-view.tsx).
function waveformBars(phase: number): number[] {
  return Array.from({ length: 16 }, (_, i) => 4 + Math.round(Math.abs(Math.sin(i * phase)) * 10));
}

/** Gera um horário HH:MM plausível (entre 07h e 22h). */
function randomClockTime(): string {
  const hour = 7 + Math.floor(Math.random() * 16);
  const minute = Math.floor(Math.random() * 60);
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

// IDs dos contatos cujo `time` é um horário real (HH:MM) — os demais usam
// dia da semana/data e não entram na randomização.
const CLOCK_TIME_CONTACT_IDS = ["felipe", "livia", "mainha"] as const;

/**
 * Mockup fotorrealista de iPhone com a lista "Conversas" (topo com ícones,
 * busca, arquivadas, lista com scroll e barra de abas embaixo) — fotos de
 * perfil e mensagens sempre borradas (só os emojis aparecem). Só os 2
 * primeiros contatos abrem o chat (também borrado, tela cheia); qualquer
 * outro clique mostra o banner "Seja VIP" de upgrade por R$ 19,90.
 *
 * Cores em hex puro (mesmo motivo documentado em app/globals.css): nada de
 * bg-gradient-to-r/bg-violet-600 do Tailwind, que quebra em Safari antigo.
 */
export function UpsellPhonePreview({
  checkoutUrl,
  revealed,
  onRequestSearch,
}: {
  checkoutUrl: string;
  /** false = tela toda borrada com selo de cadeado + CTA; true = mockup normal (revelado após a busca). */
  revealed: boolean;
  onRequestSearch: () => void;
}) {
  const [activeContactId, setActiveContactId] = useState<string | null>(null);
  const activeContact = CONTACTS.find((c) => c.id === activeContactId) ?? null;
  const [showListBanner, setShowListBanner] = useState(false);
  const [showChatBanner, setShowChatBanner] = useState(false);

  // Randomiza os horários no formato HH:MM só depois de montado, pra não
  // gerar mismatch de hydration SSR/cliente (mesmo motivo documentado em
  // components/messages/conversation-view.tsx).
  const [clockTimes, setClockTimes] = useState<Record<string, string>>({});
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setClockTimes(Object.fromEntries(CLOCK_TIME_CONTACT_IDS.map((id) => [id, randomClockTime()])));
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, []);

  function handleContactClick(contact: Contact) {
    if (contact.clickable) {
      setActiveContactId(contact.id);
      setShowChatBanner(true);
    } else {
      setShowListBanner(true);
    }
  }

  return (
    <div className="relative w-full max-w-[340px]">
      <div
        aria-hidden
        className="absolute -left-[3px] top-[100px] h-7 w-[3px] rounded-l-sm"
        style={{ background: "linear-gradient(180deg, #3a3a3e, #17171a)" }}
      />
      <div
        aria-hidden
        className="absolute -left-[3px] top-[145px] h-12 w-[3px] rounded-l-sm"
        style={{ background: "linear-gradient(180deg, #3a3a3e, #17171a)" }}
      />
      <div
        aria-hidden
        className="absolute -left-[3px] top-[200px] h-12 w-[3px] rounded-l-sm"
        style={{ background: "linear-gradient(180deg, #3a3a3e, #17171a)" }}
      />
      <div
        aria-hidden
        className="absolute -right-[3px] top-[152px] h-[76px] w-[3px] rounded-r-sm"
        style={{ background: "linear-gradient(180deg, #3a3a3e, #17171a)" }}
      />

      <div
        className="rounded-[52px] p-[5px]"
        style={{
          background: "linear-gradient(160deg, #59595e 0%, #232326 14%, #0a0a0b 55%, #1c1c1f 85%, #4d4d52 100%)",
          boxShadow:
            "0 45px 80px -20px rgba(0,0,0,0.65), 0 14px 28px -10px rgba(0,0,0,0.55), 0 0 100px -12px rgba(139,92,246,0.28), inset 0 0 0 1px rgba(255,255,255,0.06)",
        }}
      >
        <div className="rounded-[47px] bg-black p-[9px]">
          <div className="relative flex h-[700px] flex-col overflow-hidden rounded-[38px] bg-[#0b0b0f]">
            <div
              aria-hidden
              className="absolute left-1/2 top-[10px] z-20 flex h-[26px] w-[112px] -translate-x-1/2 items-center justify-end rounded-full bg-black pr-2.5"
            >
              <span className="h-[7px] w-[7px] rounded-full bg-[#151522]" />
            </div>

            <div className="flex shrink-0 items-center justify-between px-6 pb-1 pt-3.5 text-[11px] font-semibold text-white">
              <span>{activeContact ? "10:24" : "09:09"}</span>
              <div className="flex items-center gap-1 opacity-90">
                <svg width="13" height="9" viewBox="0 0 18 12" fill="#fff"><rect x="0" y="7" width="3" height="5" rx="0.5"/><rect x="5" y="5" width="3" height="7" rx="0.5"/><rect x="10" y="3" width="3" height="9" rx="0.5"/><rect x="15" y="0" width="3" height="12" rx="0.5"/></svg>
                <svg width="12" height="9" viewBox="0 0 16 12" fill="#fff"><path d="M8 10.5a1.4 1.4 0 1 1 0-2.8 1.4 1.4 0 0 1 0 2.8zM5 7.2a4.3 4.3 0 0 1 6 0l-1.1 1.1a2.7 2.7 0 0 0-3.8 0L5 7.2zM2.6 4.7a7.8 7.8 0 0 1 10.8 0l-1.1 1.1a6.2 6.2 0 0 0-8.6 0L2.6 4.7z"/></svg>
                <svg width="20" height="9" viewBox="0 0 25 12" fill="none"><rect x="0.5" y="0.5" width="20" height="11" rx="2.5" stroke="#fff"/><rect x="2" y="2" width="16" height="8" rx="1" fill="#fff"/><rect x="21.5" y="4" width="2" height="4" rx="1" fill="#fff"/></svg>
              </div>
            </div>

            <div className="relative min-h-0 flex-1">
              <div
                className={`relative h-full w-full ${revealed ? "" : "pointer-events-none"}`}
                style={
                  revealed
                    ? undefined
                    : {
                        filter: "blur(14px)",
                        WebkitFilter: "blur(14px)",
                        transform: "translateZ(0)",
                        WebkitTransform: "translateZ(0)",
                      }
                }
              >
              {/* ---------- Tela: lista de conversas ---------- */}
              <div
                className={`absolute inset-0 flex flex-col transition-transform duration-300 ease-out ${
                  activeContact ? "-translate-x-full" : "translate-x-0"
                }`}
              >
                <div className="flex shrink-0 items-center justify-between px-4 pb-2 pt-1">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10">
                    <MoreHorizontal className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10">
                      <Camera className="h-3.5 w-3.5 text-white" />
                    </div>
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white">
                      <Plus className="h-3.5 w-3.5 text-black" />
                    </div>
                  </div>
                </div>

                <div className="shrink-0 px-4 pb-2 text-[19px] font-extrabold text-white">Conversas</div>

                <div className="mx-4 mb-2.5 flex shrink-0 items-center gap-2 rounded-[10px] bg-[#1c1c1e] px-3 py-2">
                  <Search className="h-3.5 w-3.5 text-white/45" />
                  <span className="text-[11px] text-white/45">Pesquisar</span>
                </div>

                <div className="flex shrink-0 items-center gap-2 border-b border-white/[0.07] px-4 pb-2.5 text-[10.5px] font-semibold text-white/65">
                  <Archive className="h-3.5 w-3.5 text-white/65" />
                  Arquivadas
                </div>

                <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-4">
                  {CONTACTS.map((contact) => (
                    <button
                      key={contact.id}
                      type="button"
                      onClick={() => handleContactClick(contact)}
                      className="flex w-full items-center gap-3 border-b border-white/[0.06] py-2.5 text-left active:bg-white/5"
                    >
                      <ContactAvatar contact={contact} size={44} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-[13px] font-bold text-white">{contact.name}</p>
                          <span className={`shrink-0 text-[10px] ${contact.unread ? "font-semibold" : "text-white/40"}`} style={contact.unread ? { color: "#25D366" } : undefined}>
                            {clockTimes[contact.id] ?? contact.time}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-[11px] text-white/45">{renderBlurredText(contact.preview)}</p>
                          {contact.unread && (
                            <span
                              className="flex h-[18px] min-w-[18px] shrink-0 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white"
                              style={{ backgroundColor: "#25D366" }}
                            >
                              {contact.unread}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex shrink-0 items-start justify-between border-t border-white/[0.08] px-2 pb-1.5 pt-1.5">
                  {[
                    { icon: RotateCcw, label: "Atualizações" },
                    { icon: Phone, label: "Ligações", badge: 1 },
                    { icon: Wrench, label: "Ferramentas", dot: true },
                    { icon: MessageCircle, label: "Conversas", badge: 15, active: true },
                    { icon: null, label: "Você", badge: 1 },
                  ].map(({ icon: Icon, label, badge, dot, active }) => (
                    <div key={label} className="relative flex flex-1 flex-col items-center gap-1">
                      {badge && (
                        <span
                          className="absolute -right-1 -top-1 flex h-[15px] min-w-[15px] items-center justify-center rounded-full px-1 text-[9px] font-bold text-white"
                          style={{ backgroundColor: "#25D366" }}
                        >
                          {badge}
                        </span>
                      )}
                      {dot && (
                        <span className="absolute -right-0.5 -top-0.5 h-[6px] w-[6px] rounded-full" style={{ backgroundColor: "#25D366" }} />
                      )}
                      {Icon ? (
                        <Icon className={`h-[19px] w-[19px] ${active ? "text-white" : "text-white/45"}`} />
                      ) : (
                        <WhatsAppRoundIcon size={19} />
                      )}
                      <span className={`text-[8px] ${active ? "font-bold text-white" : "text-white/45"}`}>{label}</span>
                    </div>
                  ))}
                </div>

                {showListBanner && <VipUpgradeBanner checkoutUrl={checkoutUrl} onClose={() => setShowListBanner(false)} />}
              </div>

              {/* ---------- Tela: conversa individual ---------- */}
              <div
                className={`absolute inset-0 flex flex-col transition-transform duration-300 ease-out ${
                  activeContact ? "translate-x-0" : "translate-x-full"
                }`}
              >
                {activeContact && (
                  <>
                    <div className="flex shrink-0 items-center gap-2 border-b border-white/[0.06] px-3 py-2.5">
                      <button
                        type="button"
                        onClick={() => setActiveContactId(null)}
                        className="flex shrink-0 items-center gap-0.5 text-white/70"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="text-[12px]">15</span>
                      </button>
                      <div className="ml-1">
                        <ContactAvatar contact={activeContact} size={32} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[12px] font-bold text-white">{activeContact.name}</p>
                        <p className="text-[10px] text-white/40">online</p>
                      </div>
                      <Video className="h-3.5 w-3.5 shrink-0 text-white/50" />
                      <Phone className="h-3.5 w-3.5 shrink-0 text-white/50" />
                      <MoreVertical className="h-3.5 w-3.5 shrink-0 text-white/50" />
                    </div>

                    <div
                      className="no-scrollbar relative flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto px-3 py-3"
                      style={{
                        backgroundImage: "radial-gradient(rgba(255,255,255,0.035) 1px, transparent 1px)",
                        backgroundSize: "20px 20px",
                      }}
                      onClick={() => setShowChatBanner(true)}
                    >
                      {(activeContact.messages ?? []).map((message, i) => {
                        const align = message.from === "sent" ? "self-end rounded-tr-sm" : "self-start rounded-tl-sm";
                        const bg = message.from === "sent" ? "#005c4b" : "#1f2c34";

                        if (message.kind === "photo" || message.kind === "video") {
                          return (
                            <div
                              key={i}
                              className={`relative h-[150px] w-[150px] shrink-0 overflow-hidden rounded-xl ${align}`}
                              style={{ transform: "translateZ(0)", WebkitTransform: "translateZ(0)" }}
                            >
                              <Image
                                src={photoUrl(`${activeContact.id}-msg-${i}`, 320, 320)}
                                alt=""
                                fill
                                sizes="150px"
                                className="object-cover"
                                style={{ filter: "blur(9px)", WebkitFilter: "blur(9px)" }}
                              />
                              {message.kind === "video" && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div
                                    className="flex h-9 w-9 items-center justify-center rounded-full"
                                    style={{ background: "rgba(0,0,0,0.55)" }}
                                  >
                                    <Play className="h-4 w-4 text-white" fill="white" />
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        }

                        if (message.kind === "audio") {
                          return (
                            <div
                              key={i}
                              className={`flex w-[190px] shrink-0 items-center gap-2 rounded-xl px-2.5 py-2 ${align}`}
                              style={{ backgroundColor: bg }}
                            >
                              <div
                                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                                style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
                              >
                                <Play className="h-3 w-3 text-white" fill="white" />
                              </div>
                              <span className="flex h-5 flex-1 items-center gap-[2px]">
                                {waveformBars(i + 1.3).map((h, j) => (
                                  <span
                                    key={j}
                                    className="w-[2px] shrink-0 rounded-full"
                                    style={{ height: `${h}px`, backgroundColor: "rgba(255,255,255,0.5)" }}
                                  />
                                ))}
                              </span>
                              <span className="shrink-0 text-[10px] text-white/60">{message.audioDuration}</span>
                            </div>
                          );
                        }

                        return (
                          <div
                            key={i}
                            className={`max-w-[75%] rounded-xl px-2.5 py-1.5 text-[11px] leading-snug text-[#e9edef] ${align}`}
                            style={{ backgroundColor: bg }}
                          >
                            {renderBlurredText(message.text ?? "")}
                          </div>
                        );
                      })}

                      {showChatBanner && (
                        <VipUpgradeBanner checkoutUrl={checkoutUrl} onClose={() => setShowChatBanner(false)} />
                      )}
                    </div>

                    <div className="flex shrink-0 items-center gap-2 border-t border-white/[0.06] px-3 py-2.5">
                      <Plus className="h-4 w-4 shrink-0 text-white/50" />
                      <div className="flex flex-1 items-center justify-between rounded-full bg-[#1f2c34] px-3 py-1.5">
                        <span className="text-[10px] text-white/40">Mensagem</span>
                        <Smile className="h-3.5 w-3.5 text-white/40" />
                      </div>
                      <Camera className="h-4 w-4 shrink-0 text-white/50" />
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff80" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="2" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M12 18v3"/></svg>
                    </div>
                  </>
                )}
              </div>
              </div>

              {!revealed && (
                <div className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-5 bg-black/45 px-8">
                  <div
                    className="flex h-[88px] w-[88px] shrink-0 items-center justify-center rounded-full"
                    style={{ background: "rgba(37,211,102,0.12)", border: "2px solid rgba(37,211,102,0.5)" }}
                  >
                    <Lock className="h-10 w-10" style={{ color: "#25D366" }} />
                  </div>
                  <button
                    type="button"
                    onClick={onRequestSearch}
                    className="rounded-full px-6 py-3 text-sm font-bold text-white active:opacity-90"
                    style={{
                      background: "linear-gradient(180deg, #2fe677, #1fb959)",
                      boxShadow: "0 6px 18px rgba(37,211,102,0.4), inset 0 1px 0 rgba(255,255,255,0.3)",
                    }}
                  >
                    Faça um teste grátis
                  </button>
                </div>
              )}
            </div>

            <div className="flex shrink-0 justify-center pb-2 pt-1">
              <div className="h-1 w-24 rounded-full bg-white/80" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
