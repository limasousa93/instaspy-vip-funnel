import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";

const META_PIXEL_ID = process.env.META_PIXEL_ID ?? "1680283033733135";
const META_CAPI_ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN;
const META_GRAPH_VERSION = "v21.0";

type TrackRequestBody = {
  eventName: string;
  value?: number;
  currency?: string;
  fbc?: string | null;
  fbp?: string | null;
  eventSourceUrl?: string;
};

function getClientIp(request: NextRequest): string | undefined {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim();
  }
  return request.headers.get("x-real-ip") ?? undefined;
}

export async function POST(request: NextRequest) {
  if (!META_CAPI_ACCESS_TOKEN) {
    console.error("META_CAPI_ACCESS_TOKEN não configurado");
    return NextResponse.json({ ok: false, error: "server_not_configured" }, { status: 500 });
  }

  let body: TrackRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  if (!body.eventName) {
    return NextResponse.json({ ok: false, error: "missing_event_name" }, { status: 400 });
  }

  const clientIp = getClientIp(request);
  const userAgent = request.headers.get("user-agent") ?? undefined;
  const eventId = crypto.randomUUID();

  const userData: Record<string, string> = {};
  if (clientIp) userData.client_ip_address = clientIp;
  if (userAgent) userData.client_user_agent = userAgent;
  if (body.fbc) userData.fbc = body.fbc;
  if (body.fbp) userData.fbp = body.fbp;

  const customData: Record<string, unknown> = {};
  if (body.value !== undefined) customData.value = body.value;
  if (body.currency) customData.currency = body.currency;

  const payload = {
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
    const metaResponse = await fetch(
      `https://graph.facebook.com/${META_GRAPH_VERSION}/${META_PIXEL_ID}/events?access_token=${META_CAPI_ACCESS_TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    if (!metaResponse.ok) {
      const errorBody = await metaResponse.text();
      console.error("Meta CAPI error:", metaResponse.status, errorBody);
      return NextResponse.json({ ok: false, error: "meta_capi_error" }, { status: 502 });
    }

    return NextResponse.json({ ok: true, eventId });
  } catch (error) {
    console.error("Falha ao encaminhar evento para Meta CAPI:", error);
    return NextResponse.json({ ok: false, error: "network_error" }, { status: 502 });
  }
}
