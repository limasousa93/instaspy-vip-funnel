# Funil de Vendas VIP (Cakto + Sheets) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ligar o app gratuito (amostra) já existente a um funil de venda completo: checkout Cakto → validação da compra por e-mail/celular → sessão de acesso → upsell pós-login → segundo checkout → acesso final ao app, sem quebrar o onboarding/feed/VIP-gate que já funcionam hoje.

**Architecture:** Dois checkouts hospedados pela Cakto (sem integração de formulário, só links). A Cakto avisa o backend por webhook quando uma compra é aprovada; o backend grava o pedido numa planilha do Google Sheets (via uma camada `OrderStore` trocável, para no futuro virar banco de dados sem tocar no resto do app). Uma página `/entrar` deixa o comprador provar a compra digitando e-mail/celular; se bater com um pedido aprovado, criamos um cookie de sessão assinado (HMAC, sem senha) que marca acesso VIP e acesso ao upsell. Uma página `/upsell` (protegida por sessão) oferece o segundo produto; recusar não bloqueia o uso do app agora, mas o upsell volta a aparecer em todo login futuro até ser aceito. O botão "Seja VIP" que já existe no feed passa a apontar para o checkout real.

**Tech Stack:** Next.js 16 (App Router, Server Actions, Route Handlers, `cookies()` assíncrono — ver `node_modules/next/dist/docs/01-app/`), React 19, TypeScript, `googleapis` (novo, para Google Sheets), Web Crypto API nativa (`crypto.subtle`) para assinar a sessão — sem novas libs de auth/JWT.

**Spec:** requisitos do funil descritos pelo usuário nesta conversa (ver resumo abaixo); não há um arquivo de spec separado.

## Global Constraints

- **Sem testes automatizados no projeto** (`package.json` não tem `test`/vitest/jest/playwright). O "ciclo de teste" de cada task abaixo é: `npx tsc --noEmit` limpo + `npm run lint` limpo + verificação manual (curl / browser) descrita na task. Não invente um test runner novo — YAGNI.
- **Gateway de pagamento: Cakto.** Os dois checkouts são links hospedados pela Cakto (produto VIP e produto Upsell); o app nunca coleta cartão. O payload exato do webhook da Cakto (nomes de campos, header de assinatura) precisa ser confirmado no painel/documentação da Cakto durante a Task 3 — o código está escrito para ser fácil de ajustar num único arquivo (`lib/webhooks/cakto-payload.ts`) se os nomes de campo forem diferentes do que assumimos aqui.
- **Persistência de pedidos: Google Sheets agora, banco depois.** Toda leitura/escrita de pedido passa por uma interface `OrderStore` (Task 2). Trocar para banco de dados no futuro = criar um novo arquivo `lib/orders/db-order-store.ts` e mudar uma linha em `lib/orders/order-store.ts` — nenhuma outra parte do app muda.
- **Sessão sem senha.** Verificação por e-mail/celular + cookie httpOnly assinado (HMAC-SHA256 via Web Crypto). Sem cadastro de senha, sem lib de auth nova.
- **Upsell reaparece até ser aceito.** Se o usuário recusar o upsell, ele entra no app mesmo assim nesta sessão, mas a checagem em `/entrar` volta a mandar para `/upsell` em todo login futuro até haver um pedido aprovado do produto upsell.
- **Não alterar o comportamento hoje existente do fluxo gratuito.** `/`, `/buscar`, `components/onboarding/onboarding-flow.tsx` e a navegação livre em `/feed` (amostra grátis) continuam exatamente como estão — o gate VIP só passa a ficar "transparente" (não abre mais o modal) quando existir uma sessão paga válida.
- Nomenclatura de rotas em português, consistente com o resto do app (`/entrar`, `/upsell`).
- Variáveis de ambiente novas vão em `.env.example` (placeholders) e `.env.local` (valores reais do usuário) — ambos já estão no `.gitignore`.

---

## Contexto do estado atual (confirmado por exploração do código)

