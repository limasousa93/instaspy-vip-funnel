"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Monitor } from "lucide-react";
import { LetterGlitch } from "@/components/ui/letter-glitch";

// tiny util
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

/* ────────────── DecryptingPassword ──────────────
 * Efeito de "senha sendo descriptografada": digita caracteres aleatórios
 * rapidamente até um tamanho fixo, apaga tudo de novo e repete em loop,
 * em verde/monoespaçado — sem depender de nenhuma lib externa. */
const DECRYPT_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*";
const DECRYPT_LENGTH = 14;

const randomDecryptChar = () => DECRYPT_CHARS[Math.floor(Math.random() * DECRYPT_CHARS.length)];
const randomDecryptString = (length: number) =>
  Array.from({ length }, randomDecryptChar).join("");

const DecryptingPassword: React.FC<{ className?: string }> = ({ className }) => {
  const [display, setDisplay] = React.useState("");

  React.useEffect(() => {
    let cancelled = false;
    let timeoutId: number;

    function typeStep(count: number) {
      if (cancelled) return;
      if (count <= DECRYPT_LENGTH) {
        setDisplay(randomDecryptString(count));
        timeoutId = window.setTimeout(() => typeStep(count + 1), 45);
      } else {
        timeoutId = window.setTimeout(() => eraseStep(DECRYPT_LENGTH), 300);
      }
    }

    function eraseStep(count: number) {
      if (cancelled) return;
      if (count > 0) {
        setDisplay(randomDecryptString(count));
        timeoutId = window.setTimeout(() => eraseStep(count - 1), 30);
      } else {
        setDisplay("");
        timeoutId = window.setTimeout(() => typeStep(1), 200);
      }
    }

    typeStep(1);
    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div
      className={cn(
        "font-mono text-lg tracking-[0.2em] text-[#22ff88] drop-shadow-[0_0_8px_rgba(34,255,136,0.5)]",
        className,
      )}
    >
      {display}
      <span className="animate-pulse">_</span>
    </div>
  );
};

/* ────────────── AsciiProgressBar ────────────── */
const AsciiProgressBar: React.FC<{ progress: number; className?: string }> = ({
  progress,
  className,
}) => {
  const [animatedProgress, setAnimatedProgress] = React.useState(0);
  React.useEffect(() => {
    const t = setTimeout(() => setAnimatedProgress(progress), 100);
    return () => clearTimeout(t);
  }, [progress]);
  const totalBars = 20;
  const filledBars = Math.floor((animatedProgress / 100) * totalBars);
  const characters = Array.from({ length: totalBars }, (_, index) => ({
    char: index < filledBars ? "▓" : "░",
    isFilled: index < filledBars,
    index,
  }));
  return (
    <div className={cn("font-mono text-lg", className)}>
      <div className="flex items-center text-white/80">
        <span className="text-white/60 mr-1">[</span>
        <div className="flex">
          {characters.map((item, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0.3 }}
              animate={{ opacity: 1, scale: item.isFilled ? [1, 1.2, 1] : 1 }}
              transition={{
                delay: item.isFilled ? index * 0.03 : 0,
                duration: item.isFilled ? 0.3 : 0.1,
                scale: { repeat: item.isFilled ? 1 : 0, duration: 0.4 },
              }}
              className={item.isFilled ? "text-[#22ff88]" : "text-white/30"}
            >
              {item.char}
            </motion.span>
          ))}
        </div>
        <span className="text-white/60 ml-1">]</span>
        <span className="text-white/60 ml-2 text-sm">{Math.round(animatedProgress)}%</span>
      </div>
    </div>
  );
};

/* ────────────── ProcessingCard ────────────── */
interface ProcessingStage {
  key: string;
  label: string;
  minProgress: number;
}

interface ProcessingCardProps {
  name?: string;
  className?: string;
  status?: "queued" | "running" | "succeeded" | "failed";
  progress?: number;
  stages?: ProcessingStage[];
  /** Mantém o texto do último estágio ao concluir, em vez da mensagem padrão de sucesso. */
  stickyLastStage?: boolean;
  succeededLabel?: string;
  failedLabel?: string;
}

