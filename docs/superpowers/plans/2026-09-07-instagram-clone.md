# Instagram UI Clone (Dark Mode) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Next.js/React/TypeScript clone of the Instagram web UI (login, feed, reels, explore, messages, profile, notification/menu overlays), dark-mode only, fully responsive desktop/mobile, using only fictitious mock data.

**Architecture:** Single Next.js 15 App Router project. Same routes serve desktop and mobile; layout switches via Tailwind `lg:` breakpoint (desktop sidebar vs. mobile bottom tab bar), never via separate apps/routes. No backend — all data lives in `lib/mock-data/*.ts`; auth and interactions (likes/follow) are simulated via React Context + `localStorage`.

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, shadcn/ui, lucide-react.

**Spec:** `docs/superpowers/specs/2026-09-07-instagram-clone-design.md`

## Global Constraints

- Dark mode is the only theme — no light mode, no toggle. Apply `class="dark"` on `<html>` permanently.
- No real photos or names from the reference screenshots. Avatars: `https://i.pravatar.cc/150?u=<seed>`. Post/reel media: `https://picsum.photos/seed/<seed>/<w>/<h>`.
- No backend/API calls. All data from `lib/mock-data/`. Auth and like/follow state simulated via Context + `localStorage`.
- Routes are shared between desktop and mobile (responsive layout, not separate apps).
- No automated test framework in this project (per spec: "Testing" section). Verification per task = `npx tsc --noEmit` (must pass with 0 errors) + manual check in the running dev server at both a desktop viewport (1440×900) and a mobile viewport (390×844).
- Package manager: npm.

---

## File Structure

```
app/
  layout.tsx                  # root layout: <html class="dark">, fonts, globals.css
  globals.css                 # tailwind + shadcn dark tokens
  login/page.tsx              # /login
  (app)/
    layout.tsx                # AppShell wrapper + auth guard for all authenticated routes
    page.tsx                  # / (feed)
    reels/page.tsx            # /reels
    explore/page.tsx          # /explore
    direct/inbox/page.tsx     # /direct/inbox
    [username]/page.tsx       # /[username] (own profile)
components/
  ui/                         # shadcn-generated primitives (button, avatar, dialog, dropdown-menu, sheet, tabs, input, popover, scroll-area, separator, badge)
  shell/
    app-shell.tsx
    desktop-sidebar.tsx
    mobile-tab-bar.tsx
    notifications-panel.tsx
    more-menu.tsx
    meta-menu.tsx
  feed/
    stories-bar.tsx
    post-card.tsx
    suggestions-sidebar.tsx
  reels/
    reel-player.tsx
  explore/
    explore-grid.tsx
  messages/
    conversation-list.tsx
    conversation-view.tsx
    empty-inbox-state.tsx
  profile/
    profile-header.tsx
    highlights-row.tsx
    profile-tabs.tsx
  auth/
    account-switcher.tsx
    login-form.tsx
lib/
  types.ts
  media.ts                    # avatarUrl(seed), photoUrl(seed,w,h) helpers
  mock-data/
    users.ts
    posts.ts
    stories.ts
    reels.ts
    conversations.ts
    notifications.ts
  context/
    auth-context.tsx
    interactions-context.tsx  # likes + follow state
```

---

### Task 1: Project scaffold, Tailwind, shadcn/ui, dark mode base

**Files:**
- Create: whole Next.js project (`package.json`, `tsconfig.json`, `next.config.ts`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `components.json`, `lib/utils.ts`)

**Interfaces:**
- Produces: `cn()` helper in `lib/utils.ts` (from shadcn init) used by every component task.

- [ ] **Step 1: Scaffold the Next.js app**

Run from the project root (`C:\Users\MEGA HYPE\Desktop\CEREBRO\SITES\INSTAGRAM SPY`):

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias "@/*" --use-npm --yes
```

- [ ] **Step 2: Initialize shadcn/ui**

```bash
npx shadcn@latest init -d
```

This creates `components.json` and `lib/utils.ts` (exports `cn`).

- [ ] **Step 3: Install icon library**

```bash
npm install lucide-react
```

- [ ] **Step 4: Add shadcn primitives needed across the app**

```bash
npx shadcn@latest add button avatar dialog dropdown-menu sheet tabs input popover scroll-area separator badge
```

- [ ] **Step 5: Force dark mode globally**

Edit `app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Instagram Clone (Study Project)",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="bg-background text-foreground antialiased">{children}</body>
    </html>
  );
}
```

- [ ] **Step 6: Redirect the root placeholder page to `/login`**

Replace `app/page.tsx` content with:

```tsx
import { redirect } from "next/navigation";

export default function RootIndex() {
  redirect("/login");
}
```

(This file is temporary — Task 4 replaces it by moving the real feed page into the `(app)` route group, at which point this redirect file is deleted because `(app)/page.tsx` takes over `/`.)

- [ ] **Step 7: Verify it builds and runs**

```bash
npx tsc --noEmit
npm run dev
```

Expected: `tsc` reports no errors; visiting `http://localhost:3000/` redirects to `/login` and shows a blank dark page (route doesn't exist yet — 404 is fine at this step, confirms dark background renders).

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js app with Tailwind, shadcn/ui, dark mode"
```

---

### Task 2: Shared types and mock data

**Files:**
- Create: `lib/types.ts`, `lib/media.ts`, `lib/mock-data/users.ts`, `lib/mock-data/posts.ts`, `lib/mock-data/stories.ts`, `lib/mock-data/reels.ts`, `lib/mock-data/conversations.ts`, `lib/mock-data/notifications.ts`

**Interfaces:**
- Consumes: nothing (pure data layer)
- Produces: `User`, `Post`, `Story`, `Reel`, `Conversation`, `Message`, `AppNotification` types; `avatarUrl(seed)`, `photoUrl(seed, w, h)`; arrays `mockUsers`, `mockPosts`, `mockStories`, `mockReels`, `mockConversations`, `mockNotifications`; constant `CURRENT_USER_ID`.

- [ ] **Step 1: Create media URL helpers**

`lib/media.ts`:

```ts
export function avatarUrl(seed: string): string {
  return `https://i.pravatar.cc/150?u=${encodeURIComponent(seed)}`;
}

