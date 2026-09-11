export const SESSION_COOKIE_NAME = "ig_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 dias

export interface SessionPayload {
  contact: string;
  vip: boolean;
  upsell: boolean;
  iat: number;
}

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET não configurado em .env.local");
  return secret;
}

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(padded);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function hmacKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

export async function signSession(payload: Omit<SessionPayload, "iat">): Promise<string> {
  const full: SessionPayload = { ...payload, iat: Date.now() };
  const payloadBytes = new TextEncoder().encode(JSON.stringify(full));
  const encodedPayload = base64UrlEncode(payloadBytes);
  const key = await hmacKey();
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(encodedPayload));
  const encodedSignature = base64UrlEncode(new Uint8Array(signature));
  return `${encodedPayload}.${encodedSignature}`;
}

export async function verifySession(token: string | undefined | null): Promise<SessionPayload | null> {
  if (!token) return null;
  const [encodedPayload, encodedSignature] = token.split(".");
  if (!encodedPayload || !encodedSignature) return null;

  try {
    const key = await hmacKey();
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      base64UrlDecode(encodedSignature) as BufferSource,
      new TextEncoder().encode(encodedPayload),
    );
    if (!valid) return null;

    const payload = JSON.parse(new TextDecoder().decode(base64UrlDecode(encodedPayload))) as SessionPayload;
    const ageSeconds = (Date.now() - payload.iat) / 1000;
    if (ageSeconds > SESSION_MAX_AGE_SECONDS) return null;
    return payload;
  } catch {
    return null;
  }
}
