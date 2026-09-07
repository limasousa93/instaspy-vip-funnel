# Instagram UI Clone (Dark Mode) — Design Spec

**Status:** Approved
**Purpose:** Réplica de estudo (front-end/UX) da interface do Instagram Web, baseada nas 17 capturas de tela em `imagens referência/`, convertida para dark mode, com versões Desktop e Mobile responsivas. Uso privado, educacional — sem dados reais de terceiros.

## Stack

- Next.js 15 (App Router), React 19, TypeScript
- Tailwind CSS + shadcn/ui + lucide-react
- Sem backend: dados mockados em TS, estado local (Context + `localStorage`)
- Dark mode único (não é toggle — é o tema fixo da aplicação)

## Estratégia de dados/imagens

- Nenhuma foto ou nome real das pessoas nas capturas é reaproduzido.
- Avatares: `https://i.pravatar.cc/150?u=<seed>`. Fotos de posts/reels: `https://picsum.photos/seed/<seed>/<w>/<h>`.
- Usuários, posts, stories, conversas e notificações: dados fictícios em `lib/mock-data/`.

## Rotas (compartilhadas entre desktop e mobile — o layout muda por breakpoint Tailwind, não a URL)

| Rota | Tela | Origem nas referências |
|---|---|---|
| `/login` | Seletor de contas salvas + formulário (usuário/senha) | Capturas 112802, 112815 |
| `/` | Feed: stories bar, posts, sidebar de sugestões (desktop) | Capturas 111357–111438 |
| `/reels` | Player vertical de reels, nav ↑↓, ações laterais | Captura 111505 |
| `/direct/inbox` | Lista de conversas (desktop 2 colunas) / lista mobile | Captura 111523 |
| `/explore` | Grid de posts/vídeos em destaque (desktop e mobile) | Capturas 111537, 111609, 111629, WhatsApp 11.24.29 |
| `/[username]` | Perfil próprio: header, stats, destaques, abas (posts/reels/marcados/tags) | WhatsApp 11.24.30, 11.24.30(1-3), 11.24.31, 11.24.31(1) |

## Overlays (não são rotas — sobrepõem a tela atual)

- **Notificações**: painel lateral (desktop, ancorado à esquerda sob o ícone) / tela cheia (mobile). Abas "Tudo / Pessoas que você segue / Comentários". Ref: captura 111555.
- **Menu "Mais"**: Configurações, Sua atividade, Salvos, Alternar exibição, Relatar um problema, Trocar de conta, Sair. Ref: captura 111609.
- **Menu "Também da Meta"**: Meta AI, AI Studio, WhatsApp, Threads. Ref: captura 111629.

## Arquitetura de componentes

- `AppShell` — casca autenticada; renderiza `DesktopSidebar` (ícones + labels, ≥1024px) ou `MobileTabBar` (bottom bar, <1024px). Contém os overlays (Notificações, Mais, Também da Meta) como popovers/sheets do shadcn.
- `StoriesBar` — avatares com anel gradiente, scroll horizontal.
- `PostCard` — header (avatar/username/verificado/tempo/menu), mídia (imagem/vídeo com carrossel via dots), ações (like/comentar/compartilhar/salvar) com contador otimista, legenda.
- `SuggestionsSidebar` — perfil ativo + "Sugestões para você" com botão Seguir.
- `ReelPlayer` — mídia em destaque, overlay de texto, ações laterais (like/comment/share/save/mais), autor + seguir.
- `ConversationList` / `ConversationView` / `EmptyInboxState`.
- `ExploreGrid` — grid responsivo (3 col mobile, 4 col desktop), contador de views em vídeos.
- `ProfileHeader` + `ProfileStats` + `HighlightsRow` + `ProfileTabs` (grid/reels/repost/marcados).
- `NotificationsPanel`, `MoreMenu`, `MetaMenu` — `DropdownMenu`/`Sheet` do shadcn.
- `AccountSwitcher`, `LoginForm` — telas de `/login`.

## Estado e autenticação (simulados)

- `AuthContext`: lista de "contas salvas" (mock) + conta ativa. Login com **qualquer** usuário/senha não vazios navega para `/`. Estado persiste em `localStorage` (`ig-clone-session`). Rotas fora de `/login` redirecionam para `/login` se não houver sessão.
- `useLikes(postId)` / `useFollow(userId)` — Context + `localStorage`, atualização otimista imediata na UI (coração enche, contador incrementa, botão "Seguir" vira "Seguindo").
- Badges de notificação/mensagens (contadores nos ícones da sidebar) vêm do mock, decrementam ao abrir o respectivo painel/rota.

## Responsividade

- Mobile-first com Tailwind; breakpoint principal `lg:` (1024px) alterna sidebar↔tab bar.
- Grids (`ExploreGrid`, `ProfileTabs` grid): `grid-cols-3` mobile → `grid-cols-4` desktop, `gap-1`/`gap-6` conforme largura.
- Sidebar de sugestões e coluna de mensagens some abaixo de `lg:`; vira acessível só pela rota/overlay equivalente.

## Testing

Sem suíte automatizada nesta fase (projeto de estudo visual). Verificação manual: `npm run dev`, navegar cada rota em viewport desktop (1440px) e mobile (390px), conferir estados de hover/active nos itens interativos e o fluxo login → feed → demais telas.
