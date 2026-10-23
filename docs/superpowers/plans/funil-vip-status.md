# Status atual do funil VIP

_Gerado em 2026-09-10 — reflete o estado real dos arquivos no repositório neste momento, não um plano futuro._

## 1. `app/entrar/actions.ts`

```ts
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { orderStore } from "@/lib/orders/order-store";
import { signSession, SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from "@/lib/session/session";

export async function verifyAccessAction(_prevState: unknown, formData: FormData) {
  const contact = String(formData.get("contact") ?? "").trim();
  if (!contact) {
    return { error: "Digite o e-mail ou celular usado na compra." };
  }

  const orders = await orderStore.findApprovedOrders(contact);
  const hasVip = orders.some((order) => order.product === "vip");
  if (!hasVip) {
    return { error: "Não encontramos nenhuma compra aprovada para esse contato. Confira o e-mail/celular e tente de novo." };
  }
  const hasUpsell = orders.some((order) => order.product === "upsell");

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
```

**Status: ⚠️ desatualizado.** Ainda importa `orderStore` de `lib/orders/order-store.ts` (Google Sheets) — a Task 2/3 originais (Sheets + webhook Cakto→Sheets) **não foram removidas nem substituídas** pelo fluxo n8n. Continua 100% funcional como estava (Sheets), mas não reflete a decisão de mover a validação para n8n.

**O que falta:** trocar a chamada `orderStore.findApprovedOrders(contact)` por um `fetch` para o endpoint do n8n que faz a validação da compra. Para isso eu preciso saber, do seu lado:
- URL do webhook n8n que recebe `{ contact }` e responde com o resultado da validação.
- Formato exato da resposta (ex.: `{ approved: boolean, products: string[] }`? `{ vip: boolean, upsell: boolean }`?).
- Se há um secret/header de autenticação para chamar o n8n (equivalente ao `CAKTO_WEBHOOK_SECRET` de antes, mas na direção app → n8n).

Sem essas três respostas eu não tenho como escrever o `fetch` corretamente — é a única coisa bloqueando essa task.

---

## 2. `components/feed/vip-unlock-banner.tsx`

```tsx
import { Crown } from "lucide-react";

export function VipUnlockCard() {
  const checkoutUrl = process.env.NEXT_PUBLIC_CAKTO_CHECKOUT_URL_VIP ?? "#";

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex items-center gap-3 rounded-2xl bg-black/80 p-3 backdrop-blur-sm">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/5">
          <Crown className="h-6 w-6 fill-amber-400 text-amber-400" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-base font-bold text-white">
            Seja <span className="text-amber-400">VIP</span>
          </p>
          <p className="text-xs leading-snug text-white/80">
            e desbloqueie todas as informações deste perfil.
          </p>
        </div>
        <div className="shrink-0 border-l border-white/20 pl-3 text-right">
          <p className="whitespace-nowrap text-sm font-bold text-white">
            R$ 27,90
          </p>
        </div>
      </div>
      <a
        href={checkoutUrl}
        className="block w-full rounded-lg bg-green-500 py-2.5 text-center text-sm font-bold text-white shadow-lg active:opacity-80"
      >
        DESBLOQUEAR
      </a>
    </div>
  );
}

export function VipUnlockBanner() {
  return (
    <div className="absolute inset-x-[5%] top-1/2 -translate-y-1/2">
      <VipUnlockCard />
    </div>
  );
}
```

**Status: ✅ código correto.** O botão já é um `<a href={checkoutUrl}>` lendo `NEXT_PUBLIC_CAKTO_CHECKOUT_URL_VIP`.

**⚠️ Mas não aponta para `https://pay.cakto.com.br/3c9getz_921646` ainda** — porque essa variável está **vazia** no `.env.local` (ver seção 6). Enquanto estiver vazia, o link cai em `href="#"` (não navega a lugar nenhum). Não é um problema de código, é só falta preencher o valor.

---

## 3. `app/upsell/page.tsx`

```tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Check, Crown, X } from "lucide-react";
import { OnboardingBackdrop, OnboardingBadges, OnboardingCard, OnboardingLogo } from "@/components/onboarding/onboarding-card";
import { SESSION_COOKIE_NAME, verifySession } from "@/lib/session/session";

export default async function UpsellPage() {
  const cookieStore = await cookies();
  const session = await verifySession(cookieStore.get(SESSION_COOKIE_NAME)?.value);

  if (!session?.vip) redirect("/entrar");
  if (session.upsell) redirect("/feed");

  const upsellCheckoutUrl = process.env.NEXT_PUBLIC_CAKTO_CHECKOUT_URL_UPSELL ?? "#";

  return (
    <OnboardingBackdrop>
      <OnboardingCard>
        <OnboardingLogo />
        <Crown className="mx-auto h-10 w-10 fill-amber-400 text-amber-400" />
        <h1 className="mt-3 text-3xl font-extrabold leading-tight text-white sm:text-4xl">
          Desbloqueie <span className="text-violet-400">ainda mais</span>
        </h1>
        <p className="mt-4 text-sm text-white/70">
          Leve o pacote avançado e tenha acesso completo a recursos extras antes de entrar no app.
        </p>
        <div className="mt-7 flex flex-col gap-3">
          <a
            href={upsellCheckoutUrl}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 py-3.5 text-base font-bold text-white active:opacity-90"
          >
            <Check className="h-5 w-5" /> Quero desbloquear
          </a>
          <Link
            href="/feed"
            className="flex w-full items-center justify-center gap-2 rounded-full border border-white/20 py-3.5 text-base font-bold text-white/80 active:opacity-70"
          >
            <X className="h-5 w-5" /> Não quero, continuar
          </Link>
        </div>
        <OnboardingBadges />
      </OnboardingCard>
    </OnboardingBackdrop>
  );
}
```