- `app/page.tsx` e `app/buscar/page.tsx` já renderizam `components/onboarding/onboarding-flow.tsx` (steps: intro → handle → preview → redirecting), que hoje termina com `router.push("/feed")` direto. **Não muda.**
- `app/(app)/layout.tsx` envolve feed/explore/reels/notificações/direct/perfil num `AppShell`, sem guarda de sessão. **Continua público** (é a amostra grátis).
- O gate VIP já existe: `lib/context/vip-modal-context.tsx` (`VipModalProvider`/`useVipModal`) + `components/feed/vip-unlock-modal.tsx` + `components/feed/vip-unlock-banner.tsx` (`VipUnlockCard`, botão "DESBLOQUEAR" hoje sem `href`/`onClick`) + `components/shared/free-access-warning-banner.tsx` + `components/shell/access-timer-banner.tsx`. Mais de 15 componentes chamam `openVipModal()` ao clicar em curtir/comentar/DM/etc.
- `lib/context/auth-context.tsx` só tem `logout()` (remove uma chave de `localStorage` e navega pra `/`) — não cria sessão nenhuma hoje.
- Não existe checkout, login real, banco de dados nem gateway de pagamento no repositório. Única integração de backend: Apify (`lib/instagram/apify-client.ts`), com `APIFY_API_TOKEN` em `.env.local`.
- `app/api/instagram/[username]/route.ts` é o único Route Handler existente — usa `params: Promise<{...}>` (Next 15+/16 assíncrono) e `NextResponse.json(...)`; os novos Route Handlers seguem o mesmo padrão.

---

## File Structure

```
lib/
  session/
    session.ts                # assina/verifica o cookie de sessão (Web Crypto HMAC)
  context/
    session-context.tsx       # SessionProvider/useSession() — client context
    vip-modal-context.tsx     # MODIFICADO: openVipModal vira no-op se já tem VIP
  orders/
    types.ts                  # Order, ProductKey, OrderStore
    normalize-contact.ts      # normaliza email/telefone pra comparação
    sheets-order-store.ts     # implementação OrderStore via Google Sheets
    order-store.ts            # ponto único de import (troca de storage aqui)
  webhooks/
    cakto-payload.ts          # parse/validação do payload do webhook Cakto

app/
  layout.tsx                  # MODIFICADO: lê cookie de sessão no server, injeta SessionProvider
  api/
    webhooks/
      cakto/route.ts          # recebe webhook de compra aprovada da Cakto
  entrar/
    page.tsx                  # "Validação da Compra" + "Verificação de Acesso" (mesma tela)
    actions.ts                # server action: valida contato, cria sessão, redireciona
    verify-access-form.tsx    # client component do formulário
  upsell/
    page.tsx                  # oferta pós-login; "quero" -> checkout 2, "não quero" -> /feed

components/
  feed/
    vip-unlock-banner.tsx     # MODIFICADO: botão "DESBLOQUEAR" vira link pro checkout 1

.env.example                  # MODIFICADO: novas variáveis (placeholders)
.env.local                    # MODIFICADO: novas variáveis (usuário preenche os valores reais)
package.json                  # MODIFICADO: + dependência "googleapis"
```

---

### Task 1: Sessão assinada (cookie) + contexto de sessão no client

**Files:**
- Create: `lib/session/session.ts`
- Create: `lib/context/session-context.tsx`
- Modify: `app/layout.tsx`

**Interfaces:**
- Produces (usado pelas próximas tasks):
  - `SESSION_COOKIE_NAME: string`
  - `type SessionPayload = { contact: string; vip: boolean; upsell: boolean; iat: number }`
  - `signSession(payload: Omit<SessionPayload, "iat">): Promise<string>` — retorna o valor do cookie
  - `verifySession(token: string | undefined): Promise<SessionPayload | null>`
  - `SessionProvider({ value, children }: { value: { hasVipAccess: boolean; hasUpsellAccess: boolean }; children: ReactNode })`
  - `useSession(): { hasVipAccess: boolean; hasUpsellAccess: boolean }`

- [ ] **Step 1: Criar `lib/session/session.ts`**

