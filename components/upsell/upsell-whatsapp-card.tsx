"use client";

import { useState, type ChangeEvent } from "react";
import Image from "next/image";
import { Check, Loader2, Lock, Play } from "lucide-react";
import { photoUrl } from "@/lib/media";
import type { WhatsAppLookupData } from "@/lib/whatsapp/apify-client";

type CardState = "idle" | "loading" | "result" | "blocked";

// Fase de cada onda (não Math.random(), pra ficar determinístico e não gerar
// mismatch de hydration — mesma técnica de components/messages/conversation-view.tsx).
const AUDIO_SAMPLES = [
  { duration: "0:12", phase: 1.3 },
  { duration: "0:47", phase: 1.9 },
  { duration: "1:03", phase: 2.5 },
];

function waveformBars(phase: number): number[] {
  return Array.from({ length: 18 }, (_, i) => 4 + Math.round(Math.abs(Math.sin(i * phase)) * 12));
}

/**
 * Formata até 11 dígitos (DDD + 9 + número) como "11 9 9999-9999".
 * Recebe só dígitos — a extração de dígitos é responsabilidade de quem chama.
 */
export function formatBrazilianDigits(digits: string): string {
  let formatted = digits.slice(0, 2);
  if (digits.length > 2) formatted += ` ${digits.slice(2, 3)}`;
  if (digits.length > 3) formatted += ` ${digits.slice(3, 7)}`;
  if (digits.length > 7) formatted += `-${digits.slice(7, 11)}`;
  return formatted;
}

/** Conta quantos dígitos existem em `text` antes da posição `caretIndex`. */
export function countDigitsBefore(text: string, caretIndex: number): number {
  return text.slice(0, caretIndex).replace(/\D/g, "").length;
}

/** Acha, no texto já formatado, a posição do caractere logo após o N-ésimo dígito. */
export function caretPositionAfterDigit(formatted: string, digitCount: number): number {
  if (digitCount <= 0) return 0;
  let seen = 0;
  for (let i = 0; i < formatted.length; i++) {
    if (/\d/.test(formatted[i])) {
      seen++;
      if (seen === digitCount) return i + 1;
    }
  }
  return formatted.length;
}

const WHATSAPP_ICON_PATH =
  "M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.86 9.86 0 0 0 12.04 2zm0 18.13h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.36c0-4.54 3.7-8.24 8.25-8.24a8.2 8.2 0 0 1 5.83 2.42 8.19 8.19 0 0 1 2.41 5.83c0 4.55-3.7 8.21-8.24 8.21zm4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.97-.14.17-.29.19-.53.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.24-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.15.16-.25.25-.42.08-.17.04-.31-.02-.43-.06-.12-.56-1.36-.77-1.86-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.24 3.74.59.26 1.06.41 1.42.52.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.14-1.18-.06-.11-.23-.17-.48-.29z";

const GREEN_CTA_STYLE = {
  background: "linear-gradient(180deg, #2fe677, #1fb959)",
  boxShadow: "0 6px 18px rgba(37,211,102,0.4), inset 0 1px 0 rgba(255,255,255,0.3)",
};

