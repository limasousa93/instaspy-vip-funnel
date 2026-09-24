"use server";

import { redirect } from "next/navigation";
import { hasAnyUpgrade } from "@/lib/session/session";
import { setSessionCookie } from "@/lib/session/session-cookie";

export async function verifyAccessAction(_prevState: unknown, formData: FormData) {
  const contact = String(formData.get("contact") ?? "").trim();
  if (!contact) {
    return { error: "Digite o e-mail usado na compra." };
  }

  const n8nUrl = process.env.N8N_VERIFY_ACCESS_URL;
  if (!n8nUrl) throw new Error("N8N_VERIFY_ACCESS_URL não configurado em .env.local");

  let hasVip = false;
  let hasUpsell = false;
  let hasDownsell = false;
  let hasCrossell = false;

  try {
    const response = await fetch(n8nUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contact }),
    });
    const data = await response.json();
    if (!data.ok) {
      return { error: "Não encontramos nenhuma compra aprovada para esse contato. Confira o e-mail e tente de novo." };
    }
    hasVip = data.hasVip ?? false;
    hasUpsell = data.hasUpsell ?? false;
    hasDownsell = data.hasDownsell ?? false;
    hasCrossell = data.hasCrossell ?? false;
  } catch {
    return { error: "Erro ao verificar a compra. Tente novamente em instantes." };
  }

  if (!hasVip) {
    return { error: "Não encontramos nenhuma compra aprovada para esse contato. Confira o e-mail e tente de novo." };
  }

  const flags = { upsell: hasUpsell, downsell: hasDownsell, crossell: hasCrossell };
  await setSessionCookie({ contact, vip: true, ...flags });

  // Quem já comprou qualquer upgrade vai direto pro app; o resto começa a sequência de ofertas em /sell-1.
  redirect(hasAnyUpgrade(flags) ? "/feed" : "/sell-1");
}