```ts
import "server-only";

export const SESSION_COOKIE_NAME = "ig_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 dias

export interface SessionPayload {
  contact: string;
  vip: boolean;
  upsell: boolean;
  iat: number;
}

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET não configurado em .env.local");
  return secret;
}

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(padded);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function hmacKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

export async function signSession(payload: Omit<SessionPayload, "iat">): Promise<string> {
  const full: SessionPayload = { ...payload, iat: Date.now() };
  const payloadBytes = new TextEncoder().encode(JSON.stringify(full));
  const encodedPayload = base64UrlEncode(payloadBytes);
  const key = await hmacKey();
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(encodedPayload));
  const encodedSignature = base64UrlEncode(new Uint8Array(signature));
  return `${encodedPayload}.${encodedSignature}`;
}

export async function verifySession(token: string | undefined | null): Promise<SessionPayload | null> {
  if (!token) return null;
  const [encodedPayload, encodedSignature] = token.split(".");
  if (!encodedPayload || !encodedSignature) return null;

  try {
    const key = await hmacKey();
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      base64UrlDecode(encodedSignature),
      new TextEncoder().encode(encodedPayload),
    );
    if (!valid) return null;

    const payload = JSON.parse(new TextDecoder().decode(base64UrlDecode(encodedPayload))) as SessionPayload;
    const ageSeconds = (Date.now() - payload.iat) / 1000;
    if (ageSeconds > SESSION_MAX_AGE_SECONDS) return null;
    return payload;
  } catch {
    return null;
  }
}
```

`import "server-only"` garante que ninguém importe isso sem querer num client component (o pacote `server-only` já vem transitivamente com o Next; se o build reclamar de módulo ausente, troque por um comentário — não é bloqueante).

- [ ] **Step 2: Criar `lib/context/session-context.tsx`**

```tsx
"use client";

import { createContext, useContext, type ReactNode } from "react";

interface SessionValue {
  hasVipAccess: boolean;
  hasUpsellAccess: boolean;
}

const SessionContext = createContext<SessionValue>({ hasVipAccess: false, hasUpsellAccess: false });

export function SessionProvider({ value, children }: { value: SessionValue; children: ReactNode }) {
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionValue {
  return useContext(SessionContext);
}
```

- [ ] **Step 3: Ligar no `app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/context/auth-context";
import { InteractionsProvider } from "@/lib/context/interactions-context";
import { VipModalProvider } from "@/lib/context/vip-modal-context";
import { SessionProvider } from "@/lib/context/session-context";
import { SESSION_COOKIE_NAME, verifySession } from "@/lib/session/session";

// ...fonts e metadata continuam iguais...

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const cookieStore = await cookies();
  const session = await verifySession(cookieStore.get(SESSION_COOKIE_NAME)?.value);

  return (
    <html
      lang="pt-BR"
      className={`dark ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground" suppressHydrationWarning>
        <SessionProvider value={{ hasVipAccess: session?.vip ?? false, hasUpsellAccess: session?.upsell ?? false }}>
          <AuthProvider>
            <InteractionsProvider>
              <VipModalProvider>{children}</VipModalProvider>
            </InteractionsProvider>
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
```

(Só troca `export default function RootLayout` por `export default async function RootLayout` e envolve tudo num `SessionProvider` a mais — o resto do JSX não muda.)

- [ ] **Step 4: Adicionar `SESSION_SECRET` nos envs**

Em `.env.example`, adicionar:
```
SESSION_SECRET=
```
Em `.env.local`, gerar um valor real:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
e colar o resultado em `SESSION_SECRET=` no `.env.local`.

- [ ] **Step 5: Verificar**

Run: `npx tsc --noEmit`
Expected: sem erros.

Run: `npm run dev` e abrir `/` no browser — deve carregar normalmente (sem cookie ainda, `hasVipAccess: false`).

- [ ] **Step 6: Commit**

```bash
git add lib/session/session.ts lib/context/session-context.tsx app/layout.tsx .env.example .env.local
git commit -m "feat: add signed session cookie and SessionProvider"
```

---

### Task 2: Camada de pedidos (`OrderStore`) sobre Google Sheets

**Files:**
- Create: `lib/orders/types.ts`
- Create: `lib/orders/normalize-contact.ts`
- Create: `lib/orders/sheets-order-store.ts`
- Create: `lib/orders/order-store.ts`
- Modify: `package.json` (dependência `googleapis`)
- Modify: `.env.example`, `.env.local`

**Interfaces:**
- Consumes: nada de tasks anteriores.
- Produces (usado pelas Tasks 3 e 4):
  - `type ProductKey = "vip" | "upsell"`
  - `interface Order { contact: string; product: ProductKey; status: "approved" | "refunded"; orderId: string; purchasedAt: string }`
  - `interface OrderStore { findApprovedOrders(contact: string): Promise<Order[]>; recordOrder(order: Order): Promise<void> }`
  - `normalizeContact(raw: string): string`
  - `orderStore: OrderStore` (instância pronta pra usar, exportada de `lib/orders/order-store.ts`)

- [ ] **Step 1: Instalar a dependência**

```bash
npm install googleapis
```

- [ ] **Step 2: Criar `lib/orders/types.ts`**

```ts
export type ProductKey = "vip" | "upsell";

