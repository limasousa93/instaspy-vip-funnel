"use client";

import { useEffect, useState } from "react";

const DEFAULT_TOTAL_SECONDS = 30 * 60;

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

/** Faixa vermelha fixa no topo (sticky) das telas de oferta com timer regressivo (para em 00:00). Padrão: 30 min. */
export function UpsellCountdownBanner({
  label = "Importante: essa página sairá do ar em",
  totalSeconds = DEFAULT_TOTAL_SECONDS,
}: {
  label?: string;
  totalSeconds?: number;
}) {
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <div
      className="sticky top-0 z-50 flex w-full flex-wrap items-center justify-center gap-x-3 gap-y-1 border-b px-4 py-3 text-center text-[13px] font-bold uppercase tracking-[0.3px] sm:text-[15px]"
      style={{ background: "#3d0a0a", color: "#ffd6d6", borderColor: "#ff4141" }}
    >
      <span>{label}</span>
      <span
        className="rounded-full px-3 py-0.5 tabular-nums"
        style={{ background: "#ff4141", color: "#ffffff" }}
        aria-live="off"
      >
        {formatTime(secondsLeft)}
      </span>
    </div>
  );
}
