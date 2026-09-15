"use client";

import { getFbc, getFbp } from "./fbc";

type TrackParams = {
  currency?: string;
  value?: number;
};

/**
 * Dispara um evento em dois canais: o Pixel client-side (via `fbq`) e a
 * Conversions API server-side (via /api/track), que enriquece o evento com
 * IP e User-Agent reais — o navegador nunca tem acesso a esses dados.
 */
export function trackEvent(eventName: string, params?: TrackParams) {
  if (typeof window === "undefined") return;

  const fbq = (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq;
  if (fbq) {
    fbq("track", eventName, params ?? {});
  }

  const fbc = getFbc();
  const fbp = getFbp();

  fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      eventName,
      value: params?.value,
      currency: params?.currency,
      fbc,
      fbp,
      eventSourceUrl: window.location.href,
    }),
    keepalive: true,
  }).catch(() => {
    // Falha no envio server-side não deve impactar a navegação do usuário
  });
}