export interface Order {
  contact: string;
  product: ProductKey;
  status: "approved" | "refunded";
  orderId: string;
  purchasedAt: string;
}

export interface OrderStore {
  findApprovedOrders(contact: string): Promise<Order[]>;
  recordOrder(order: Order): Promise<void>;
}
```

- [ ] **Step 3: Criar `lib/orders/normalize-contact.ts`**

```ts
export function normalizeContact(raw: string): string {
  const trimmed = raw.trim().toLowerCase();
  if (trimmed.includes("@")) return trimmed;
  return trimmed.replace(/\D/g, "");
}
```

- [ ] **Step 4: Criar `lib/orders/sheets-order-store.ts`**

```ts
import "server-only";
import { google } from "googleapis";
import type { Order, OrderStore } from "./types";
import { normalizeContact } from "./normalize-contact";

const SHEET_RANGE = "Pedidos!A:E"; // contact | product | status | orderId | purchasedAt

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} não configurado em .env.local`);
  return value;
}

async function getSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: getEnv("GOOGLE_SERVICE_ACCOUNT_EMAIL"),
      private_key: getEnv("GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY").replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return google.sheets({ version: "v4", auth });
}

export function createSheetsOrderStore(): OrderStore {
  return {
    async findApprovedOrders(contact) {
      const sheets = await getSheetsClient();
      const spreadsheetId = getEnv("GOOGLE_SHEETS_ID");
      const target = normalizeContact(contact);

      const { data } = await sheets.spreadsheets.values.get({ spreadsheetId, range: SHEET_RANGE });
      const rows = data.values ?? [];

      return rows
        .slice(1) // pula cabeçalho
        .map((row): Order => ({
          contact: String(row[0] ?? ""),
          product: (row[1] as Order["product"]) ?? "vip",
          status: (row[2] as Order["status"]) ?? "approved",
          orderId: String(row[3] ?? ""),
          purchasedAt: String(row[4] ?? ""),
        }))
        .filter((order) => normalizeContact(order.contact) === target && order.status === "approved");
    },

    async recordOrder(order) {
      const sheets = await getSheetsClient();
      const spreadsheetId = getEnv("GOOGLE_SHEETS_ID");

      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: SHEET_RANGE,
        valueInputOption: "RAW",
        requestBody: {
          values: [[order.contact, order.product, order.status, order.orderId, order.purchasedAt]],
        },
      });
    },
  };
}
```

- [ ] **Step 5: Criar `lib/orders/order-store.ts`**

```ts
import { createSheetsOrderStore } from "./sheets-order-store";
import type { OrderStore } from "./types";

// Trocar para banco de dados no futuro: criar lib/orders/db-order-store.ts
// exportando createDbOrderStore() e trocar só a linha abaixo.
export const orderStore: OrderStore = createSheetsOrderStore();

export type { Order, ProductKey, OrderStore } from "./types";
```

- [ ] **Step 6: Adicionar envs**

