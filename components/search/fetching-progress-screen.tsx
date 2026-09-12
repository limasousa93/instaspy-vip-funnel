"use client";

import { useEffect, useState } from "react";

const STATUS_MESSAGES = [
  "Conexão Estabelecida",
  "Buscando Perfil",
  "Organizando informações",
  "Carregando Posts",
];

const STATUS_INTERVAL_MS = 1400;

export function FetchingProgressScreen({ username }: { username: string }) {
  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    const tick = window.setInterval(() => {
      setStatusIndex((i) => Math.min(i + 1, STATUS_MESSAGES.length - 1));
    }, STATUS_INTERVAL_MS);
    return () => window.clearInterval(tick);
  }, [username]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-sm font-semibold text-foreground">Buscando @{username}</p>
      <div className="h-1 w-full max-w-xs overflow-hidden rounded-full bg-secondary">
        <div className="fetching-progress-bar h-full rounded-full bg-primary" />
      </div>
      <p className="text-xs text-muted-foreground">{STATUS_MESSAGES[statusIndex]}</p>
    </div>
  );
}
