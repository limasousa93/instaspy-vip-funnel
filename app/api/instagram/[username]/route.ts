import { NextResponse } from "next/server";
import { get as getCached, set as setCached } from "@/lib/instagram/cache";
import { fetchInstagramData } from "@/lib/instagram/apify-client";
import { normalizeInstagramData, type NormalizedInstagramData } from "@/lib/instagram/normalize";

export const dynamic = "force-dynamic";

function sanitizeUsername(raw: string): string {
  return raw.trim().replace(/^@/, "").toLowerCase();
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username: rawUsername } = await params;
  const username = sanitizeUsername(rawUsername);

  const cached = getCached<NormalizedInstagramData>(username);
  if (cached) return NextResponse.json(cached);

  const raw = await fetchInstagramData(username);
  if (!raw) {
    return NextResponse.json({ error: "Perfil não encontrado" }, { status: 404 });
  }

  const normalized = normalizeInstagramData(raw);
  setCached(username, normalized);
  return NextResponse.json(normalized);
}
