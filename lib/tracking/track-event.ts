"use client";

import { getFbc, getFbp } from "./fbc";

type TrackParams = {
  currency?: string;
  value?: number;
  content_type?: string;
  content_ids?: string[];
  content_name?: string;
};

/** UUID por chamada; `crypto.randomUUID` só existe em contexto seguro (https/localhost), então há fallback pra testes via http://<IP>. */
function generateEventId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}-${Math.random().toString(36).slice(2, 12)}`;
}

/**
 * Dispara um evento em dois canais: o Pixel client-side (via `fbq`) e a
 * Conversions API server-side (via /api/track), que enriquece o evento com
 * IP e User-Agent reais — o navegador nunca tem acesso a esses dados.
 * Os dois canais compartilham o mesmo `eventId` para o Meta deduplicar.
 */
export function trackEvent(eventName: string, params?: TrackParams) {
  if (typeof window === "undefined") return;

  const eventId = generateEventId();

  const fbq = (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq;
  if (fbq) {
    fbq("track", eventName, params ?? {}, { eventID: eventId });
  }

  const fbc = getFbc();
  const fbp = getFbp();

  fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      eventName,
      eventId,
      value: params?.value,
      currency: params?.currency,
      contentType: params?.content_type,
      contentIds: params?.content_ids,
      contentName: params?.content_name,
      fbc,
      fbp,
      eventSourceUrl: window.location.href,
    }),
    keepalive: true,
  }).catch(() => {
    // Falha no envio server-side não deve impactar a navegação do usuário
  });
}