export function photoUrl(seed: string, width = 600, height = 750): string {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${width}/${height}`;
}
```

- [ ] **Step 2: Define shared types**

`lib/types.ts`:

```ts
export interface User {
  id: string;
  username: string;
  fullName: string;
  bio: string;
  verified: boolean;
  followers: number;
  following: number;
  postsCount: number;
}

export interface Post {
  id: string;
  authorId: string;
  images: string[];
  caption: string;
  likes: number;
  comments: number;
  shares: number;
  timeAgo: string;
}

export interface Story {
  id: string;
  authorId: string;
  label: string;
  seen: boolean;
}

export interface Reel {
  id: string;
  authorId: string;
  videoThumb: string;
  caption: string;
  likes: number;
  comments: number;
  shares: number;
}

export interface Message {
  id: string;
  fromUserId: string;
  text: string;
  timeAgo: string;
}

export interface Conversation {
  id: string;
  userId: string;
  lastMessage: string;
  timeAgo: string;
  unread: boolean;
  messages: Message[];
}

export interface AppNotification {
  id: string;
  userId: string;
  text: string;
  timeAgo: string;
  group: "today" | "week" | "month";
  actionable: "follow-back" | "none";
}
```

- [ ] **Step 3: Mock users**

`lib/mock-data/users.ts`:

```ts
import { avatarUrl } from "@/lib/media";
import type { User } from "@/lib/types";

export const CURRENT_USER_ID = "u1";

export const mockUsers: User[] = [
  { id: "u1", username: "ana.viajante", fullName: "Ana Ribeiro", bio: "Explorando o mundo 🌍✈️\nFotografia amadora", verified: false, followers: 1349, following: 706, postsCount: 27 },
  { id: "u2", username: "marcos.criativo", fullName: "Marcos Lima", bio: "Design & criatividade", verified: true, followers: 8420, following: 312, postsCount: 143 },
  { id: "u3", username: "juliac.foto", fullName: "Julia Castro", bio: "Fotógrafa de casamentos", verified: false, followers: 5210, following: 890, postsCount: 302 },
  { id: "u4", username: "central.negocios", fullName: "Central de Negócios", bio: "Conteúdo sobre empreendedorismo", verified: false, followers: 34200, following: 12, postsCount: 512 },
  { id: "u5", username: "beatriz.moda", fullName: "Beatriz Souza", bio: "Moda e estilo de vida", verified: true, followers: 92100, following: 540, postsCount: 887 },
  { id: "u6", username: "rafael.tech", fullName: "Rafael Nogueira", bio: "Tech, IA e produtividade", verified: true, followers: 15600, following: 201, postsCount: 98 },
  { id: "u7", username: "isabela.beauty", fullName: "Isabela Ferreira", bio: "Maquiadora profissional", verified: false, followers: 4300, following: 610, postsCount: 210 },
  { id: "u8", username: "lucas.finance", fullName: "Lucas Andrade", bio: "Consultor financeiro", verified: false, followers: 2100, following: 340, postsCount: 76 },
  { id: "u9", username: "clara.eventos", fullName: "Clara Mendes", bio: "Vestidos de noiva e festas", verified: false, followers: 7800, following: 120, postsCount: 421 },
  { id: "u10", username: "diego.arte", fullName: "Diego Brito", bio: "Ilustrador digital", verified: false, followers: 990, following: 450, postsCount: 64 },
  { id: "u11", username: "kallineoficial", fullName: "Kalline Cavalcante", bio: "Life & style", verified: false, followers: 3200, following: 780, postsCount: 155 },
  { id: "u12", username: "italo.virginio", fullName: "Italo Virginio", bio: "Palestrante e escritor", verified: true, followers: 68000, following: 89, postsCount: 340 },
];

export function getUser(id: string): User {
  const user = mockUsers.find((u) => u.id === id);
  if (!user) throw new Error(`Unknown mock user id: ${id}`);
  return user;
}

export { avatarUrl };
```

- [ ] **Step 4: Mock posts**

`lib/mock-data/posts.ts`:

```ts
import { photoUrl } from "@/lib/media";
import type { Post } from "@/lib/types";

export const mockPosts: Post[] = [
  { id: "p1", authorId: "u2", images: [photoUrl("post-1", 600, 750)], caption: "Como eu buscaria R$ 100k com uma oferta hoje, sem entrar nos nichos que todo mundo está brigando.", likes: 664, comments: 326, shares: 8, timeAgo: "1 sem" },
  { id: "p2", authorId: "u6", images: [photoUrl("post-2", 600, 750)], caption: "Belo caso de uso do novo GPT. A melhora da visão computacional é brutal.", likes: 1024, comments: 38, shares: 5, timeAgo: "3 h" },
  { id: "p3", authorId: "u10", images: [photoUrl("post-3", 600, 750), photoUrl("post-3b", 600, 750)], caption: "Por onde anda o mercado criativo em 2026?", likes: 1200, comments: 186, shares: 12, timeAgo: "3 sem" },
  { id: "p4", authorId: "u9", images: [photoUrl("post-4", 600, 750)], caption: "Nova coleção de vestidos de festa chegou 💐", likes: 342, comments: 21, shares: 3, timeAgo: "2 d" },
  { id: "p5", authorId: "u7", images: [photoUrl("post-5", 600, 750)], caption: "Antes e depois de hoje ✨", likes: 890, comments: 64, shares: 9, timeAgo: "5 d" },
];
```

- [ ] **Step 5: Mock stories**

`lib/mock-data/stories.ts`:

```ts
import type { Story } from "@/lib/types";

export const mockStories: Story[] = [
  { id: "s1", authorId: "u3", label: "Sua vez", seen: false },
  { id: "s2", authorId: "u4", label: "praiaviagem", seen: false },
  { id: "s3", authorId: "u5", label: "marcos.oficial", seen: true },
  { id: "s4", authorId: "u6", label: "rafael_tech", seen: false },
  { id: "s5", authorId: "u4", label: "central.neg", seen: true },
  { id: "s6", authorId: "u12", label: "lucena_ferr", seen: false },
];
```

- [ ] **Step 6: Mock reels**

`lib/mock-data/reels.ts`:

```ts
import { photoUrl } from "@/lib/media";
import type { Reel } from "@/lib/types";

export const mockReels: Reel[] = [
  { id: "r1", authorId: "u6", videoThumb: photoUrl("reel-1", 480, 854), caption: "Organização pessoal em menos de 3 minutos", likes: 5252, comments: 223, shares: 88 },
  { id: "r2", authorId: "u10", videoThumb: photoUrl("reel-2", 480, 854), caption: "Passando o meu carro pra frente", likes: 3120, comments: 145, shares: 40 },
  { id: "r3", authorId: "u2", videoThumb: photoUrl("reel-3", 480, 854), caption: "2020 vs 2026: minha stack de ferramentas", likes: 8900, comments: 512, shares: 210 },
  { id: "r4", authorId: "u8", videoThumb: photoUrl("reel-4", 480, 854), caption: "Recuperação tranquila, seguindo em frente", likes: 1220, comments: 88, shares: 15 },
];
```

- [ ] **Step 7: Mock conversations**

`lib/mock-data/conversations.ts`:

```ts
import type { Conversation } from "@/lib/types";

export const mockConversations: Conversation[] = [
  {
    id: "c1", userId: "u7", lastMessage: "Você: Hoje vai dar tudo certo meu amor. De...", timeAgo: "2h", unread: true,
    messages: [
      { id: "m1", fromUserId: "u7", text: "Bom dia! Tudo pronto para hoje?", timeAgo: "09:10" },
      { id: "m2", fromUserId: "u1", text: "Hoje vai dar tudo certo meu amor. De boa!", timeAgo: "09:12" },
    ],
  },
  {
    id: "c2", userId: "u10", lastMessage: "Você: Só isso mas ta vendendo muito", timeAgo: "11h", unread: false,
    messages: [{ id: "m3", fromUserId: "u1", text: "Só isso mas ta vendendo muito", timeAgo: "ontem" }],
  },
  {
    id: "c3", userId: "u8", lastMessage: "Luan enviou um anexo.", timeAgo: "5d", unread: false,
    messages: [{ id: "m4", fromUserId: "u8", text: "Segue o anexo com a proposta.", timeAgo: "5d" }],
  },
  {
    id: "c4", userId: "u3", lastMessage: "Julia enviou um anexo.", timeAgo: "5d", unread: false,
    messages: [{ id: "m5", fromUserId: "u3", text: "Envio as fotos hoje ainda!", timeAgo: "5d" }],
  },
  {
    id: "c5", userId: "u9", lastMessage: "🥰", timeAgo: "1 sem", unread: false,
    messages: [{ id: "m6", fromUserId: "u9", text: "🥰", timeAgo: "1 sem" }],
  },
];
```

- [ ] **Step 8: Mock notifications**

`lib/mock-data/notifications.ts`:

```ts
import type { AppNotification } from "@/lib/types";

export const mockNotifications: AppNotification[] = [
  { id: "n1", userId: "u11", text: "começou a seguir você.", timeAgo: "21h", group: "today", actionable: "follow-back" },
  { id: "n2", userId: "u2", text: "respondeu ao seu comentário: \"Info enviada! Confira sua caixa de entrada\"", timeAgo: "2 d", group: "week", actionable: "none" },
  { id: "n3", userId: "u10", text: "e outras pessoas curtiram seu post.", timeAgo: "4 d", group: "week", actionable: "none" },
  { id: "n4", userId: "u7", text: "curtiu seu post.", timeAgo: "4 d", group: "week", actionable: "none" },
  { id: "n5", userId: "u9", text: "começou a seguir você.", timeAgo: "5 d", group: "week", actionable: "follow-back" },
  { id: "n6", userId: "u5", text: "e outras 3 pessoas curtiram seu story.", timeAgo: "6 d", group: "month", actionable: "none" },
  { id: "n7", userId: "u12", text: "respondeu ao seu comentário: \"Enviei no direct\"", timeAgo: "31 sem", group: "month", actionable: "none" },
];
```

- [ ] **Step 4b: Verify types compile**

```bash
npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 5: Commit**

```bash
git add lib/
git commit -m "feat: add shared types and mock data layer"
```

---

### Task 3: Auth context + `/login` route

**Files:**
- Create: `lib/context/auth-context.tsx`, `components/auth/account-switcher.tsx`, `components/auth/login-form.tsx`, `app/login/page.tsx`
- Modify: `app/layout.tsx` (wrap children in `AuthProvider`)

**Interfaces:**
- Consumes: `mockUsers`, `CURRENT_USER_ID`, `avatarUrl` from Task 2.
- Produces: `AuthProvider`, `useAuth()` returning `{ isAuthenticated: boolean; login: (identifier: string) => void; logout: () => void; }`. Later tasks (4+) use `useAuth()` to guard routes and to render "Sair" in the More menu.

- [ ] **Step 1: Write the auth context**

`lib/context/auth-context.tsx`:

```tsx
"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

const SESSION_KEY = "ig-clone-session";

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setIsAuthenticated(window.localStorage.getItem(SESSION_KEY) === "1");
    setIsLoading(false);
  }, []);

  function login(_identifier: string) {
    window.localStorage.setItem(SESSION_KEY, "1");
    setIsAuthenticated(true);
    router.push("/");
  }

  function logout() {
    window.localStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
    router.push("/login");
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
```

- [ ] **Step 2: Wrap the app in `AuthProvider`**

Edit `app/layout.tsx` body:

```tsx
import { AuthProvider } from "@/lib/context/auth-context";
// ...
<body className="bg-background text-foreground antialiased">
  <AuthProvider>{children}</AuthProvider>
</body>
```

- [ ] **Step 3: Account switcher component**

`components/auth/account-switcher.tsx`:

```tsx
"use client";

import { ChevronRight, Settings } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { avatarUrl } from "@/lib/media";

const SAVED_ACCOUNTS = [
  { username: "ana.viajante", seed: "u1" },
  { username: "clockyagenda", seed: "clocky" },
  { username: "dra.alicemoreira", seed: "alice" },
];

export function AccountSwitcher({ onPickAccount }: { onPickAccount: () => void }) {
  const [visible] = useState(SAVED_ACCOUNTS);

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-foreground">Entrar no Instagram</h1>
        <Settings className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        {visible.map((acc) => (
          <button
            key={acc.username}
            onClick={onPickAccount}
            className="flex w-full items-center justify-between rounded-md px-2 py-2 text-left hover:bg-accent"
          >
            <span className="flex items-center gap-3">
              <Image src={avatarUrl(acc.seed)} alt={acc.username} width={36} height={36} className="rounded-full" />
              <span className="text-sm text-foreground">{acc.username}</span>
            </span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        ))}
      </div>
      <button onClick={onPickAccount} className="w-full rounded-full bg-secondary py-2.5 text-sm text-foreground hover:bg-secondary/80">
        Usar outro perfil
      </button>
      <button onClick={onPickAccount} className="w-full rounded-full border border-primary py-2.5 text-sm font-medium text-primary hover:bg-primary/10">
        Criar nova conta
      </button>
    </div>
  );
}
```

- [ ] **Step 4: Login form component**

`components/auth/login-form.tsx`:

```tsx
"use client";

