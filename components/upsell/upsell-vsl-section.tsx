"use client";

import { useEffect, useRef, useState, type ChangeEvent, type RefObject, type ComponentType, type CSSProperties } from "react";
import { ArrowDown, Check, Clock, Image as ImageIcon, Loader2, Lock, MapPin, MessageSquare, Pause, Play, Users, Volume2 } from "lucide-react";
import { photoUrl } from "@/lib/media";
import type { WhatsAppLookupData } from "@/lib/whatsapp/apify-client";
import { UpsellWhatsAppMediaPreview, caretPositionAfterDigit, countDigitsBefore, formatBrazilianDigits } from "@/components/upsell/upsell-whatsapp-card";

// Linha do tempo do vídeo (em segundos). A análise termina em 06:00 e o resto da página surge em 06:00.
const VSL_VIDEO_URL = "https://res.cloudinary.com/tazzszbt/video/upload/v1792791165/vsl_1_1.3x.mp4";
// Duração usada só até o vídeo carregar os metadados; depois vale a duração real do arquivo.
const VSL_DURATION_SECONDS = 6 * 60 + 51;
const ANALYSIS_END_SECONDS = 6 * 60;
const CTA_SHOW_SECONDS = 6 * 60;

// Cores em hex puro (mesmo motivo documentado em app/globals.css). Fundo transparente sobre o
// backdrop do site; os cards são vidro escuro com texto claro para manter o contraste.
const GREEN = "#25D366";
const TEXT = "#ffffff";
const TEXT_MUTED = "#c4cad4";
const CARD_STYLE: CSSProperties = {
  background: "rgba(8,10,14,0.82)",
  border: "1px solid rgba(255,255,255,0.14)",
  backdropFilter: "blur(10px)",
  boxShadow: "0 8px 28px rgba(0,0,0,0.45)",
};
// Verde um pouco mais escuro que o do restante do site, usado no "Assista agora" e no botão do checkout.
const GREEN_CTA_STYLE: CSSProperties = {
  background: "linear-gradient(180deg, #17a04c, #0e7f3a)",
  boxShadow: "0 8px 24px rgba(14,127,58,0.45), inset 0 1px 0 rgba(255,255,255,0.18)",
};

type AnalysisItem = {
  title: string;
  subtitle: string;
  Icon: ComponentType<{ className?: string; style?: CSSProperties }>;
  iconBg: string;
  iconColor: string;
};

const ANALYSIS_ITEMS: AnalysisItem[] = [
  { title: "Mensagens apagadas", subtitle: "Conversas excluídas", Icon: MessageSquare, iconBg: "rgba(37,211,102,0.18)", iconColor: "#4ade80" },
  { title: "Fotos e vídeos privados", subtitle: "Imagens em conversas privadas", Icon: ImageIcon, iconBg: "rgba(244,114,182,0.18)", iconColor: "#f9a8d4" },
  { title: "Última conexão real", subtitle: "Horário exato mesmo que oculto", Icon: Clock, iconBg: "rgba(251,191,36,0.18)", iconColor: "#fcd34d" },
  { title: "Contatos e grupos ocultos", subtitle: "Pessoas e grupos em segredo", Icon: Users, iconBg: "rgba(129,140,248,0.2)", iconColor: "#a5b4fc" },
  { title: "Localização em tempo real", subtitle: "Localização compartilhada detectada", Icon: MapPin, iconBg: "rgba(45,212,191,0.18)", iconColor: "#5eead4" },
];

/** "88 99951-9617" (11 dígitos) ou "88 9995-9617" (10 dígitos), para exibir depois do "+55". */
function formatDisplayNumber(digits: string): string {
  const ddd = digits.slice(0, 2);
  const rest = digits.slice(2);
  const split = rest.length > 8 ? 5 : 4;
  return `+55 ${ddd} ${rest.slice(0, split)}-${rest.slice(split)}`;
}

// Trechos da barra (em fração da barra) e quantas vezes mais rápido que o vídeo cada um enche; o que sobra da barra enche em ritmo constante até o fim do vídeo.
const BAR_SPEED_STEPS = [
  { barEnd: 0.25, speed: 4 },
  { barEnd: 0.5, speed: 3 },
  { barEnd: 0.75, speed: 2 },
];

/**
 * Barra de progresso "acelerada": enche a 4x até 1/4, 3x até 2/4 e 2x até 3/4; o último quarto
 * se distribui pelo resto do vídeo, chegando a 100% junto com o fim dele. Depende só do tempo
 * do vídeo, então pausar a congela.
 */