**Status: ✅ código correto.** Guarda de sessão (`redirect("/entrar")` sem VIP, `redirect("/feed")` se upsell já aprovado) e botão "Quero" lendo `NEXT_PUBLIC_CAKTO_CHECKOUT_URL_UPSELL` já implementados como planejado.

**⚠️ Mesmo problema do item 2:** não aponta para `https://pay.cakto.com.br/3chrxbd_921615` porque a variável está vazia no `.env.local`.

---

## 4. `lib/context/vip-modal-context.tsx`

```tsx
"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { VipUnlockModal } from "@/components/feed/vip-unlock-modal";
import { useSession } from "@/lib/context/session-context";

interface VipModalContextValue {
  openVipModal: () => void;
}

const VipModalContext = createContext<VipModalContextValue | null>(null);

export function VipModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { hasVipAccess } = useSession();

  function openVipModal() {
    if (hasVipAccess) return;
    setOpen(true);
  }

  return (
    <VipModalContext.Provider value={{ openVipModal }}>
      {children}
      <VipUnlockModal open={open} onClose={() => setOpen(false)} />
    </VipModalContext.Provider>
  );
}

export function useVipModal(): VipModalContextValue {
  const ctx = useContext(VipModalContext);
  if (!ctx) throw new Error("useVipModal must be used within VipModalProvider");
  return ctx;
}
```

**Status: ✅ correto e completo.** Lê `hasVipAccess` de `useSession()`, `openVipModal` vira no-op quando já há sessão VIP, assinatura pública do hook inalterada. Não depende de Sheets/n8n — não precisa de nenhuma mudança quando a validação migrar para n8n.

---

## 5. `.env.example`

```
APIFY_API_TOKEN=
SESSION_SECRET=
GOOGLE_SHEETS_ID=
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY=
CAKTO_WEBHOOK_SECRET=
CAKTO_PRODUCT_ID_VIP=
CAKTO_PRODUCT_ID_UPSELL=
NEXT_PUBLIC_CAKTO_CHECKOUT_URL_VIP=
NEXT_PUBLIC_CAKTO_CHECKOUT_URL_UPSELL=
```

**Status: ⚠️ desatualizado em relação à decisão de usar n8n.** Ainda lista só as variáveis do desenho original (Google Sheets + webhook Cakto→app). Não existe nenhuma variável para o endpoint/secret do n8n porque essa integração ainda não foi escrita (depende das respostas pedidas na seção 1).

Quando a migração pra n8n for implementada, este arquivo ganha algo como `N8N_VERIFY_ACCESS_URL=` e, se houver autenticação, `N8N_VERIFY_ACCESS_SECRET=` — nomes exatos a definir junto com a implementação da Task 1 (seção acima).

---

## 6. O que está preenchido no `.env.local`

```
APIFY_API_TOKEN=[REDACTED]
SESSION_SECRET=[REDACTED]
```

Só essas duas. **Todas as outras 8 variáveis do `.env.example` estão faltando no `.env.local`:**

| Variável | Necessária para | Preenchida? |
|---|---|---|
| `GOOGLE_SHEETS_ID` | `OrderStore` via Sheets (código antigo, ainda em uso em `actions.ts`) | ❌ não |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | idem | ❌ não |
| `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` | idem | ❌ não |
| `CAKTO_WEBHOOK_SECRET` | webhook `/api/webhooks/cakto` (código antigo) | ❌ não |
| `CAKTO_PRODUCT_ID_VIP` | idem | ❌ não |
| `CAKTO_PRODUCT_ID_UPSELL` | idem | ❌ não |
| `NEXT_PUBLIC_CAKTO_CHECKOUT_URL_VIP` | botão "Seja VIP" / "DESBLOQUEAR" | ❌ não — precisa de `https://pay.cakto.com.br/3c9getz_921646` |
| `NEXT_PUBLIC_CAKTO_CHECKOUT_URL_UPSELL` | botão "Quero" em `/upsell` | ❌ não — precisa de `https://pay.cakto.com.br/3chrxbd_921615` |

**Consequência prática agora:** com o `.env.local` como está, `/entrar` vai sempre retornar "não encontramos compra aprovada" (porque `GOOGLE_SHEETS_ID` etc. faltando faz `orderStore` lançar erro de env ausente), e os dois botões de checkout apontam para `#`.

---

## Resumo — 3 pendências reais

1. **`app/entrar/actions.ts` ainda fala com o Google Sheets, não com o n8n.** Preciso da URL do webhook n8n, do formato da resposta e (se houver) do secret de autenticação pra reescrever essa função.
2. **`NEXT_PUBLIC_CAKTO_CHECKOUT_URL_VIP` e `NEXT_PUBLIC_CAKTO_CHECKOUT_URL_UPSELL` precisam ser preenchidas no `.env.local`** com os dois links que você já tem (`.../3c9getz_921646` e `.../3chrxbd_921615`) — o código já está pronto para usá-las, só falta o valor.
3. **Se o n8n substituir de vez o Sheets**, os arquivos `lib/orders/*`, `app/api/webhooks/cakto/route.ts` e as 6 variáveis `GOOGLE_*`/`CAKTO_WEBHOOK_SECRET`/`CAKTO_PRODUCT_ID_*` ficam órfãos e podem ser removidos — hoje ainda estão todos no repositório e funcionais, só não estão configurados.