import { ArrowLeft, Facebook } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/context/auth-context";

export function LoginForm({ onBack }: { onBack: () => void }) {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (identifier.trim() && password.trim()) login(identifier);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
      <div className="flex items-center gap-3">
        <button type="button" onClick={onBack} aria-label="Voltar">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <h1 className="text-lg font-semibold text-foreground">Entrar no Instagram</h1>
      </div>
      <input
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
        placeholder="Número de celular, nome de usuário ou email"
        className="w-full rounded-md border border-border bg-transparent px-3 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        placeholder="Senha"
        className="w-full rounded-md border border-border bg-transparent px-3 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
      />
      <button
        type="submit"
        disabled={!identifier.trim() || !password.trim()}
        className="w-full rounded-full bg-primary py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-50"
      >
        Entrar
      </button>
      <p className="text-center text-sm text-primary">Esqueceu a senha?</p>
      <button type="button" className="flex w-full items-center justify-center gap-2 rounded-full bg-secondary py-2.5 text-sm text-foreground hover:bg-secondary/80">
        <Facebook className="h-4 w-4" /> Entrar com o Facebook
      </button>
      <button type="button" className="w-full rounded-full border border-primary py-2.5 text-sm font-medium text-primary hover:bg-primary/10">
        Criar nova conta
      </button>
    </form>
  );
}
```

- [ ] **Step 5: `/login` page composing both**

`app/login/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import { AccountSwitcher } from "@/components/auth/account-switcher";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  const [step, setStep] = useState<"switcher" | "form">("switcher");

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      {step === "switcher" ? (
        <AccountSwitcher onPickAccount={() => setStep("form")} />
      ) : (
        <LoginForm onBack={() => setStep("switcher")} />
      )}
      <p className="fixed bottom-6 text-xs font-semibold text-muted-foreground">∞ Meta</p>
    </main>
  );
}
```

- [ ] **Step 6: Verify**

```bash
npx tsc --noEmit
npm run dev
```

Visit `http://localhost:3000/login`: shows account switcher; clicking any account or "Usar outro perfil" shows the login form; submitting with both fields non-empty navigates to `/` (404 expected until Task 4 exists — confirms `login()` ran and set localStorage).

- [ ] **Step 7: Commit**

```bash
git add app/login app/layout.tsx components/auth lib/context/auth-context.tsx
git commit -m "feat: add simulated auth and /login screen"
```

---

### Task 4: AppShell (desktop sidebar + mobile tab bar) with auth guard

**Files:**
- Create: `app/(app)/layout.tsx`, `app/(app)/page.tsx`, `components/shell/app-shell.tsx`, `components/shell/desktop-sidebar.tsx`, `components/shell/mobile-tab-bar.tsx`, `lib/context/interactions-context.tsx`
- Modify: `app/layout.tsx` (wrap `AuthProvider` children with `InteractionsProvider` too)
- Delete: `app/page.tsx` (superseded by `app/(app)/page.tsx`)

**Interfaces:**
- Consumes: `useAuth()` from Task 3; `mockUsers`, `CURRENT_USER_ID`, `avatarUrl` from Task 2.
- Produces: `InteractionsProvider`, `useInteractions()` returning `{ isLiked(postId): boolean; toggleLike(postId): void; likeCountDelta(postId): number; isFollowing(userId): boolean; toggleFollow(userId): void; }`. `AppShell` component wrapping every authenticated page. Nav item list shape `{ href, label, icon }` reused by both sidebar and tab bar.

- [ ] **Step 1: Interactions context**

`lib/context/interactions-context.tsx`:

```tsx
"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const LIKES_KEY = "ig-clone-likes";
const FOLLOWS_KEY = "ig-clone-follows";

interface InteractionsContextValue {
  isLiked: (postId: string) => boolean;
  toggleLike: (postId: string) => void;
  isFollowing: (userId: string) => boolean;
  toggleFollow: (userId: string) => void;
}

const InteractionsContext = createContext<InteractionsContextValue | null>(null);

function readSet(key: string): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

export function InteractionsProvider({ children }: { children: ReactNode }) {
  const [likes, setLikes] = useState<Set<string>>(new Set());
  const [follows, setFollows] = useState<Set<string>>(new Set());

  useEffect(() => {
    setLikes(readSet(LIKES_KEY));
    setFollows(readSet(FOLLOWS_KEY));
  }, []);

  function toggleLike(postId: string) {
    setLikes((prev) => {
      const next = new Set(prev);
      next.has(postId) ? next.delete(postId) : next.add(postId);
      window.localStorage.setItem(LIKES_KEY, JSON.stringify([...next]));
      return next;
    });
  }

  function toggleFollow(userId: string) {
    setFollows((prev) => {
      const next = new Set(prev);
      next.has(userId) ? next.delete(userId) : next.add(userId);
      window.localStorage.setItem(FOLLOWS_KEY, JSON.stringify([...next]));
      return next;
    });
  }

  return (
    <InteractionsContext.Provider
      value={{
        isLiked: (postId) => likes.has(postId),
        toggleLike,
        isFollowing: (userId) => follows.has(userId),
        toggleFollow,
      }}
    >
      {children}
    </InteractionsContext.Provider>
  );
}

export function useInteractions(): InteractionsContextValue {
  const ctx = useContext(InteractionsContext);
  if (!ctx) throw new Error("useInteractions must be used within InteractionsProvider");
  return ctx;
}
```

- [ ] **Step 2: Register the provider**

Edit `app/layout.tsx`:

```tsx
import { AuthProvider } from "@/lib/context/auth-context";
import { InteractionsProvider } from "@/lib/context/interactions-context";
// ...
<body className="bg-background text-foreground antialiased">
  <AuthProvider>
    <InteractionsProvider>{children}</InteractionsProvider>
  </AuthProvider>
</body>
```

- [ ] **Step 3: Desktop sidebar**

`components/shell/desktop-sidebar.tsx`:

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PlaySquare, MessageCircle, Search, Heart, PlusSquare, User, Menu } from "lucide-react";
import { useState } from "react";
import { MoreMenu } from "./more-menu";
import { MetaMenu } from "./meta-menu";
import { NotificationsPanel } from "./notifications-panel";
import { mockConversations } from "@/lib/mock-data/conversations";
import { CURRENT_USER_ID } from "@/lib/mock-data/users";

const NAV_ITEMS = [
  { href: "/", label: "Página inicial", icon: Home },
  { href: "/reels", label: "Reels", icon: PlaySquare },
  { href: "/direct/inbox", label: "Mensagens", icon: MessageCircle },
  { href: "/explore", label: "Pesquisa", icon: Search },
];

export function DesktopSidebar() {
  const pathname = usePathname();
  const [notifOpen, setNotifOpen] = useState(false);
  const unreadMessages = mockConversations.filter((c) => c.unread).length;

  return (
    <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-border bg-background px-3 py-6 lg:flex">
      <Link href="/" className="mb-8 px-3 text-2xl">
        <span aria-hidden>📷</span>
      </Link>
      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href === "/direct/inbox" && pathname.startsWith("/direct"));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-4 rounded-lg px-3 py-3 text-base hover:bg-accent ${active ? "font-bold" : "font-normal"}`}
            >
              <span className="relative">
                <Icon className="h-6 w-6" />
                {href === "/direct/inbox" && unreadMessages > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                    {unreadMessages}
                  </span>
                )}
              </span>
              {label}
            </Link>
          );
        })}
        <button onClick={() => setNotifOpen(true)} className="flex items-center gap-4 rounded-lg px-3 py-3 text-left text-base hover:bg-accent">
          <Heart className="h-6 w-6" /> Notificações
        </button>
        <button className="flex items-center gap-4 rounded-lg px-3 py-3 text-left text-base hover:bg-accent">
          <PlusSquare className="h-6 w-6" /> Criar
        </button>
        <Link href={`/${CURRENT_USER_ID}`} className="flex items-center gap-4 rounded-lg px-3 py-3 text-base hover:bg-accent">
          <User className="h-6 w-6" /> Perfil
        </Link>
      </nav>
      <div className="flex flex-col gap-1">
        <MoreMenu trigger={
          <button className="flex items-center gap-4 rounded-lg px-3 py-3 text-left text-base hover:bg-accent">
            <Menu className="h-6 w-6" /> Mais
          </button>
        } />
        <MetaMenu />
      </div>
      <NotificationsPanel open={notifOpen} onOpenChange={setNotifOpen} />
    </aside>
  );
}
```

- [ ] **Step 4: Mobile tab bar**

`components/shell/mobile-tab-bar.tsx`:

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PlaySquare, Search, Heart } from "lucide-react";
import Image from "next/image";
import { avatarUrl } from "@/lib/media";
import { CURRENT_USER_ID } from "@/lib/mock-data/users";

const TAB_ITEMS = [
  { href: "/", icon: Home },
  { href: "/reels", icon: PlaySquare },
  { href: "/explore", icon: Search },
];

export function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex h-14 items-center justify-around border-t border-border bg-background lg:hidden">
      {TAB_ITEMS.map(({ href, icon: Icon }) => (
        <Link key={href} href={href} className="flex h-full flex-1 items-center justify-center">
          <Icon className={`h-6 w-6 ${pathname === href ? "text-foreground" : "text-muted-foreground"}`} strokeWidth={pathname === href ? 2.5 : 2} />
        </Link>
      ))}
      <button className="flex h-full flex-1 items-center justify-center text-muted-foreground">
        <Heart className="h-6 w-6" />
      </button>
      <Link href={`/${CURRENT_USER_ID}`} className="flex h-full flex-1 items-center justify-center">
        <Image src={avatarUrl(CURRENT_USER_ID)} alt="Perfil" width={26} height={26} className="rounded-full" />
      </Link>
    </nav>
  );
}
```

- [ ] **Step 5: AppShell composing both + auth guard**

`components/shell/app-shell.tsx`:

```tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/auth-context";
import { DesktopSidebar } from "./desktop-sidebar";
import { MobileTabBar } from "./mobile-tab-bar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace("/login");
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background">
      <DesktopSidebar />
      <main className="pb-14 lg:ml-64 lg:pb-0">{children}</main>
      <MobileTabBar />
    </div>
  );
}
```

(`MoreMenu` and `NotificationsPanel` referenced above are built in Task 5 — create minimal stub versions here so Task 4 compiles standalone, Task 5 fills them in.)

`components/shell/more-menu.tsx` (stub for this task):

```tsx
"use client";

import type { ReactNode } from "react";

export function MoreMenu({ trigger }: { trigger: ReactNode }) {
  return <>{trigger}</>;
}
```

`components/shell/meta-menu.tsx` (stub for this task):

```tsx
export function MetaMenu() {
  return null;
}
```

`components/shell/notifications-panel.tsx` (stub for this task):

```tsx
export function NotificationsPanel(_props: { open: boolean; onOpenChange: (open: boolean) => void }) {
  return null;
}
```

- [ ] **Step 6: Route group layout + move feed page**

`app/(app)/layout.tsx`:

```tsx
import { AppShell } from "@/components/shell/app-shell";

export default function AppGroupLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
```

`app/(app)/page.tsx` (placeholder feed body — Task 6 replaces the inner content):

```tsx
export default function FeedPage() {
  return <div className="mx-auto max-w-xl py-6 text-foreground">Feed em construção</div>;
}
```

- [ ] **Step 7: Delete the temporary root redirect**

```bash
rm app/page.tsx
```

- [ ] **Step 8: Verify**

```bash
npx tsc --noEmit
npm run dev
```

At 1440×900: without a session, visiting `/` redirects to `/login`; logging in (Task 3 form) redirects to `/` and shows the sidebar + "Feed em construção". At 390×844: sidebar is hidden, bottom tab bar visible.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: add AppShell with desktop sidebar, mobile tab bar, and auth guard"
```

---

### Task 5: Notifications panel, More menu, Meta menu

**Files:**
- Modify: `components/shell/notifications-panel.tsx`, `components/shell/more-menu.tsx`, `components/shell/meta-menu.tsx`

**Interfaces:**
- Consumes: `useAuth().logout`, `mockNotifications`, `mockUsers`/`getUser`, `avatarUrl`, `useInteractions().toggleFollow/isFollowing`, shadcn `Sheet`, `DropdownMenu` primitives from Task 1.
- Produces: fully functional overlays used by `DesktopSidebar` (Task 4) unchanged in signature.