function vslBarProgress(currentTime: number, duration: number): number {
  let remaining = Math.max(0, currentTime / duration); // fração do vídeo ainda não "gasta"
  let bar = 0;
  for (const { barEnd, speed } of BAR_SPEED_STEPS) {
    const stepBar = barEnd - bar;
    const stepVideo = stepBar / speed;
    if (remaining <= stepVideo) return Math.min(100, (bar + remaining * speed) * 100);
    remaining -= stepVideo;
    bar = barEnd;
  }
  const videoLeft = Math.max(1e-6, 1 - (currentTime / duration - remaining));
  return Math.min(100, (bar + ((1 - bar) * remaining) / videoLeft) * 100);
}

/**
 * Player da VSL: <video> sem controles nativos (play/pause pelo clique e barra de progresso
 * que não permite pular), reportando o tempo atual e se está tocando para o relógio da página.
 */
function VslVideoPlayer({
  videoRef,
  currentTime,
  duration,
  playing,
  onTogglePlay,
  onTimeUpdate,
  onDuration,
  onPlayingChange,
}: {
  videoRef: RefObject<HTMLVideoElement | null>;
  currentTime: number;
  duration: number;
  playing: boolean;
  onTogglePlay: () => void;
  onTimeUpdate: (seconds: number) => void;
  onDuration: (seconds: number) => void;
  onPlayingChange: (playing: boolean) => void;
}) {
  const progress = vslBarProgress(currentTime, duration);

  return (
    <div className="flex flex-col items-center gap-2.5">
      <div
        className="relative aspect-video w-full overflow-hidden rounded-2xl"
        style={{ background: "#000", border: "1px solid rgba(255,255,255,0.14)", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}
      >
        <video
          ref={videoRef}
          src={VSL_VIDEO_URL}
          playsInline
          preload="metadata"
          className="h-full w-full object-contain"
          onTimeUpdate={(e) => onTimeUpdate(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => onDuration(e.currentTarget.duration)}
          onPlay={() => onPlayingChange(true)}
          onPause={() => onPlayingChange(false)}
          onEnded={() => onPlayingChange(false)}
        />
        <button
          type="button"
          onClick={onTogglePlay}
          aria-label={playing ? "Pausar vídeo" : "Reproduzir vídeo"}
          className="absolute inset-0 flex items-center justify-center"
        >
          <span
            className="flex h-16 w-16 items-center justify-center rounded-full text-white"
            style={{ background: "rgba(37,211,102,0.92)", opacity: playing ? 0 : 1, transition: "opacity 200ms" }}
          >
            {playing ? <Pause className="h-7 w-7" fill="white" /> : <Play className="ml-1 h-7 w-7" fill="white" />}
          </span>
        </button>
        <button
          type="button"
          onClick={onTogglePlay}
          aria-label={playing ? "Pausar vídeo" : "Reproduzir vídeo"}
          className="absolute bottom-4 left-3 flex h-8 w-8 items-center justify-center text-white active:opacity-80"
        >
          {playing ? <Pause className="h-6 w-6" fill="white" /> : <Play className="h-6 w-6" fill="white" />}
        </button>
        <div
          role="progressbar"
          aria-label="Progresso do vídeo"
          aria-valuemin={0}
          aria-valuemax={Math.floor(duration)}
          aria-valuenow={Math.floor(currentTime)}
          className="pointer-events-none absolute inset-x-0 bottom-0 h-2"
          style={{ background: "rgba(255,255,255,0.22)" }}
        >
          <div className="h-full" style={{ width: `${progress}%`, background: GREEN }} />
        </div>
      </div>
      <p className="flex items-center gap-1.5 text-xs font-medium" style={{ color: TEXT_MUTED }}>
        <Volume2 className="h-3.5 w-3.5" /> Ative o som para não perder nada
      </p>
    </div>
  );
}

/**
 * Bloco "VSL + investigação do WhatsApp": vídeo, campo do número, card de análise cujo
 * progresso acompanha o tempo do vídeo (100% em 06:00); o resto da página também surge em 06:00.
 */
export function UpsellVslSection({
  geoLabel = null,
  onCtaVisibleChange,
}: {
  /** Avisa quando o botão "Clique para ver o que encontramos" surge/some — o funnel libera o resto da página junto. */
  onCtaVisibleChange?: (visible: boolean) => void;
  /** Localização aproximada do visitante; sem ela a linha "Acesso detectado de…" não aparece. */
  geoLabel?: string | null;
}) {
  const [digitsInput, setDigitsInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submittedNumber, setSubmittedNumber] = useState<string | null>(null);
  const [lookup, setLookup] = useState<{ photo: string; isPlaceholder: boolean } | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [playing, setPlaying] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [duration, setDuration] = useState(VSL_DURATION_SECONDS);

  function handleTogglePlay() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) void video.play().catch(() => setPlaying(false));
    else video.pause();
  }

  function handleNumberChange(e: ChangeEvent<HTMLInputElement>) {
    const input = e.target;
    const caret = input.selectionStart ?? input.value.length;
    const digitsBeforeCaret = countDigitsBefore(input.value, caret);
    const newDigits = input.value.replace(/\D/g, "").slice(0, 11);
    setDigitsInput(newDigits);
    requestAnimationFrame(() => {
      const newCaret = caretPositionAfterDigit(formatBrazilianDigits(newDigits), digitsBeforeCaret);
      input.setSelectionRange(newCaret, newCaret);
    });
  }

  async function handleStart() {
    if (digitsInput.length < 10) {
      setError("Número incompleto. Digite novamente o número corretamente.");
      return;
    }
    setError(null);
    setSubmittedNumber(digitsInput);
    void videoRef.current?.play().catch(() => setPlaying(false));

    const fullNumber = `55${digitsInput}`;
    const placeholder = { photo: photoUrl(`${fullNumber}-placeholder`, 200, 200), isPlaceholder: true };
    try {
      const response = await fetch(`/api/whatsapp/${fullNumber}`);
      if (!response.ok) {
        setLookup(placeholder);
        return;
      }
      const data = (await response.json()) as WhatsAppLookupData;
      setLookup(data.profilePicture ? { photo: data.profilePicture, isPlaceholder: false } : placeholder);
    } catch {
      setLookup(placeholder);
    }
  }

  const progressPct = Math.min(100, Math.floor((currentTime / ANALYSIS_END_SECONDS) * 100));
  const analysisDone = progressPct >= 100;
  const showCta = currentTime >= CTA_SHOW_SECONDS;
  useEffect(() => {
    onCtaVisibleChange?.(showCta);
  }, [showCta, onCtaVisibleChange]);
  const firstPending = ANALYSIS_ITEMS.findIndex((_, i) => progressPct < ((i + 1) / ANALYSIS_ITEMS.length) * 100);

  return (
    <div className="flex w-full flex-col gap-4" style={{ color: TEXT }}>
      <div
        className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-extrabold uppercase tracking-wide text-white"
        style={GREEN_CTA_STYLE}
      >
        <Play className="h-4 w-4" fill="white" /> Assista agora
      </div>

      <VslVideoPlayer
        videoRef={videoRef}
        currentTime={currentTime}
        duration={duration}
        playing={playing}
        onTogglePlay={handleTogglePlay}
        onTimeUpdate={setCurrentTime}
        onDuration={(seconds) => Number.isFinite(seconds) && seconds > 0 && setDuration(seconds)}
        onPlayingChange={setPlaying}
      />

      {showCta && (
        <div
          className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-extrabold uppercase tracking-wide text-white"
          style={GREEN_CTA_STYLE}
        >
          <ArrowDown className="h-4 w-4" /> Acesse logo abaixo
        </div>
      )}

      {submittedNumber === null ? (
        <div className="rounded-2xl p-5" style={CARD_STYLE}>
          <p className="mb-4 text-center text-lg font-extrabold leading-snug">Digite o número do WhatsApp que você quer investigar</p>
          <div
            className="mb-4 flex items-center gap-2 rounded-xl border py-3.5 pl-3.5 pr-4 focus-within:border-[#25D366]"
            style={{ background: "#0a0a0a", borderColor: "#3a3f47" }}
          >
            <svg viewBox="0 0 24 24" className="h-[20px] w-[20px] shrink-0" style={{ fill: GREEN }}>
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.86 9.86 0 0 0 12.04 2z" />
            </svg>
            <span className="shrink-0 select-none text-base font-medium" style={{ color: TEXT_MUTED }}>+55</span>
            <input
              type="text"
              inputMode="numeric"
              value={formatBrazilianDigits(digitsInput)}
              onChange={handleNumberChange}
              placeholder="11 9 9999-9999"
              aria-label="Número do WhatsApp"
              className="w-full min-w-0 bg-transparent text-base text-white outline-none placeholder:text-white/45"
            />
          </div>
          {error && <p className="mb-4 text-sm font-semibold" style={{ color: "#fca5a5" }}>{error}</p>}
          <button
            type="button"
            onClick={handleStart}
            className="flex w-full items-center justify-center rounded-xl py-3.5 text-sm font-extrabold uppercase text-white active:opacity-90"
            style={GREEN_CTA_STYLE}
          >
            Iniciar investigação
          </button>
        </div>
      ) : (
        <div className="rounded-2xl p-5" style={CARD_STYLE}>
          <div className="flex items-center gap-3.5">
            <div
              className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full"
              style={{ border: `2px solid ${GREEN}`, background: "#1c1c1e" }}
            >
              {lookup ? (
                // eslint-disable-next-line @next/next/no-img-element -- CDN do WhatsApp varia por número, sem allowlist em next.config
                <img
                  src={lookup.photo}
                  alt=""
                  className="h-full w-full object-cover"
                  style={lookup.isPlaceholder ? { filter: "blur(6px)", WebkitFilter: "blur(6px)" } : undefined}
                />
              ) : (
                <Loader2 className="h-5 w-5 animate-spin" style={{ color: GREEN }} />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-base font-extrabold">{formatDisplayNumber(submittedNumber)}</p>
              <span
                className="mt-1.5 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-bold"
                style={{ background: "rgba(37,211,102,0.18)", color: "#86efac" }}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: GREEN }} /> Sendo analisado agora
              </span>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-3xl font-black leading-none" style={{ color: GREEN }}>{progressPct}%</p>
              <p className="mt-1 text-xs font-medium" style={{ color: TEXT_MUTED }}>{analysisDone ? "Pronto!" : "Analisando"}</p>
            </div>
          </div>

          <div className="mt-5 h-2.5 w-full overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,0.16)" }}>
            <div
              className="h-full rounded-full"
              style={{ width: `${progressPct}%`, background: "linear-gradient(90deg, #25D366, #1fb959)", transition: "width 300ms linear" }}
            />
          </div>

          <div className="mt-5 text-center">
            {analysisDone ? (
              <>
                <p className="flex items-center justify-center gap-2 text-base font-extrabold" style={{ color: "#4ade80" }}>
                  <span className="flex h-5 w-5 items-center justify-center rounded-[5px]" style={{ background: GREEN }}>
                    <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
                  </span>
                  Investigação completa.
                </p>
                <p className="mt-1.5 text-sm" style={{ color: TEXT_MUTED }}>Clique no botão acima para descobrir a verdade.</p>
              </>
            ) : (
              <>
                <p className="text-xs font-extrabold uppercase tracking-[0.2em]" style={{ color: "#4ade80" }}>Por favor aguarde...</p>
                {geoLabel && (
                  <p className="mt-1.5 text-sm" style={{ color: TEXT_MUTED }}>
                    Acesso detectado de <span className="font-bold text-white">{geoLabel}</span>
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {submittedNumber !== null && (
        <div className="flex flex-col gap-3">
          {ANALYSIS_ITEMS.map(({ title, subtitle, Icon, iconBg, iconColor }, i) => {
            const done = progressPct >= ((i + 1) / ANALYSIS_ITEMS.length) * 100;
            return (
              <div
                key={title}
                className="flex items-center gap-3.5 rounded-2xl px-4 py-3.5"
                style={{
                  ...CARD_STYLE,
                  background: done ? "rgba(14,52,32,0.88)" : CARD_STYLE.background,
                  border: done ? "1px solid rgba(37,211,102,0.55)" : CARD_STYLE.border,
                }}
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl" style={{ background: iconBg }}>
                  <Icon className="h-5 w-5" style={{ color: iconColor }} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-bold">{title}</span>
                  <span className="block text-xs" style={{ color: TEXT_MUTED }}>{subtitle}</span>
                </span>
                {done ? (
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full" style={{ background: GREEN }}>
                    <Check className="h-4 w-4 text-white" strokeWidth={3} />
                  </span>
                ) : i === firstPending ? (
                  <Loader2 className="h-6 w-6 shrink-0 animate-spin" style={{ color: GREEN }} />
                ) : (
                  <span className="h-6 w-6 shrink-0 rounded-full border-2" style={{ borderColor: "rgba(255,255,255,0.25)" }} />
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="flex flex-col items-center gap-2 rounded-2xl px-4 py-6 text-center" style={CARD_STYLE}>
        <span className="flex h-12 w-12 items-center justify-center rounded-full" style={{ background: "rgba(251,191,36,0.16)" }}>
          <Lock className="h-6 w-6" style={{ color: "#fbbf24" }} fill="#fbbf24" />
        </span>
        <p className="text-base font-extrabold" style={{ color: "#4ade80" }}>Esta ferramenta é 100% anônima</p>
        <p className="text-sm" style={{ color: TEXT_MUTED }}>Não responda mensagens para se manter discreto.</p>
      </div>

      {showCta && (
        <div className="rounded-2xl px-4 py-6" style={CARD_STYLE}>
          <UpsellWhatsAppMediaPreview seed="sell-1-preview" />
        </div>
      )}
    </div>
  );
}