Em `.env.example`:
```
GOOGLE_SHEETS_ID=
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY=
```
Em `.env.local`, o usuário precisa:
1. Criar uma planilha Google Sheets com uma aba `Pedidos` e cabeçalho `contact | product | status | orderId | purchasedAt` na linha 1.
2. Criar uma Service Account no Google Cloud Console, ativar a Google Sheets API, gerar uma chave JSON.
3. Compartilhar a planilha (botão "Compartilhar") com o `client_email` da service account, como Editor.
4. Colar `GOOGLE_SHEETS_ID` (o ID na URL da planilha), `GOOGLE_SERVICE_ACCOUNT_EMAIL` e `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` (o campo `private_key` do JSON, mantendo os `\n`) no `.env.local`.

- [ ] **Step 7: Verificar**

Run: `npx tsc --noEmit`
Expected: sem erros.

Verificação manual (depois de preencher os envs reais): criar um script temporário `scripts/test-sheets.mjs` só pra rodar uma vez:
```js
import { orderStore } from "../lib/orders/order-store.ts";
await orderStore.recordOrder({ contact: "teste@exemplo.com", product: "vip", status: "approved", orderId: "manual-1", purchasedAt: new Date().toISOString() });
console.log(await orderStore.findApprovedOrders("teste@exemplo.com"));
```
Rodar com `npx tsx scripts/test-sheets.mjs`, confirmar que a linha aparece na planilha e que a busca retorna o pedido. Apagar o script depois (é só pra validar a integração, não faz parte do app).

- [ ] **Step 8: Commit**

```bash
git add lib/orders package.json package-lock.json .env.example .env.local
git commit -m "feat: add OrderStore backed by Google Sheets"
```

---

### Task 3: Webhook da Cakto (compra aprovada)

**Files:**
- Create: `lib/webhooks/cakto-payload.ts`
- Create: `app/api/webhooks/cakto/route.ts`
- Modify: `.env.example`, `.env.local`

**Interfaces:**
- Consumes: `orderStore.recordOrder` (Task 2), `Order`/`ProductKey` (Task 2).
- Produces: endpoint HTTP `POST /api/webhooks/cakto`.

> **Atenção — confirmar na Cakto:** o formato exato do payload (nomes de campo, se o evento vem como `event`/`status`, como a Cakto assina o webhook — header `X-Cakto-Signature`, secret na query string, etc.) precisa ser conferido no painel da Cakto (seção de Webhooks do produto) antes de ativar em produção. O código abaixo assume um formato razoável (JSON com `event`, `product_id`, `customer.email`, `customer.phone`, `order_id`) e centraliza esse parsing em `lib/webhooks/cakto-payload.ts` — se os nomes forem diferentes, só esse arquivo muda.

- [ ] **Step 1: Criar `lib/webhooks/cakto-payload.ts`**

```ts
import type { ProductKey } from "@/lib/orders/types";

export interface CaktoWebhookEvent {
  contact: string;
  product: ProductKey;
  orderId: string;
  approved: boolean;
}

function resolveProduct(productId: string): ProductKey | null {
  if (productId === process.env.CAKTO_PRODUCT_ID_VIP) return "vip";
  if (productId === process.env.CAKTO_PRODUCT_ID_UPSELL) return "upsell";
  return null;
}

// Ajustar este parser para o payload real da Cakto quando confirmado.
export function parseCaktoWebhook(body: unknown): CaktoWebhookEvent | null {
  if (typeof body !== "object" || body === null) return null;
  const payload = body as Record<string, unknown>;

  const event = String(payload.event ?? "");
  const productId = String(payload.product_id ?? "");
  const orderId = String(payload.order_id ?? "");
  const customer = (payload.customer ?? {}) as Record<string, unknown>;
  const contact = String(customer.email ?? customer.phone ?? "");

  const product = resolveProduct(productId);
  if (!product || !contact || !orderId) return null;

  return {
    contact,
    product,
    orderId,
    approved: event === "purchase_approved",
  };
}

export function isValidCaktoSecret(request: Request): boolean {
  const expected = process.env.CAKTO_WEBHOOK_SECRET;
  if (!expected) return false;
  const provided = request.headers.get("x-webhook-secret") ?? new URL(request.url).searchParams.get("secret");
  return provided === expected;
}
```

