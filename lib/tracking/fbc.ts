"use client";

const FBC_STORAGE_KEY = "fbc";
const FBP_COOKIE_NAME = "_fbp";

type StoredFbc = {
  fbclid: string;
  timestamp: number;
  fbc: string;
};

function buildFbc(fbclid: string, timestamp: number) {
  return `fb.1.${timestamp}.${fbclid}`;
}

/** Lê `?fbclid=` da URL atual (se presente) e persiste no localStorage. */
export function captureFbclid(): void {
  if (typeof window === "undefined") return;

  const fbclid = new URLSearchParams(window.location.search).get("fbclid");
  if (!fbclid) return;

  const timestamp = Date.now();
  const stored: StoredFbc = { fbclid, timestamp, fbc: buildFbc(fbclid, timestamp) };

  try {
    window.localStorage.setItem(FBC_STORAGE_KEY, JSON.stringify(stored));
  } catch {
    // localStorage indisponível (modo privado, storage cheio, etc.) — ignora
  }
}

/** Recupera o fbc salvo anteriormente (ou capturado agora, se a URL tiver fbclid). */
export function getFbc(): string | null {
  if (typeof window === "undefined") return null;

  const fbclid = new URLSearchParams(window.location.search).get("fbclid");
  if (fbclid) {
    captureFbclid();
  }

  try {
    const raw = window.localStorage.getItem(FBC_STORAGE_KEY);
    if (!raw) return null;
    const stored = JSON.parse(raw) as StoredFbc;
    return stored.fbc ?? null;
  } catch {
    return null;
  }
}

/** Lê o cookie `_fbp` gerado pelo próprio Pixel do Facebook. */
export function getFbp(): string | null {
  if (typeof document === "undefined") return null;

  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${FBP_COOKIE_NAME}=`));

  if (!match) return null;
  return match.slice(FBP_COOKIE_NAME.length + 1) || null;
}
