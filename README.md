# Instagram UI Clone (Dark Mode) — Study Project

Réplica de estudo (front-end/UX) da interface do Instagram Web, construída com Next.js + React + TypeScript + Tailwind CSS + shadcn/ui, em dark mode e totalmente responsiva (desktop/mobile). Projeto educacional para uso privado — sem dados reais de terceiros (avatares e fotos são placeholders gerados por seed via pravatar.cc/picsum.photos).

## Rodando localmente

```bash
npm install
npm run dev
```

Abra http://localhost:3000 — você será redirecionado para `/login`. Qualquer usuário/senha não vazios entram no app (autenticação simulada via `localStorage`, sem backend real).

## Telas

- `/login` — seletor de contas salvas + formulário de login
- `/` — feed (stories, posts, sugestões)
- `/reels` — player de reels com navegação
- `/explore` — grid de posts/vídeos em destaque
- `/direct/inbox` — mensagens (lista + conversa)
- `/[username]` — perfil (header, destaques, abas de posts/reels)
- Overlays: notificações, menu "Mais", menu "Também da Meta"

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui (Base UI) · lucide-react

## Documentação

- Spec: `docs/superpowers/specs/2026-09-07-instagram-clone-design.md`
- Plano de implementação: `docs/superpowers/plans/2026-09-07-instagram-clone.md`