- [ ] **Step 2: Criar `app/api/webhooks/cakto/route.ts`**

```ts
import { NextResponse } from "next/server";
import { orderStore } from "@/lib/orders/order-store";
import { isValidCaktoSecret, parseCaktoWebhook } from "@/lib/webhooks/cakto-payload";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isValidCaktoSecret(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const event = parseCaktoWebhook(body);
  if (!event) {
    return NextResponse.json({ error: "payload inválido" }, { status: 400 });
  }

  if (event.approved) {
    await orderStore.recordOrder({
      contact: event.contact,
      product: event.product,
      status: "approved",
      orderId: event.orderId,
      purchasedAt: new Date().toISOString(),
    });
  }

  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 3: Adicionar envs**

Em `.env.example`:
```
CAKTO_WEBHOOK_SECRET=
CAKTO_PRODUCT_ID_VIP=
CAKTO_PRODUCT_ID_UPSELL=
```
Em `.env.local`: gerar um secret aleatório para `CAKTO_WEBHOOK_SECRET` (mesmo comando `node -e "console.log(require('crypto').randomBytes(24).toString('hex'))"`) e configurá-lo no painel da Cakto como parâmetro/segredo do webhook; preencher `CAKTO_PRODUCT_ID_VIP`/`CAKTO_PRODUCT_ID_UPSELL` com os IDs reais dos dois produtos cadastrados na Cakto.

No painel da Cakto, cadastrar a URL do webhook para os dois produtos: `https://SEUDOMINIO/api/webhooks/cakto?secret=<CAKTO_WEBHOOK_SECRET>` (ou como header, dependendo do que a Cakto suportar — ajustar `isValidCaktoSecret` se for só header).

- [ ] **Step 4: Verificar**

Run: `npx tsc --noEmit`
Expected: sem erros.

Verificação manual local:
```bash
npm run dev
curl -X POST "http://localhost:3000/api/webhooks/cakto?secret=SEU_SECRET_LOCAL" \
  -H "Content-Type: application/json" \
  -d '{"event":"purchase_approved","product_id":"SEU_CAKTO_PRODUCT_ID_VIP","order_id":"teste-1","customer":{"email":"teste@exemplo.com"}}'
```
Expected: `{"ok":true}` e a linha aparecendo na planilha do Google Sheets.

- [ ] **Step 5: Commit**

```bash
git add lib/webhooks app/api/webhooks .env.example .env.local
git commit -m "feat: add Cakto purchase-approved webhook"
```

---

### Task 4: Página `/entrar` — validação da compra + verificação de acesso

**Files:**
- Create: `app/entrar/page.tsx`
- Create: `app/entrar/actions.ts`
- Create: `app/entrar/verify-access-form.tsx`

**Interfaces:**
- Consumes: `orderStore.findApprovedOrders` (Task 2), `signSession`/`SESSION_COOKIE_NAME`/`SESSION_MAX_AGE_SECONDS` (Task 1).
- Produces: rota `/entrar` (com `?error=` para mensagem de erro) usada como destino do "link da página de login" que a Cakto/o usuário acessa depois de pagar, e reusada em todo login futuro.

- [ ] **Step 1: Criar a server action `app/entrar/actions.ts`**

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

- [ ] **Step 2: Criar o formulário client `app/entrar/verify-access-form.tsx`**

```tsx
"use client";

import { useActionState } from "react";
import { verifyAccessAction } from "./actions";

const initialState = { error: undefined as string | undefined };

export function VerifyAccessForm() {
  const [state, formAction, pending] = useActionState(verifyAccessAction, initialState);

  return (
    <form action={formAction} className="mt-7 w-full">
      <div className="flex items-center gap-2 rounded-full border border-violet-500/50 bg-white/5 px-5 py-3.5">
        <input
          name="contact"
          autoFocus
          placeholder="E-mail ou celular usado na compra"
          aria-label="E-mail ou celular usado na compra"
          className="w-full min-w-0 bg-transparent text-left text-base text-white placeholder:text-white/40 focus:outline-none"
        />
      </div>
      {state.error && <p className="mt-3 text-sm font-semibold text-red-400">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 py-3.5 text-base font-bold text-white active:opacity-90 disabled:opacity-40"
      >
        {pending ? "Verificando..." : "Acessar"}
      </button>
    </form>
  );
}
```