- [ ] **Step 1: Notifications panel**

`components/shell/notifications-panel.tsx`:

```tsx
"use client";

import Image from "next/image";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { mockNotifications } from "@/lib/mock-data/notifications";
import { getUser, avatarUrl } from "@/lib/mock-data/users";
import { useInteractions } from "@/lib/context/interactions-context";

const GROUP_LABEL: Record<string, string> = { today: "Hoje", week: "Esta semana", month: "Este mês" };

export function NotificationsPanel({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { isFollowing, toggleFollow } = useInteractions();
  const groups = ["today", "week", "month"] as const;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-full border-border bg-background p-0 sm:w-96">
        <SheetHeader className="border-b border-border px-4 py-4">
          <SheetTitle className="text-foreground">Notificações</SheetTitle>
        </SheetHeader>
        <div className="overflow-y-auto px-4 py-3">
          {groups.map((group) => {
            const items = mockNotifications.filter((n) => n.group === group);
            if (items.length === 0) return null;
            return (
              <div key={group} className="mb-4">
                <h3 className="mb-2 text-sm font-semibold text-foreground">{GROUP_LABEL[group]}</h3>
                <div className="space-y-3">
                  {items.map((n) => {
                    const user = getUser(n.userId);
                    return (
                      <div key={n.id} className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <Image src={avatarUrl(user.id)} alt={user.username} width={40} height={40} className="rounded-full" />
                          <p className="text-sm text-foreground">
                            <span className="font-semibold">{user.username}</span> {n.text}{" "}
                            <span className="text-muted-foreground">{n.timeAgo}</span>
                          </p>
                        </div>
                        {n.actionable === "follow-back" && (
                          <button
                            onClick={() => toggleFollow(user.id)}
                            className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold ${
                              isFollowing(user.id) ? "bg-secondary text-foreground" : "bg-primary text-primary-foreground"
                            }`}
                          >
                            {isFollowing(user.id) ? "Seguindo de volta" : "Seguir de volta"}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
```

- [ ] **Step 2: More menu**

`components/shell/more-menu.tsx`:

```tsx
"use client";

import type { ReactNode } from "react";
import { Settings, Activity, Bookmark, RefreshCw, Flag, Repeat, LogOut } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/context/auth-context";