/** Grids borrados de fotos, vídeos e áudios "enviados" — mostrados no resultado da consulta e direto na página. */
export function UpsellWhatsAppMediaPreview({ seed, className = "" }: { seed: string; className?: string }) {
  return (
        <div className={`flex w-full flex-col gap-5 ${className}`}>
          <div>
            <p className="mb-2 text-center text-base font-extrabold text-white">Últimas fotos enviadas 🔒</p>
            <div className="grid grid-cols-3 gap-2">
              {["/fot1.png", "/fot2.png", "/fot3.png"].map((src) => (
                <div
                  key={src}
                  className="relative aspect-square overflow-hidden rounded-lg bg-white/5"
                  style={{ transform: "translateZ(0)", WebkitTransform: "translateZ(0)" }}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="100px"
                    className="object-cover"
                    style={{ filter: "blur(10px)", WebkitFilter: "blur(10px)" }}
                  />
                </div>
              ))}
            </div>
          </div>
  
          <div>
            <p className="mb-2 text-center text-base font-extrabold text-white">Últimos vídeos enviados 🔒</p>
            <div className="grid grid-cols-3 gap-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="relative aspect-square overflow-hidden rounded-lg bg-white/5"
                  style={{ transform: "translateZ(0)", WebkitTransform: "translateZ(0)" }}
                >
                  <Image
                    src={photoUrl(`${seed}-video-${i}`, 200, 200)}
                    alt=""
                    fill
                    sizes="100px"
                    className="object-cover"
                    style={{ filter: "blur(10px)", WebkitFilter: "blur(10px)" }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="flex h-7 w-7 items-center justify-center rounded-full"
                      style={{ background: "rgba(0,0,0,0.55)" }}
                    >
                      <Play className="h-3.5 w-3.5 text-white" fill="white" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
  
          <div>
            <p className="mb-2 text-center text-base font-extrabold text-white">Últimos áudios enviados 🔒</p>
            <div className="flex flex-col gap-2">
              {AUDIO_SAMPLES.map((audio) => (
                <div
                  key={audio.duration}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 blur-[2px] select-none"
                  style={{ backgroundColor: "#1f2c34" }}
                >
                  <div
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
                  >
                    <Play className="h-3.5 w-3.5 text-white" fill="white" />
                  </div>
                  <span className="flex h-6 flex-1 items-center gap-[2px]">
                    {waveformBars(audio.phase).map((h, i) => (
                      <span
                        key={i}
                        className="w-[2px] shrink-0 rounded-full"
                        style={{ height: `${h}px`, backgroundColor: "rgba(255,255,255,0.5)" }}
                      />
                    ))}
                  </span>
                  <span className="shrink-0 text-xs text-white/60">{audio.duration}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
  );
}

/**
 * Card "Digite o número do WhatsApp" — mesmo modelo premium verde/vidro do
 * balão de consultar WhatsApp da Tela 4 (glow em camadas, borda verde
 * translúcida). Tem 3 estados internos:
 *  - idle: "+55" fixo + input com máscara "11 9 9999-9999" + botão
 *    "Consultar" (chama /api/whatsapp/[numero] com os dígitos completos)
 *  - loading: spinner verde enquanto o actor da Apify roda
 *  - result: card no mesmo formato da tela 3 do onboarding (preview do
 *    Instagram em components/onboarding/onboarding-flow.tsx), adaptado pra
 *    WhatsApp — foto real, stats, campos bloqueados e aviso de expiração; só
 *    o botão final dispara o checkout
 *
 * Cores em hex puro (mesmo motivo documentado em app/globals.css): nada de
 * bg-gradient-to-r/bg-green-500 do Tailwind, que quebra em Safari antigo.
 */
export function UpsellWhatsAppCard({
  onResult,
}: {
  /** Chamado assim que os dados (reais ou placeholder) chegam — usado pra revelar o mockup do celular. */
  onResult?: () => void;
}) {
  const [state, setState] = useState<CardState>("idle");
  const [digitsInput, setDigitsInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<WhatsAppLookupData | null>(null);
  // true quando o número tem formato válido mas a Apify não achou o perfil
  // (ou a busca falhou) — mostramos o mesmo card de resultado, só que com
  // foto genérica sempre borrada, em vez de um beco sem saída de erro.
  const [isPlaceholderResult, setIsPlaceholderResult] = useState(false);
  // O teste grátis só pode ser usado uma vez por sessão: depois do primeiro
  // resultado, qualquer nova consulta cai direto no banner "já usou seu
  // teste grátis" em vez de disparar outra busca real.
  const [usedFreeTrial, setUsedFreeTrial] = useState(false);

  const formattedFullNumber = `+55 ${formatBrazilianDigits(digitsInput)}`;

  function handleNumberChange(e: ChangeEvent<HTMLInputElement>) {
    const input = e.target;
    const caret = input.selectionStart ?? input.value.length;
    const digitsBeforeCaret = countDigitsBefore(input.value, caret);

    const newDigits = input.value.replace(/\D/g, "").slice(0, 11);
    setDigitsInput(newDigits);

    // Input controlado: o React só reescreve o value/cursor depois do
    // re-render, então recolocamos o cursor logo após o mesmo dígito em que
    // o usuário estava (em vez de deixá-lo pular pro fim do campo).
    requestAnimationFrame(() => {
      const newCaret = caretPositionAfterDigit(formatBrazilianDigits(newDigits), digitsBeforeCaret);
      input.setSelectionRange(newCaret, newCaret);
    });
  }

  async function handleConsultar() {
    if (digitsInput.length < 10) {
      setError("Número incompleto. Digite novamente o número corretamente.");
      return;
    }

    if (usedFreeTrial) {
      setError(null);
      setState("blocked");
      return;
    }

    const fullNumber = `55${digitsInput}`;
    setError(null);
    setState("loading");

    try {
      const response = await fetch(`/api/whatsapp/${fullNumber}`);
      if (!response.ok) {
        // Número com formato válido, mas a Apify não achou o perfil (ou a
        // busca falhou) — mostra o card de resultado normalmente, só com
        // foto genérica sempre borrada, em vez de travar numa mensagem de erro.
        setIsPlaceholderResult(true);
        setResult({
          number: fullNumber,
          displayName: "",
          about: "",
          profilePicture: photoUrl(`${fullNumber}-placeholder`, 200, 200),
          isActive: true,
          isBusiness: false,
        });
        setState("result");
        setUsedFreeTrial(true);
        onResult?.();
        return;
      }
      const data = (await response.json()) as WhatsAppLookupData;
      setIsPlaceholderResult(false);
      setResult(data);
      setState("result");
      setUsedFreeTrial(true);
      onResult?.();
    } catch {
      setIsPlaceholderResult(true);
      setResult({
        number: fullNumber,
        displayName: "",
        about: "",
        profilePicture: photoUrl(`${fullNumber}-placeholder`, 200, 200),
        isActive: true,
        isBusiness: false,
      });
      setState("result");
      setUsedFreeTrial(true);
      onResult?.();
    }
  }

  /** Volta pro formulário de busca sem resetar `usedFreeTrial` — próxima consulta cai no banner de bloqueio. */
  function handleSearchAnother() {
    setDigitsInput("");
    setError(null);
    setState("idle");
  }

  function handleUnlock() {
    document.getElementById("planos")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <div
      className="relative mt-6 w-full rounded-[24px] px-6 pb-7 pt-6 text-center"
      style={{
        background: "linear-gradient(180deg, rgba(37,211,102,0.09), rgba(255,255,255,0.05))",
        border: "1.5px solid rgba(37,211,102,0.55)",
        backdropFilter: "blur(12px)",
        boxShadow:
          "0 8px 32px rgba(0,0,0,0.45), 0 0 0 1px rgba(37,211,102,0.15), 0 0 40px rgba(37,211,102,0.25), 0 0 100px rgba(37,211,102,0.12)",
      }}
    >
      {state === "idle" && (
        <>
          <p className="mb-5 text-[22px] font-extrabold tracking-wide text-white">Digite o número do WhatsApp</p>

          <div
            className="mb-4 flex items-center gap-2 rounded-xl border py-3.5 pl-3.5 pr-4 focus-within:border-[#25D366]"
            style={{ background: "#0a0a0a", borderColor: "#3a3f47" }}
          >
            <svg viewBox="0 0 24 24" className="h-[22px] w-[22px] shrink-0" style={{ fill: "#25D366" }}>
              <path d={WHATSAPP_ICON_PATH} />
            </svg>
            <span className="shrink-0 select-none text-base text-white/70">+55</span>
            <input
              id="whatsapp-number-input"
              type="text"
              inputMode="numeric"
              value={formatBrazilianDigits(digitsInput)}
              onChange={handleNumberChange}
              placeholder="11 9 9999-9999"
              aria-label="Número do WhatsApp"
              className="w-full min-w-0 bg-transparent text-base text-white outline-none placeholder:text-white/45"
            />
          </div>

          {error && <p className="mb-4 text-sm font-semibold text-red-400">{error}</p>}

          <button type="button" onClick={handleConsultar} className="flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-base font-bold text-white active:opacity-90" style={GREEN_CTA_STYLE}>
            Consultar
          </button>
        </>
      )}

      {state === "loading" && (
        <div className="flex flex-col items-center gap-4 py-6">
          <Loader2 className="h-10 w-10 animate-spin" style={{ color: "#25D366" }} />
          <p className="text-sm font-bold text-white">Buscando dados do WhatsApp...</p>
        </div>
      )}

      {state === "result" && result && (
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-extrabold text-white sm:text-2xl">
            Confirmado no <span style={{ color: "#25D366" }}>WhatsApp</span>
          </h2>
          <p className="mt-1 text-sm text-white/70">
            Dados encontrados para o número <span className="font-semibold text-white">{formattedFullNumber}</span>
          </p>

          <div
            className="mt-5 h-20 w-20 shrink-0 overflow-hidden rounded-full"
            style={{
              border: "2px solid #25D366",
              backgroundColor: "#1c1c1e",
              transform: "translateZ(0)",
              WebkitTransform: "translateZ(0)",
            }}
          >
            {result.profilePicture ? (
              // eslint-disable-next-line @next/next/no-img-element -- domínio de CDN do WhatsApp varia por número, sem allowlist fixa em next.config
              <img
                src={result.profilePicture}
                alt=""
                className="h-full w-full object-cover"
                style={
                  isPlaceholderResult ? { filter: "blur(10px)", WebkitFilter: "blur(10px)" } : undefined
                }
              />
            ) : (
              <div className="relative h-full w-full">
                <Image
                  src={photoUrl(`${result.number}-sem-foto`, 200, 200)}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-cover"
                  style={{ filter: "blur(10px)", WebkitFilter: "blur(10px)" }}
                />
              </div>
            )}
          </div>

          <p className="mt-3 text-center text-sm font-semibold" style={{ color: "#25D366" }}>
            online há 17 min
          </p>

          {result.about && <p className="mt-4 text-center text-sm text-white/80">{result.about}</p>}

          <UpsellWhatsAppMediaPreview seed={result.number} className="mt-5" />

          <button type="button" onClick={handleUnlock} className="mt-5 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-base font-bold text-white active:opacity-90" style={GREEN_CTA_STYLE}>
            <Check className="h-5 w-5" /> Desbloquear tudo agora
          </button>

          <button type="button" onClick={handleSearchAnother} className="mt-3 text-sm font-semibold text-white/60 underline underline-offset-2">
            Consultar outro número
          </button>
        </div>
      )}

      {state === "blocked" && (
        <div className="flex flex-col items-center gap-4 py-2">
          <div
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full"
            style={{ background: "rgba(37,211,102,0.12)", border: "2px solid rgba(37,211,102,0.5)" }}
          >
            <Lock className="h-8 w-8" style={{ color: "#25D366" }} />
          </div>
          <p className="text-lg font-extrabold text-white">Você já usou seu teste grátis</p>
          <p className="text-sm text-white/70">Clique em desbloquear para ver mais.</p>
          <button type="button" onClick={handleUnlock} className="flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-base font-bold text-white active:opacity-90" style={GREEN_CTA_STYLE}>
            <Check className="h-5 w-5" /> Desbloquear
          </button>
        </div>
      )}
    </div>
  );
}