- [ ] **Step 3: Criar `app/entrar/page.tsx`**

```tsx
import { OnboardingBackdrop, OnboardingBadges, OnboardingCard, OnboardingLogo } from "@/components/onboarding/onboarding-card";
import { VerifyAccessForm } from "./verify-access-form";

export default function EntrarPage() {
  return (
    <OnboardingBackdrop>
      <OnboardingCard>
        <OnboardingLogo />
        <h1 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl">
          Confirme sua <span className="text-violet-400">compra</span>
        </h1>
        <p className="mt-4 text-sm text-white/70">
          Digite o e-mail ou celular que você usou no pagamento para liberar seu acesso VIP.
        </p>
        <VerifyAccessForm />
        <OnboardingBadges />
      </OnboardingCard>
    </OnboardingBackdrop>
  );
}
```

(Reaproveita os componentes visuais que já existem em `components/onboarding/onboarding-card.tsx` — mesmo estilo do resto do funil, zero CSS novo.)

- [ ] **Step 4: Verificar**

Run: `npx tsc --noEmit`
Expected: sem erros.

Manual: com o pedido de teste da Task 2/3 já gravado (`teste@exemplo.com`, produto `vip`), abrir `/entrar`, digitar `teste@exemplo.com` e confirmar que:
- redireciona para `/upsell` (ainda não tem pedido `upsell`);
- o DevTools mostra um cookie `ig_session` `httpOnly`;
- digitar um contato sem pedido aprovado mostra a mensagem de erro e não seta cookie.

- [ ] **Step 5: Commit**

```bash
git add app/entrar
git commit -m "feat: add /entrar purchase validation and access page"
```

---

### Task 5: Página `/upsell` (oferta pós-login)

**Files:**
- Create: `app/upsell/page.tsx`

**Interfaces:**
- Consumes: `SESSION_COOKIE_NAME`/`verifySession` (Task 1).
- Produces: rota `/upsell`, destino do `redirect("/upsell")` da Task 4.

- [ ] **Step 1: Criar `app/upsell/page.tsx`**

```tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
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
          <a
            href="/feed"
            className="flex w-full items-center justify-center gap-2 rounded-full border border-white/20 py-3.5 text-base font-bold text-white/80 active:opacity-70"
          >
            <X className="h-5 w-5" /> Não quero, continuar
          </a>
        </div>
        <OnboardingBadges />
      </OnboardingCard>
    </OnboardingBackdrop>
  );
}
```

- [ ] **Step 2: Adicionar envs de checkout**

Em `.env.example`:
```
NEXT_PUBLIC_CAKTO_CHECKOUT_URL_VIP=
NEXT_PUBLIC_CAKTO_CHECKOUT_URL_UPSELL=
```
Em `.env.local`, colar os links reais dos dois checkouts hospedados pela Cakto. No painel da Cakto, configurar a "página de obrigado"/redirecionamento pós-compra de **ambos** os produtos para `https://SEUDOMINIO/entrar` (é a mesma tela pros dois — ela decide sozinha, pelo pedido aprovado mais recente, se ainda falta o upsell).

- [ ] **Step 3: Verificar**

Run: `npx tsc --noEmit`
Expected: sem erros.

Manual: acessar `/upsell` sem cookie de sessão → deve redirecionar pra `/entrar`. Com sessão `vip:true, upsell:false` (gerada pela Task 4) → mostra a oferta; clicar em "Não quero" → vai pra `/feed`. Gravar manualmente um pedido `upsell` aprovado pro mesmo contato (Task 2, Step 7) e logar de novo em `/entrar` → agora pula `/upsell` direto pra `/feed`.

- [ ] **Step 4: Commit**

