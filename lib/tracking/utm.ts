"use client";

import { captureFbclid, getFbc, getFbp } from "./fbc";

const UTM_STORAGE_KEY = "utms";

export const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
  "ad_id",
  "adset_id",
  "campaign_id",
] as const;

export type UtmKey = (typeof UTM_KEYS)[number];
export type Utms = Partial<Record<UtmKey, string>>;

function readStored(): Utms {
  try {
    const raw = window.localStorage.getItem(UTM_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Utms) : {};
  } catch {
    return {};
  }
}

/** Lê UTMs/ids da URL e grava em modo "primeiro toque" (não sobrescreve valores já salvos). */
export function captureUtms(): void {
  if (typeof window === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  const stored = readStored();
  let changed = false;

  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value && !stored[key]) {
      stored[key] = value;
      changed = true;
    }
  }
  if (!changed) return;

  try {
    window.localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(stored));
  } catch {
    // localStorage indisponível — ignora
  }
}

/** Captura fbclid (fbc) + UTMs de uma vez. */
export function capture(): void {
  captureFbclid();
  captureUtms();
}

export function getUtms(): Utms {
  if (typeof window === "undefined") return {};
  return readStored();
}

export function getAllTrackingParams(): Record<string, string> {
  const out: Record<string, string> = {};
  const fbc = getFbc();
  const fbp = getFbp();
  if (fbc) out.fbc = fbc;
  if (fbp) out.fbp = fbp;
  for (const [k, v] of Object.entries(getUtms())) {
    if (v) out[k] = v;
  }
  return out;
}
