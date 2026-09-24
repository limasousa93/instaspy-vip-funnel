import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";

const META_PIXEL_ID = process.env.META_PIXEL_ID ?? "1680283033733135";
const META_CAPI_ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN;
const META_GRAPH_VERSION = "v21.0";

/** Únicos eventos que este endpoint tem permissão de encaminhar. */
const ALLOWED_EVENT_NAMES = new Set(["InitiateCheckout"]);

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 20;
const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();

const EVENT_ID_PATTERN = /^[A-Za-z0-9_-]{8,64}$/;
const MAX_CONTENT_IDS = 10;

type TrackRequestBody = {
  eventName: string;
  eventId?: unknown;
  contentType?: unknown;
  contentIds?: unknown;
  contentName?: unknown;
  value?: number;
  currency?: string;
  fbc?: string | null;
  fbp?: string | null;
  eventSourceUrl?: string;
};

/**
 * Extrai o IP do visitante. `x-forwarded-for`/`x-real-ip` podem ser
 * definidos livremente por quem faz a requisição (não são headers
 * bloqueados pelo fetch do navegador), então nunca confiamos no primeiro
 * valor da lista — ele é o mais fácil de forjar. Priorizamos headers que só
 * a borda da própria plataforma de hosting escreve (Vercel/Cloudflare) e,
 * como último recurso, pegamos o valor mais à direita em `x-forwarded-for`
 * (o hop mais próximo do nosso servidor, adicionado pelo proxy confiável).
 */
function getClientIp(request: NextRequest): string | undefined {
  const vercelIp = request.headers.get("x-vercel-forwarded-for");
  if (vercelIp) return vercelIp.split(",")[0]?.trim();

  const cloudflareIp = request.headers.get("cf-connecting-ip");
  if (cloudflareIp) return cloudflareIp.trim();

  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const hops = forwardedFor.split(",").map((ip) => ip.trim());
    return hops[hops.length - 1];
  }

  return request.headers.get("x-real-ip")?.trim() ?? undefined;
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const bucket = rateLimitBuckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    rateLimitBuckets.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  bucket.count += 1;
  return bucket.count > RATE_LIMIT_MAX_REQUESTS;
}

/** Requisição precisa vir do próprio site — bloqueia uso do endpoint como relay por terceiros. */
function isSameOrigin(request: NextRequest): boolean {
  const selfOrigin = request.nextUrl.origin;
  const origin = request.headers.get("origin");
  if (origin) return origin === selfOrigin;

  const referer = request.headers.get("referer");
  if (referer) return referer.startsWith(selfOrigin);

  return false;
}

export async function POST(request: NextRequest) {
  if (!META_CAPI_ACCESS_TOKEN) {
    console.error("META_CAPI_ACCESS_TOKEN não configurado");
    return NextResponse.json({ ok: false, error: "server_not_configured" }, { status: 500 });
  }

  if (!isSameOrigin(request)) {
    return NextResponse.json({ ok: false, error: "forbidden_origin" }, { status: 403 });
  }

  const clientIp = getClientIp(request);
  if (isRateLimited(clientIp ?? "unknown")) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  let body: TrackRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  if (!body.eventName || !ALLOWED_EVENT_NAMES.has(body.eventName)) {
    return NextResponse.json({ ok: false, error: "event_not_allowed" }, { status: 400 });
  }

  const userAgent = request.headers.get("user-agent") ?? undefined;
  // Mesmo id enviado pelo Pixel no browser: é o que permite ao Meta deduplicar. Inválido/ausente → UUID novo.
  const eventId =
    typeof body.eventId === "string" && EVENT_ID_PATTERN.test(body.eventId) ? body.eventId : crypto.randomUUID();

  const userData: Record<string, string> = {};
  if (clientIp) userData.client_ip_address = clientIp;
  if (userAgent) userData.client_user_agent = userAgent;
  if (body.fbc) userData.fbc = body.fbc;
  if (body.fbp) userData.fbp = body.fbp;

  const customData: Record<string, unknown> = {};
  if (typeof body.value === "number" && Number.isFinite(body.value)) customData.value = body.value;
  if (body.currency) customData.currency = body.currency;
  if (typeof body.contentType === "string" && body.contentType.length > 0 && body.contentType.length <= 50) {
    customData.content_type = body.contentType;
  }
  if (typeof body.contentName === "string" && body.contentName.length > 0 && body.contentName.length <= 100) {
    customData.content_name = body.contentName;
  }
  if (
    Array.isArray(body.contentIds) &&
    body.contentIds.length > 0 &&
    body.contentIds.length <= MAX_CONTENT_IDS &&
    body.contentIds.every((id) => typeof id === "string" && id.length > 0 && id.length <= 64)
  ) {
    customData.content_ids = body.contentIds;
  }

  const payload = {
    access_token: META_CAPI_ACCESS_TOKEN,
    data: [
      {
        event_name: body.eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        event_source_url: body.eventSourceUrl,
        action_source: "website",
        user_data: userData,
        custom_data: customData,
      },
    ],
  };

  try {
    // access_token vai no corpo (não na query string) para nunca aparecer em
    // logs de URL, stack traces de erro de rede ou em ferramentas de APM.
    const metaResponse = await fetch(`https://graph.facebook.com/${META_GRAPH_VERSION}/${META_PIXEL_ID}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!metaResponse.ok) {
      const errorBody = await metaResponse.text();
      console.error("Meta CAPI error:", metaResponse.status, errorBody);
      return NextResponse.json({ ok: false, error: "meta_capi_error" }, { status: 502 });
    }

    return NextResponse.json({ ok: true, eventId });
  } catch (error) {
    console.error("Falha ao encaminhar evento para Meta CAPI:", error instanceof Error ? error.message : "erro desconhecido");
    return NextResponse.json({ ok: false, error: "network_error" }, { status: 502 });
  }
}