```bash
git add app/upsell .env.example .env.local
git commit -m "feat: add post-login /upsell offer page"
```

---

### Task 6: Ligar o botão "Seja VIP" ao checkout 1 e silenciar o gate para quem já é VIP

**Files:**
- Modify: `components/feed/vip-unlock-banner.tsx`
- Modify: `lib/context/vip-modal-context.tsx`

**Interfaces:**
- Consumes: `useSession()` (Task 1).

- [ ] **Step 1: Ler o `vip-modal-context.tsx` atual antes de editar**

(Ler o arquivo primeiro — ele hoje só tem `open`/`openVipModal`/`closeVipModal` via `useState`; a mudança é adicionar a checagem de sessão dentro de `openVipModal`, sem mudar a assinatura pública do hook.)

- [ ] **Step 2: Editar `openVipModal` para virar no-op quando já é VIP**

No corpo de `VipModalProvider`, importar `useSession` de `@/lib/context/session-context` e trocar a função `openVipModal` por:

```ts
const { hasVipAccess } = useSession();

function openVipModal() {
  if (hasVipAccess) return;
  setOpen(true);
}
```

(mantém `closeVipModal`/`open` como estão — só a abertura passa a checar a sessão.)

- [ ] **Step 3: Editar `components/feed/vip-unlock-banner.tsx`**

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

`VipUnlockCard` é um Server Component por padrão (não tem `"use client"` no arquivo) — `process.env.NEXT_PUBLIC_*` funciona normalmente aqui porque é inlined em build time pelo Next; se este arquivo hoje for importado só dentro de árvores client (confirmar ao editar — `vip-unlock-modal.tsx` é quem o usa), não precisa de `"use client"` novo, só confirmar que não quebra ao renderizar dentro do modal client.

- [ ] **Step 4: Verificar**

Run: `npx tsc --noEmit` e `npm run lint`
Expected: sem erros.

Manual: sem sessão (amostra grátis) → clicar em qualquer ação no `/feed` ainda abre o modal VIP normalmente, e o botão "DESBLOQUEAR" agora navega pro link real da Cakto. Com uma sessão `vip:true` (gerada via `/entrar` na Task 4) → clicar nas mesmas ações do feed não abre mais o modal.

- [ ] **Step 5: Commit**

```bash
git add components/feed/vip-unlock-banner.tsx lib/context/vip-modal-context.tsx
git commit -m "feat: wire VIP unlock button to Cakto checkout and skip gate for paid sessions"
```

---

## Self-Review (cobertura do funil pedido)

| Etapa do funil pedida pelo usuário | Onde fica implementada |
|---|---|
| Landing Page | `app/page.tsx` (já existe, sem mudança) |
| Página de Busca | `onboarding-flow.tsx` step `handle` (já existe) |
| Página de Confirmação | `onboarding-flow.tsx` step `preview` (já existe) |
| App Gratuito (amostra) + bloqueio parcial | `/feed` + `VipModalProvider`/`VipUnlockModal` (já existe) |
| Clica em "Seja VIP" → checkout | Task 6 (`VipUnlockCard` → link Cakto) |
| Checkout 1 | Hospedado pela Cakto (fora do app) |
| Validação da compra (e-mail/celular) | Task 4 (`/entrar`, `verifyAccessAction`) |
| Verificação de acesso / link da página de login | Task 4 (mesma página `/entrar`, é o destino do redirecionamento pós-compra configurado no painel da Cakto) |
| Upsell pós-login com "quero"/"não quero" | Task 5 (`/upsell`) |
| Checkout 2 | Hospedado pela Cakto (fora do app) |
| Volta pro login, insere contato, não vê mais upsell, entra direto | Task 4 (`verifyAccessAction` detecta pedido `upsell` aprovado e redireciona direto pra `/feed`) |

Toda etapa pedida tem uma task correspondente. Nenhuma rota/arquivo do fluxo gratuito atual (`/`, `/buscar`, onboarding, `/feed` público) é removida ou renomeada — só ganham, no máximo, uma checagem a mais (`openVipModal`) ou um link novo (`VipUnlockCard`).
