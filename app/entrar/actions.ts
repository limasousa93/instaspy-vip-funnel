"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { signSession, SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from "@/lib/session/session";

export async function verifyAccessAction(_prevState: unknown, formData: FormData) {
  const contact = String(formData.get("contact") ?? "").trim();
  if (!contact) {
    return { error: "Digite o e-mail ou celular usado na compra." };
  }

  const n8nUrl = process.env.N8N_VERIFY_ACCESS_URL;
  if (!n8nUrl) throw new Error("N8N_VERIFY_ACCESS_URL não configurado em .env.local");

  let hasVip = false;
  let hasUpsell = false;

  try {
    const response = await fetch(n8nUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contact }),
    });
    const data = await response.json();
    if (!data.ok) {
      return { error: "Não encontramos nenhuma compra aprovada para esse contato. Confira o e-mail/celular e tente de novo." };
    }
    hasVip = data.hasVip ?? false;
    hasUpsell = data.hasUpsell ?? false;
  } catch {
    return { error: "Erro ao verificar a compra. Tente novamente em instantes." };
  }

  if (!hasVip) {
    return { error: "Não encontramos nenhuma compra aprovada para esse contato. Confira o e-mail/celular e tente de novo." };
  }

  const token = await signSession({ contact, vip: true, upsell: hasUpsell });
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });

  redirect(hasUpsell ? "/feed" : "/upsell");
}
