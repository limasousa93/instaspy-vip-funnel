import { cookies } from "next/headers";

export const GEO_COOKIE_NAME = "ig_geo";
const GEO_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 dias, igual ao ig_session

/** Localização aproximada (só texto grosso): nunca guardamos IP, latitude/longitude nem endereço. */
export interface Geo {
  city?: string;
  region?: string;
  country?: string;
}

function decodeHeader(value: string | null): string | undefined {
  if (!value) return undefined;
  try {
    return decodeURIComponent(value).trim() || undefined;
  } catch {
    // Valor com % inválido: melhor sem cidade do que derrubar o login.
    return undefined;
  }
}

/** Lê os headers que a própria Vercel injeta (inexistentes em localhost → null). O IP nunca é lido. */
export function readGeoFromHeaders(headers: Headers): Geo | null {
  const geo: Geo = {
    city: decodeHeader(headers.get("x-vercel-ip-city")),
    region: decodeHeader(headers.get("x-vercel-ip-country-region")),
    country: decodeHeader(headers.get("x-vercel-ip-country")),
  };
  return geo.city || geo.region || geo.country ? geo : null;
}

export async function setGeoCookie(geo: Geo): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(GEO_COOKIE_NAME, JSON.stringify(geo), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: GEO_MAX_AGE_SECONDS,
  });
}

/** Lê o ig_geo; qualquer valor ausente ou malformado vira null (o funil nunca quebra por isso). */
export async function getGeoFromCookie(): Promise<Geo | null> {
  const raw = (await cookies()).get(GEO_COOKIE_NAME)?.value;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const pick = (key: string) => (typeof parsed[key] === "string" ? (parsed[key] as string).slice(0, 80) : undefined);
    const geo: Geo = { city: pick("city"), region: pick("region"), country: pick("country") };
    return geo.city || geo.region || geo.country ? geo : null;
  } catch {
    return null;
  }
}

/** "Fortaleza, CE"; sem cidade/UF cai no nome do país ("Brasil"); sem nada devolve null. */
export function formatGeo(geo: Geo | null | undefined): string | null {
  if (!geo) return null;
  const parts = [geo.city, geo.region].filter(Boolean);
  if (parts.length > 0) return parts.join(", ");
  if (!geo.country) return null;
  try {
    return new Intl.DisplayNames(["pt-BR"], { type: "region" }).of(geo.country) ?? geo.country;
  } catch {
    return geo.country;
  }
}
