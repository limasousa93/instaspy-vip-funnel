import { cookies } from "next/headers";
import { signSession, SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS, type SessionPayload } from "@/lib/session/session";

/** Assina a sessão e grava o cookie ig_session (usado no login e no refresh pós-compra). */
export async function setSessionCookie(payload: Omit<SessionPayload, "iat">): Promise<void> {
  const token = await signSession(payload);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    // Só em produção (https): navegadores recusam cookie Secure em http://<IP-da-rede>, o que quebra o teste no celular.
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}
