"use client";

import { getAllTrackingParams } from "./utm";

/** Anexa fbc/fbp/fbclid/UTMs/ids à URL de checkout (só valores não-vazios, sem duplicar params existentes). */
export function buildCheckoutUrl(baseUrl: string): string {
  if (!baseUrl || baseUrl === "#") return baseUrl;

  const hashIndex = baseUrl.indexOf("#");
  const hash = hashIndex >= 0 ? baseUrl.slice(hashIndex) : "";
  const withoutHash = hashIndex >= 0 ? baseUrl.slice(0, hashIndex) : baseUrl;
  const qIndex = withoutHash.indexOf("?");
  const path = qIndex >= 0 ? withoutHash.slice(0, qIndex) : withoutHash;
  const existing = qIndex >= 0 ? withoutHash.slice(qIndex + 1) : "";

  const present = new Set(
    existing
      .split("&")
      .filter(Boolean)
      .map((p) => decodeURIComponent(p.split("=")[0])),
  );

  const extra = Object.entries(getAllTrackingParams())
    .filter(([k, v]) => v && !present.has(k))
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`);

  const query = [existing, ...extra].filter(Boolean).join("&");
  return `${path}${query ? `?${query}` : ""}${hash}`;
}
