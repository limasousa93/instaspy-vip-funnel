"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE_NAME, verifySession } from "@/lib/session/session";
import { setSessionCookie } from "@/lib/session/session-cookie";

const MAX_ATTEMPTS = 3;
const RETRY_DELAY_MS = 1500;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type PurchaseFlags = { upsell: boolean; downsell: boolean; crossell: boolean };

async function fetchFlags(url: string, contact: string): Promise<PurchaseFlags | null> {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contact }),
      cache: "no-store",
    });
    const data = await response.json();
    if (!data.ok) return null;
    return {
      upsell: data.upsell ?? data.hasUpsell ?? false,
      downsell: data.downsell ?? data.hasDownsell ?? false,
      crossell: data.crossell ?? data.hasCrossell ?? false,
    };
  } catch {
    return null;
  }
}

/**
 * Chamada só no clique de "Continuar" em /continuar. Reconsulta o n8n (que pode demorar a
 * receber o webhook da Cakto), faz OR das flags novas com as da sessão atual e volta pro /feed.
 */
export async function refreshSession() {
  const cookieStore = await cookies();
  const session = await verifySession(cookieStore.get(SESSION_COOKIE_NAME)?.value);
  if (!session) redirect("/entrar");

  const n8nUrl = process.env.N8N_VERIFY_ACCESS_URL;
  if (!n8nUrl) throw new Error("N8N_VERIFY_ACCESS_URL não configurado em .env.local");

  let merged: PurchaseFlags = { upsell: session.upsell, downsell: session.downsell, crossell: session.crossell };

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const fresh = await fetchFlags(n8nUrl, session.contact);
    if (fresh) {
      merged = {
        upsell: merged.upsell || fresh.upsell,
        downsell: merged.downsell || fresh.downsell,
        crossell: merged.crossell || fresh.crossell,
      };
      const changed =
        merged.upsell !== session.upsell || merged.downsell !== session.downsell || merged.crossell !== session.crossell;
      if (changed) break;
    }
    if (attempt < MAX_ATTEMPTS) await sleep(RETRY_DELAY_MS);
  }

  await setSessionCookie({ contact: session.contact, vip: session.vip, ...merged });
  redirect("/feed");
}
