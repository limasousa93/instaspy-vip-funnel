"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { signSession, SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from "@/lib/session/session";

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
  } catch {
    return { error: "Erro ao verificar a compra. Tente novamente em instantes." };
  }

  if (!hasVip) {
    return { error: "Não encontramos nenhuma compra aprovada para esse contato. Confira o e-mail e tente de novo." };
  }

  const token = await signSession({ contact, vip: true, upsell: hasUpsell, downsell: hasDownsell });
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    // Só em produção (https): navegadores recusam cookie Secure em http://<IP-da-rede>, o que quebra o teste no celular.
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });

  // Quem já comprou upsell ou downsell vai direto pro app; o resto cai no /sell3 (antigo crossell).
  redirect(hasUpsell || hasDownsell ? "/feed" : "/sell3");
}