export function MoreMenu({ trigger }: { trigger: ReactNode }) {
  const { logout } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="end" className="w-64">
        <DropdownMenuItem><Settings className="mr-2 h-4 w-4" /> Configurações</DropdownMenuItem>
        <DropdownMenuItem><Activity className="mr-2 h-4 w-4" /> Sua atividade</DropdownMenuItem>
        <DropdownMenuItem><Bookmark className="mr-2 h-4 w-4" /> Salvos</DropdownMenuItem>
        <DropdownMenuItem><RefreshCw className="mr-2 h-4 w-4" /> Alternar exibição</DropdownMenuItem>
        <DropdownMenuItem><Flag className="mr-2 h-4 w-4" /> Relatar um problema</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem><Repeat className="mr-2 h-4 w-4" /> Trocar de conta</DropdownMenuItem>
        <DropdownMenuItem onClick={logout}><LogOut className="mr-2 h-4 w-4" /> Sair</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

- [ ] **Step 3: Meta menu**

`components/shell/meta-menu.tsx`:

```tsx
"use client";

import { Bot, Grid3x3, MessageSquare, AtSign } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function MetaMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-4 rounded-lg px-3 py-3 text-left text-base text-muted-foreground hover:bg-accent">
          <Grid3x3 className="h-6 w-6" /> Também da Meta
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="end" className="w-56">
        <DropdownMenuItem><Bot className="mr-2 h-4 w-4" /> Meta AI</DropdownMenuItem>
        <DropdownMenuItem><Grid3x3 className="mr-2 h-4 w-4" /> AI Studio</DropdownMenuItem>
        <DropdownMenuItem><MessageSquare className="mr-2 h-4 w-4" /> WhatsApp</DropdownMenuItem>
        <DropdownMenuItem><AtSign className="mr-2 h-4 w-4" /> Threads</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

- [ ] **Step 4: Verify**

```bash
npx tsc --noEmit
npm run dev
```

On `/` (desktop viewport), clicking "Notificações" opens the left sheet with grouped items and working "Seguir de volta" toggle; "Mais" opens the dropdown and "Sair" logs out back to `/login`; "Também da Meta" opens its dropdown.

- [ ] **Step 5: Commit**

```bash
git add components/shell
git commit -m "feat: implement notifications panel, more menu, and meta menu"
```

---

### Task 6: Feed screen (stories bar, post card, suggestions sidebar)

**Files:**
- Create: `components/feed/stories-bar.tsx`, `components/feed/post-card.tsx`, `components/feed/suggestions-sidebar.tsx`
- Modify: `app/(app)/page.tsx`

**Interfaces:**
- Consumes: `mockStories`, `mockPosts`, `mockUsers`, `getUser`, `avatarUrl`, `useInteractions()`.
- Produces: none consumed by later tasks (leaf screen).

- [ ] **Step 1: Stories bar**

`components/feed/stories-bar.tsx`:

```tsx
"use client";

import Image from "next/image";
import { mockStories } from "@/lib/mock-data/stories";
import { getUser, avatarUrl } from "@/lib/mock-data/users";

export function StoriesBar() {
  return (
    <div className="flex gap-4 overflow-x-auto border-b border-border px-4 py-4 lg:px-0">
      {mockStories.map((story) => {
        const user = getUser(story.authorId);
        return (
          <div key={story.id} className="flex w-16 shrink-0 flex-col items-center gap-1">
            <div className={`rounded-full p-[2px] ${story.seen ? "bg-muted" : "bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600"}`}>
              <div className="rounded-full bg-background p-[2px]">
                <Image src={avatarUrl(user.id)} alt={user.username} width={56} height={56} className="rounded-full" />
              </div>
            </div>
            <span className="w-full truncate text-center text-xs text-muted-foreground">{story.label}</span>
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Post card**

`components/feed/post-card.tsx`:

```tsx
"use client";

import Image from "next/image";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from "lucide-react";
import { getUser, avatarUrl } from "@/lib/mock-data/users";
import { useInteractions } from "@/lib/context/interactions-context";
import type { Post } from "@/lib/types";

export function PostCard({ post }: { post: Post }) {
  const author = getUser(post.authorId);
  const { isLiked, toggleLike } = useInteractions();
  const liked = isLiked(post.id);
  const displayedLikes = post.likes + (liked ? 1 : 0);

  return (
    <article className="border-b border-border pb-4">
      <header className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Image src={avatarUrl(author.id)} alt={author.username} width={32} height={32} className="rounded-full" />
          <span className="text-sm font-semibold text-foreground">{author.username}</span>
          <span className="text-xs text-muted-foreground">· {post.timeAgo}</span>
        </div>
        <MoreHorizontal className="h-5 w-5 text-foreground" />
      </header>
      <div className="relative aspect-[4/5] w-full bg-muted">
        <Image src={post.images[0]} alt={post.caption} fill className="object-cover" />
      </div>
      <div className="flex items-center justify-between px-4 pt-3">
        <div className="flex items-center gap-4">
          <button onClick={() => toggleLike(post.id)} aria-label="Curtir">
            <Heart className={`h-6 w-6 ${liked ? "fill-red-500 text-red-500" : "text-foreground"}`} />
          </button>
          <MessageCircle className="h-6 w-6 -scale-x-100 text-foreground" />
          <Send className="h-6 w-6 text-foreground" />
        </div>
        <Bookmark className="h-6 w-6 text-foreground" />
      </div>
      <p className="px-4 pt-2 text-sm font-semibold text-foreground">{displayedLikes.toLocaleString("pt-BR")} curtidas</p>
      <p className="px-4 pt-1 text-sm text-foreground">
        <span className="font-semibold">{author.username}</span> {post.caption}
      </p>
      <p className="px-4 pt-1 text-sm text-muted-foreground">Ver todos os {post.comments} comentários</p>
    </article>
  );
}
```

- [ ] **Step 3: Suggestions sidebar**

`components/feed/suggestions-sidebar.tsx`:

```tsx
"use client";

import Image from "next/image";
import { mockUsers, getUser, avatarUrl, CURRENT_USER_ID } from "@/lib/mock-data/users";
import { useInteractions } from "@/lib/context/interactions-context";

export function SuggestionsSidebar() {
  const currentUser = getUser(CURRENT_USER_ID);
  const suggestions = mockUsers.filter((u) => u.id !== CURRENT_USER_ID).slice(0, 5);
  const { isFollowing, toggleFollow } = useInteractions();

  return (
    <aside className="hidden w-80 shrink-0 px-6 py-8 xl:block">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image src={avatarUrl(currentUser.id)} alt={currentUser.username} width={44} height={44} className="rounded-full" />
          <div>
            <p className="text-sm font-semibold text-foreground">{currentUser.username}</p>
            <p className="text-sm text-muted-foreground">{currentUser.fullName}</p>
          </div>
        </div>
        <button className="text-xs font-semibold text-primary">Trocar</button>
      </div>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-muted-foreground">Sugestões para você</p>
        <button className="text-xs font-semibold text-foreground">Ver tudo</button>
      </div>
      <ul className="space-y-3">
        {suggestions.map((user) => (
          <li key={user.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image src={avatarUrl(user.id)} alt={user.username} width={32} height={32} className="rounded-full" />
              <div>
                <p className="text-sm font-medium text-foreground">{user.username}</p>
                <p className="text-xs text-muted-foreground">Sugestões para você</p>
              </div>
            </div>
            <button onClick={() => toggleFollow(user.id)} className="text-xs font-semibold text-primary">
              {isFollowing(user.id) ? "Seguindo" : "Seguir"}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
```

- [ ] **Step 4: Compose the feed page**

`app/(app)/page.tsx`:

```tsx
import { StoriesBar } from "@/components/feed/stories-bar";
import { PostCard } from "@/components/feed/post-card";
import { SuggestionsSidebar } from "@/components/feed/suggestions-sidebar";
import { mockPosts } from "@/lib/mock-data/posts";

export default function FeedPage() {
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-xl">
        <StoriesBar />
        {mockPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      <SuggestionsSidebar />
    </div>
  );
}
```

- [ ] **Step 5: Verify**

```bash
npx tsc --noEmit
npm run dev
```

At 1440×900: stories bar, feed column, and suggestions sidebar all visible; clicking the heart on a post fills it red and increments the like count; clicking "Seguir" toggles to "Seguindo". At 390×844: suggestions sidebar hidden, feed column full width, stories bar scrolls horizontally.

- [ ] **Step 6: Commit**

```bash
git add components/feed "app/(app)/page.tsx"
git commit -m "feat: implement feed screen with stories, posts, and suggestions"
```

---

### Task 7: Reels screen

**Files:**
- Create: `components/reels/reel-player.tsx`, `app/(app)/reels/page.tsx`

**Interfaces:**
- Consumes: `mockReels`, `getUser`, `avatarUrl`, `useInteractions()`.
- Produces: none (leaf screen).

- [ ] **Step 1: Reel player**

`components/reels/reel-player.tsx`:

```tsx
"use client";

import Image from "next/image";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Volume2 } from "lucide-react";
import { getUser, avatarUrl } from "@/lib/mock-data/users";
import { useInteractions } from "@/lib/context/interactions-context";
import type { Reel } from "@/lib/types";

export function ReelPlayer({ reel }: { reel: Reel }) {
  const author = getUser(reel.authorId);
  const { isLiked, toggleLike, isFollowing, toggleFollow } = useInteractions();
  const liked = isLiked(reel.id);

  return (
    <div className="relative mx-auto flex h-[calc(100vh-56px)] w-full max-w-sm items-center justify-center overflow-hidden rounded-xl bg-black lg:h-[80vh]">
      <Image src={reel.videoThumb} alt={reel.caption} fill className="object-cover" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/70 to-transparent p-4">
        <div className="max-w-[75%] space-y-2">
          <div className="flex items-center gap-2">
            <Image src={avatarUrl(author.id)} alt={author.username} width={28} height={28} className="rounded-full" />
            <span className="text-sm font-semibold text-white">{author.username}</span>
            <button
              onClick={() => toggleFollow(author.id)}
              className="rounded border border-white px-2 py-0.5 text-xs font-semibold text-white"
            >
              {isFollowing(author.id) ? "Seguindo" : "Seguir"}
            </button>
          </div>
          <p className="text-sm text-white">{reel.caption}</p>
        </div>
        <Volume2 className="h-5 w-5 text-white" />
      </div>
      <div className="absolute bottom-20 right-3 flex flex-col items-center gap-5 text-white">
        <button onClick={() => toggleLike(reel.id)} className="flex flex-col items-center gap-1">
          <Heart className={`h-7 w-7 ${liked ? "fill-red-500 text-red-500" : ""}`} />
          <span className="text-xs">{(reel.likes + (liked ? 1 : 0)).toLocaleString("pt-BR")}</span>
        </button>
        <button className="flex flex-col items-center gap-1">
          <MessageCircle className="h-7 w-7" />
          <span className="text-xs">{reel.comments}</span>
        </button>
        <button className="flex flex-col items-center gap-1">
          <Send className="h-7 w-7" />
          <span className="text-xs">{reel.shares}</span>
        </button>
        <Bookmark className="h-6 w-6" />
        <MoreHorizontal className="h-6 w-6" />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Reels page with up/down navigation**

`app/(app)/reels/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { ReelPlayer } from "@/components/reels/reel-player";
import { mockReels } from "@/lib/mock-data/reels";

export default function ReelsPage() {
  const [index, setIndex] = useState(0);

  return (
    <div className="relative flex justify-center py-4">
      <ReelPlayer reel={mockReels[index]} />
      <div className="absolute right-4 top-4 hidden flex-col gap-2 lg:flex">
        <button
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
          className="rounded-full bg-secondary p-2 disabled:opacity-30"
          aria-label="Reel anterior"
        >
          <ChevronUp className="h-5 w-5" />
        </button>
        <button
          onClick={() => setIndex((i) => Math.min(mockReels.length - 1, i + 1))}
          disabled={index === mockReels.length - 1}
          className="rounded-full bg-secondary p-2 disabled:opacity-30"
          aria-label="Próximo reel"
        >
          <ChevronDown className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify**

```bash
npx tsc --noEmit
npm run dev
```

At 1440×900: reel fills a centered vertical frame, up/down arrows visible at top-right and change the displayed reel; like button fills red and count increments; "Seguir" toggles to "Seguindo". At 390×844: reel fills the viewport width, arrows hidden (mobile relies on swipe conceptually — no swipe gesture required for this study clone).

- [ ] **Step 4: Commit**

```bash
git add components/reels "app/(app)/reels"
git commit -m "feat: implement reels screen with playback navigation"
```

---

### Task 8: Explore screen

**Files:**
- Create: `components/explore/explore-grid.tsx`, `app/(app)/explore/page.tsx`

**Interfaces:**
- Consumes: `mockReels`, `mockPosts`, `photoUrl`.
- Produces: none (leaf screen).

- [ ] **Step 1: Explore grid**

`components/explore/explore-grid.tsx`:

```tsx
import Image from "next/image";
import { PlayCircle } from "lucide-react";
import { photoUrl } from "@/lib/media";

interface ExploreTile {
  id: string;
  image: string;
  views?: string;
  overlayText?: string;
}

const TILES: ExploreTile[] = [
  { id: "e1", image: photoUrl("explore-1", 400, 400) },
  { id: "e2", image: photoUrl("explore-2", 400, 400), overlayText: "Cantor compra caminhão e comemora com fãs" },
  { id: "e3", image: photoUrl("explore-3", 400, 400), views: "747 mil" },
  { id: "e4", image: photoUrl("explore-4", 400, 400), views: "971 mil" },
  { id: "e5", image: photoUrl("explore-5", 400, 400), overlayText: "Mais de 12 toneladas caem sobre uma rocha" },
  { id: "e6", image: photoUrl("explore-6", 400, 400), views: "2,2 mi" },
  { id: "e7", image: photoUrl("explore-7", 400, 400), views: "1,1 mi" },
  { id: "e8", image: photoUrl("explore-8", 400, 400) },
  { id: "e9", image: photoUrl("explore-9", 400, 400), views: "198 mil" },
];

export function ExploreGrid() {
  return (
    <div className="grid grid-cols-3 gap-1 lg:grid-cols-4 lg:gap-6">
      {TILES.map((tile) => (
        <div key={tile.id} className="relative aspect-square overflow-hidden bg-muted">
          <Image src={tile.image} alt="" fill className="object-cover" />
          {tile.overlayText && (
            <p className="absolute inset-x-0 bottom-0 bg-black/60 p-1 text-[10px] font-semibold text-white line-clamp-2">
              {tile.overlayText}
            </p>
          )}
          {tile.views && (
            <span className="absolute bottom-1 left-1 flex items-center gap-1 text-[10px] font-semibold text-white drop-shadow">
              <PlayCircle className="h-3 w-3 fill-white text-white" /> {tile.views}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Explore page**

`app/(app)/explore/page.tsx`:

```tsx
import { Search } from "lucide-react";
import { ExploreGrid } from "@/components/explore/explore-grid";

export default function ExplorePage() {
  return (
    <div className="mx-auto max-w-5xl px-2 py-4 lg:px-6">
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          placeholder="Pesquisar"
          className="w-full rounded-md bg-secondary py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
      </div>
      <ExploreGrid />
    </div>
  );
}
```

- [ ] **Step 3: Verify**

```bash
npx tsc --noEmit
npm run dev
```

At 1440×900: 4-column grid with search bar above. At 390×844: 3-column grid, same content, no horizontal scroll.

- [ ] **Step 4: Commit**

```bash
git add components/explore "app/(app)/explore"
git commit -m "feat: implement explore grid screen"
```

---

### Task 9: Messages screen

**Files:**
- Create: `components/messages/conversation-list.tsx`, `components/messages/empty-inbox-state.tsx`, `components/messages/conversation-view.tsx`, `app/(app)/direct/inbox/page.tsx`

**Interfaces:**
- Consumes: `mockConversations`, `getUser`, `avatarUrl`, `CURRENT_USER_ID`.
- Produces: none (leaf screen).

- [ ] **Step 1: Empty inbox state**

`components/messages/empty-inbox-state.tsx`:

```tsx
import { Send } from "lucide-react";

export function EmptyInboxState() {
  return (
    <div className="hidden flex-1 flex-col items-center justify-center gap-4 lg:flex">
      <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-foreground">
        <Send className="h-10 w-10 -rotate-12 text-foreground" />
      </div>
      <p className="text-xl font-semibold text-foreground">Suas mensagens</p>
      <p className="max-w-xs text-center text-sm text-muted-foreground">
        Envie fotos e mensagens privadas para um amigo ou grupo
      </p>
      <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
        Enviar mensagem
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Conversation list**

`components/messages/conversation-list.tsx`:

```tsx
"use client";

import Image from "next/image";
import { getUser, avatarUrl } from "@/lib/mock-data/users";
import type { Conversation } from "@/lib/types";

export function ConversationList({
  conversations,
  activeId,
  onSelect,
}: {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="w-full border-r border-border lg:w-96">
      <div className="flex items-center justify-between px-4 py-4">
        <h2 className="text-lg font-semibold text-foreground">Mensagens</h2>
      </div>
      <ul>
        {conversations.map((c) => {
          const user = getUser(c.userId);
          return (
            <li key={c.id}>
              <button
                onClick={() => onSelect(c.id)}
                className={`flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-accent ${activeId === c.id ? "bg-accent" : ""}`}
              >
                <Image src={avatarUrl(user.id)} alt={user.username} width={48} height={48} className="rounded-full" />
                <span className="min-w-0 flex-1">
                  <p className={`truncate text-sm ${c.unread ? "font-semibold text-foreground" : "text-foreground"}`}>{user.username}</p>
                  <p className="truncate text-xs text-muted-foreground">{c.lastMessage} · {c.timeAgo}</p>
                </span>
                {c.unread && <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
```

- [ ] **Step 3: Conversation view**

`components/messages/conversation-view.tsx`:

```tsx
"use client";

import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { getUser, avatarUrl } from "@/lib/mock-data/users";
import { CURRENT_USER_ID } from "@/lib/mock-data/users";
import type { Conversation } from "@/lib/types";

export function ConversationView({ conversation, onBack }: { conversation: Conversation; onBack: () => void }) {
  const user = getUser(conversation.userId);

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center gap-3 border-b border-border px-4 py-3">
        <button onClick={onBack} className="lg:hidden" aria-label="Voltar">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <Image src={avatarUrl(user.id)} alt={user.username} width={32} height={32} className="rounded-full" />
        <span className="text-sm font-semibold text-foreground">{user.username}</span>
      </header>
      <div className="flex-1 space-y-2 overflow-y-auto p-4">
        {conversation.messages.map((m) => (
          <div key={m.id} className={`flex ${m.fromUserId === CURRENT_USER_ID ? "justify-end" : "justify-start"}`}>
            <span
              className={`max-w-[70%] rounded-2xl px-3 py-2 text-sm ${
                m.fromUserId === CURRENT_USER_ID ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
              }`}
            >
              {m.text}
            </span>
          </div>
        ))}
      </div>
      <div className="border-t border-border p-3">
        <input
          placeholder="Mensagem..."
          className="w-full rounded-full bg-secondary px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Inbox page wiring list + view + empty state**

`app/(app)/direct/inbox/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import { ConversationList } from "@/components/messages/conversation-list";
import { ConversationView } from "@/components/messages/conversation-view";
import { EmptyInboxState } from "@/components/messages/empty-inbox-state";
import { mockConversations } from "@/lib/mock-data/conversations";

export default function InboxPage() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = mockConversations.find((c) => c.id === activeId) ?? null;

  return (
    <div className="flex h-[calc(100vh-56px)] lg:h-screen">
      <div className={active ? "hidden lg:block" : "block w-full lg:block"}>
        <ConversationList conversations={mockConversations} activeId={activeId} onSelect={setActiveId} />
      </div>
      {active ? (
        <ConversationView conversation={active} onBack={() => setActiveId(null)} />
      ) : (
        <EmptyInboxState />
      )}
    </div>
  );
}
```

- [ ] **Step 5: Verify**

```bash
npx tsc --noEmit
npm run dev
```

At 1440×900: two-pane layout, list on the left, empty state on the right until a conversation is clicked, then messages + input show. At 390×844: only the list shows first; tapping a conversation replaces the list with the full-width conversation view; back arrow returns to the list.

- [ ] **Step 6: Commit**

```bash
git add components/messages "app/(app)/direct"
git commit -m "feat: implement messages/inbox screen"
```

---

### Task 10: Profile screen

**Files:**
- Create: `components/profile/profile-header.tsx`, `components/profile/highlights-row.tsx`, `components/profile/profile-tabs.tsx`, `app/(app)/[username]/page.tsx`

**Interfaces:**
- Consumes: `mockUsers`, `getUser`, `avatarUrl`, `photoUrl`, `mockPosts`, `mockReels`, `CURRENT_USER_ID`, `notFound` from `next/navigation`.
- Produces: none (leaf screen).

- [ ] **Step 1: Profile header**

`components/profile/profile-header.tsx`:

```tsx
import Image from "next/image";
import { avatarUrl } from "@/lib/media";
import type { User } from "@/lib/types";

export function ProfileHeader({ user }: { user: User }) {
  return (
    <div className="px-4 py-6 lg:px-0">
      <div className="flex items-center gap-8">
        <Image src={avatarUrl(user.id)} alt={user.username} width={88} height={88} className="rounded-full" />
        <div className="flex flex-1 gap-8 text-center">
          <div>
            <p className="text-lg font-semibold text-foreground">{user.postsCount}</p>
            <p className="text-sm text-muted-foreground">posts</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">{user.followers.toLocaleString("pt-BR")}</p>
            <p className="text-sm text-muted-foreground">seguidores</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">{user.following}</p>
            <p className="text-sm text-muted-foreground">seguindo</p>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm font-semibold text-foreground">{user.fullName}</p>
        <p className="whitespace-pre-line text-sm text-foreground">{user.bio}</p>
      </div>
      <div className="mt-4 flex gap-2">
        <button className="flex-1 rounded-lg bg-secondary py-1.5 text-sm font-semibold text-foreground">Editar</button>
        <button className="flex-1 rounded-lg bg-secondary py-1.5 text-sm font-semibold text-foreground">Compartilhar perfil</button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Highlights row**

`components/profile/highlights-row.tsx`:

```tsx
import Image from "next/image";
import { Plus } from "lucide-react";
import { photoUrl } from "@/lib/media";

const HIGHLIGHTS = [
  { id: "h1", label: "Novo" },
  { id: "h2", label: "❤️" },
  { id: "h3", label: "Família" },
];

export function HighlightsRow() {
  return (
    <div className="flex gap-4 overflow-x-auto px-4 pb-4 lg:px-0">
      <div className="flex w-16 shrink-0 flex-col items-center gap-1">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border">
          <Plus className="h-5 w-5 text-foreground" />
        </div>
        <span className="text-xs text-muted-foreground">Novo</span>
      </div>
      {HIGHLIGHTS.slice(1).map((h) => (
        <div key={h.id} className="flex w-16 shrink-0 flex-col items-center gap-1">
          <div className="h-14 w-14 overflow-hidden rounded-full border border-border">
            <Image src={photoUrl(h.id, 100, 100)} alt={h.label} width={56} height={56} className="h-full w-full object-cover" />
          </div>
          <span className="truncate text-xs text-muted-foreground">{h.label}</span>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Profile tabs (posts / reels / marcados)**

`components/profile/profile-tabs.tsx`:

```tsx
"use client";

import Image from "next/image";
import { Grid3x3, Clapperboard, Bookmark } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Post, Reel } from "@/lib/types";

export function ProfileTabs({ posts, reels }: { posts: Post[]; reels: Reel[] }) {
  return (
    <Tabs defaultValue="posts">
      <TabsList className="w-full justify-center border-t border-border bg-transparent">
        <TabsTrigger value="posts"><Grid3x3 className="h-4 w-4" /></TabsTrigger>
        <TabsTrigger value="reels"><Clapperboard className="h-4 w-4" /></TabsTrigger>
        <TabsTrigger value="saved"><Bookmark className="h-4 w-4" /></TabsTrigger>
      </TabsList>
      <TabsContent value="posts" className="grid grid-cols-3 gap-1">
        {posts.map((post) => (
          <div key={post.id} className="relative aspect-square bg-muted">
            <Image src={post.images[0]} alt={post.caption} fill className="object-cover" />
          </div>
        ))}
      </TabsContent>
      <TabsContent value="reels" className="grid grid-cols-3 gap-1">
        {reels.map((reel) => (
          <div key={reel.id} className="relative aspect-square bg-muted">
            <Image src={reel.videoThumb} alt={reel.caption} fill className="object-cover" />
          </div>
        ))}
      </TabsContent>
      <TabsContent value="saved">
        <p className="py-10 text-center text-sm text-muted-foreground">Nenhum item salvo ainda.</p>
      </TabsContent>
    </Tabs>
  );
}
```

- [ ] **Step 4: Profile page**

`app/(app)/[username]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import { ProfileHeader } from "@/components/profile/profile-header";
import { HighlightsRow } from "@/components/profile/highlights-row";
import { ProfileTabs } from "@/components/profile/profile-tabs";
import { mockUsers } from "@/lib/mock-data/users";
import { mockPosts } from "@/lib/mock-data/posts";
import { mockReels } from "@/lib/mock-data/reels";

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const user = mockUsers.find((u) => u.id === username || u.username === username);
  if (!user) notFound();

  const posts = mockPosts.filter((p) => p.authorId === user.id);
  const reels = mockReels.filter((r) => r.authorId === user.id);

  return (
    <div className="mx-auto max-w-3xl">
      <ProfileHeader user={user} />
      <HighlightsRow />
      <ProfileTabs posts={posts} reels={reels} />
    </div>
  );
}
```

- [ ] **Step 5: Verify**

```bash
npx tsc --noEmit
npm run dev
```

Navigate to the profile via the sidebar/tab-bar "Perfil" icon (routes to `/u1`): header with avatar/stats/bio, highlights row, and tabbed grid all render. Switching tabs shows posts vs. reels grids. At 390×844 the same content stacks full-width with a 3-column grid.

- [ ] **Step 6: Commit**

```bash
git add components/profile "app/(app)/[username]"
git commit -m "feat: implement profile screen with header, highlights, and tabs"
```

---

### Task 11: Final responsive/QA pass and README

**Files:**
- Modify: any component found broken during the pass (see step 1)
- Create: `README.md`

**Interfaces:**
- Consumes: nothing new.
- Produces: nothing new — this task only polishes and documents.

- [ ] **Step 1: Full manual QA pass**

```bash
npm run dev
```

Walk through, at both 1440×900 and 390×844, in this order: `/login` (switcher → form → submit) → `/` (stories scroll, like/follow toggle, notifications sheet, more menu, meta menu, logout) → log back in → `/reels` (navigation arrows, like) → `/explore` (grid columns) → `/direct/inbox` (list → conversation → back) → `/[username]` (tabs). Fix any visual overflow, missing `key` warnings, or console errors found (edit the relevant component file directly; no separate step needed per fix — this is a polish pass, not new features).

- [ ] **Step 2: Full type-check and production build**

```bash
npx tsc --noEmit
npm run build
```

Expected: both complete with 0 errors.

- [ ] **Step 3: Write README**

`README.md`:

```markdown
# Instagram UI Clone (Dark Mode) — Study Project

Réplica de estudo (front-end/UX) da interface do Instagram Web em Next.js + React + TypeScript + Tailwind + shadcn/ui, dark mode, responsiva (desktop/mobile). Projeto educacional, uso privado — sem dados reais de terceiros (avatares e fotos são placeholders gerados por seed).

## Rodando localmente

\`\`\`bash
npm install
npm run dev
\`\`\`

Abra http://localhost:3000 — você será redirecionado para `/login`. Qualquer usuário/senha não vazios entram no app.

## Telas

Login, Feed, Reels, Explorar, Mensagens, Perfil, Notificações, menus "Mais" e "Também da Meta".

## Documentação

- Spec: `docs/superpowers/specs/2026-09-07-instagram-clone-design.md`
- Plano de implementação: `docs/superpowers/plans/2026-09-07-instagram-clone.md`
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: final QA pass and project README"
```

---

## Self-Review Notes

- **Spec coverage:** login (Task 3), feed (Task 6), reels (Task 7), explore (Task 8), messages (Task 9), profile (Task 10), notifications/more/meta overlays (Task 5), dark mode + responsive shell (Tasks 1, 4), simulated auth/interactions state (Tasks 3, 4) — all spec sections have a task.
- **Type consistency:** `useAuth()` shape fixed in Task 3, consumed unchanged in Tasks 4–5. `useInteractions()` shape fixed in Task 4, consumed unchanged in Tasks 5–7, 9. Mock data field names (`authorId`, `userId`, `videoThumb`, etc.) defined once in Task 2 and reused verbatim in Tasks 5–10.
- **No placeholders:** every step ships concrete, complete code; verification steps use real commands.