const defaultProcessingStages: ProcessingStage[] = [
  { key: "processing", label: "Processando...", minProgress: 0 },
  { key: "locating", label: "Localizando Perfil...", minProgress: 34 },
  { key: "collecting", label: "Coletando Dados...", minProgress: 67 },
];

const getCurrentStage = (stages: ProcessingStage[], progress: number) => {
  for (let i = stages.length - 1; i >= 0; i--) {
    if (progress >= stages[i].minProgress) return stages[i];
  }
  return stages[0];
};

const ProcessingCard: React.FC<ProcessingCardProps> = ({
  name = "Lead qualification",
  className,
  status = "queued",
  progress = 0,
  stages = defaultProcessingStages,
  stickyLastStage = false,
  succeededLabel = "Concluído. Dados coletados com sucesso.",
  failedLabel = "Falha na operação. Tente novamente.",
}) => {
  const [displayProgress, setDisplayProgress] = React.useState(0);
  const [currentStage, setCurrentStage] = React.useState(stages[0]);

  React.useEffect(() => {
    const t = setTimeout(() => setDisplayProgress(progress), 100);
    return () => clearTimeout(t);
  }, [progress]);

  React.useEffect(() => {
    setCurrentStage(getCurrentStage(stages, displayProgress));
  }, [stages, displayProgress]);

  React.useEffect(() => {
    if (status === "running" && displayProgress < 95) {
      const i = setInterval(() => {
        setDisplayProgress((prev) =>
          Math.min(prev + Math.random() * 2 + 0.5, Math.min(progress + 10, 95)),
        );
      }, 500);
      return () => clearInterval(i);
    }
  }, [status, progress, displayProgress]);

  const finalProgress = status === "succeeded" ? 100 : displayProgress;
  const getStatusText = () =>
    status === "queued"
      ? stages[0].label
      : status === "running"
        ? currentStage.label
        : status === "succeeded"
          ? stickyLastStage
            ? stages[stages.length - 1].label
            : succeededLabel
          : status === "failed"
            ? failedLabel
            : stages[0].label;

  return (
    <div
      className={cn(
        "w-full rounded-2xl border overflow-hidden shadow-lg",
        // ALWAYS dark palette:
        "bg-[#0b0b0f] text-white border-white/10",
        className,
      )}
    >
      {/* Header (dark) */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="text-sm font-medium text-white truncate">{name}</div>
        {(status === "running" || status === "queued" || status === "succeeded") && (
          <div className="text-xs text-white/60">{Math.round(finalProgress)}%</div>
        )}
      </div>

      {/* Inner content — ALWAYS dark */}
      <div className="relative h-[400px] w-full bg-black text-white overflow-hidden">
        {/* ASCII glitch backdrop */}
        <div className="absolute inset-0 opacity-25 z-10">
          <LetterGlitch glitchSpeed={50} centerVignette={false} outerVignette={false} smooth characters=". " />
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-black/90 via-black/70 to-transparent blur-lg"></div>
            <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-black/90 via-black/70 to-transparent blur-lg"></div>
            <div className="absolute top-0 left-0 w-16 h-full bg-gradient-to-r from-black/90 via-black/70 to-transparent blur-lg"></div>
            <div className="absolute top-0 right-0 w-16 h-full bg-gradient-to-l from-black/90 via-black/70 to-transparent blur-lg"></div>
          </div>
        </div>

        {/* Subtle green radial glow on black */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(34,255,136,0.15), transparent 70%), #000",
          }}
        />

        {/* Foreground content */}
        <div className="relative z-20 flex flex-col items-center justify-center h-full">
          <div className="mb-4">
            {status === "running" || status === "queued" ? (
              <DecryptingPassword />
            ) : (
              <Monitor className="w-8 h-8 text-white/60 drop-shadow-[0_0_8px_rgba(34,255,136,0.3)]" />
            )}
          </div>

          <AnimatePresence mode="wait">
            <motion.p
              key={currentStage.key + status}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-sm font-bold text-center text-white mb-4 drop-shadow-[0_0_6px_rgba(229,231,235,0.2)]"
            >
              {getStatusText()}
            </motion.p>
          </AnimatePresence>

          {(status === "running" || status === "queued" || status === "succeeded") && (
            <AsciiProgressBar progress={finalProgress} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProcessingCard;
