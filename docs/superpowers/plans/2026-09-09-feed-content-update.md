# Feed Content Update Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update usernames, avatars, post media and captions for 6 profiles on the `/feed` route, and extend `PostCard` to support per-post display-name overrides, inline video posts, and swipeable image carousels.

**Architecture:** All feed content is static mock data in `lib/mock-data/*.ts`, typed by `lib/types.ts`, rendered by `components/feed/post-card.tsx`. We extend the `Post` type with two optional fields (`videoSrc`, `displayUsername`), rename four shared `User` records (their username is the single source of truth, consumed everywhere via `getUser`), and teach `PostCard` to render three post shapes: static image (existing), inline video (new, styled like `components/reels/reel-player.tsx`), and multi-image carousel (new, snap-scroll + dot indicators).

**Tech Stack:** Next.js 16 / React 19 / TypeScript, Tailwind v4. No test runner in this repo (`npm run lint`, `tsc --noEmit`, and `npm run build` are the available checks); verification also includes a visual pass on the running dev server.

**Spec:** This plan's spec is the task list from conversation (7 numbered edits to `/feed`), reproduced per-task below. No separate spec doc exists.

## Global Constraints

- Scope is the `/feed` route only — do not touch `/profile`, `/reels`, `/messages`, etc. (their own mock-data references to the same shared users update automatically via `getUser`, which is expected and fine — no direct edits needed there).
- 4 of the 7 requested media assets (a 3-image sequence and 3 video URLs) were confirmed to be sexual/adult content scraped from third parties and cannot be used. Per user decision, those 4 posts get a neutral placeholder image (`photoUrl` seed, same mechanism already used for every other mock post) instead, until the user supplies real media. Mark each with a one-line comment so it's obvious later which posts are still waiting on real media.
- Every username rename must propagate to every hardcoded string occurrence of that username in `lib/mock-data/` (not just the `User.username` field) — verified occurrences: `reels.ts` audio credit strings, `notifications.ts` reply/action strings.
- `ana.viajante` (`u1`, the app's own/current user — `CURRENT_USER_ID`) is NOT renamed globally. Two of its three feed posts get a post-level `displayUsername` override instead, so the rest of the app (profile page, stories, own avatar) is unaffected.

---

## File Structure

- Modify `lib/types.ts` — add `Post.videoSrc?: string` and `Post.displayUsername?: string`.
- Modify `lib/media.ts` — add one `AVATAR_OVERRIDES` entry.
- Modify `lib/mock-data/users.ts` — rename 4 usernames.
- Modify `lib/mock-data/reels.ts` — propagate 1 rename into an audio-credit string.
- Modify `lib/mock-data/notifications.ts` — propagate 1 rename into a reply string.
- Modify `lib/mock-data/posts.ts` — update media/captions/overrides for posts p1–p7.
- Modify `components/feed/post-card.tsx` — render video posts, carousel posts, and `displayUsername`.

---

### Task 1: Extend `Post` type and add the avatar override

**Files:**
- Modify: `lib/types.ts:15-26`
- Modify: `lib/media.ts:1-3`

**Interfaces:**
- Produces: `Post.videoSrc?: string` (when set, `PostCard` renders a `<video>` instead of the image/carousel, using `images[0]` as the poster).
- Produces: `Post.displayUsername?: string` (when set, `PostCard` shows this instead of `getUser(post.authorId).username` in both the header and the caption line).

- [ ] **Step 1: Add the two optional fields to `Post`**

In `lib/types.ts`, change:

```ts
export interface Post {
  id: string;
  authorId: string;
  images: string[];
  caption: string;
  likes: number;
  comments: number;
  reposts: number;
  shares: number;
  timeAgo: string;
  credit?: string;
}
```

to:

```ts
export interface Post {
  id: string;
  authorId: string;
  images: string[];
  caption: string;
  likes: number;
  comments: number;
  reposts: number;
  shares: number;
  timeAgo: string;
  credit?: string;
  videoSrc?: string;
  displayUsername?: string;
}
```

- [ ] **Step 2: Add the `itsrealllysky` avatar override**

In `lib/media.ts`, change:

```ts
const AVATAR_OVERRIDES: Record<string, string> = {
  u6: "/olivia-avatar.png.png",
};
```

to:

```ts
const AVATAR_OVERRIDES: Record<string, string> = {
  u2: "/11.png",
  u6: "/olivia-avatar.png.png",
};
```

- [ ] **Step 3: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add lib/types.ts lib/media.ts
git commit -m "feat(feed): add video/displayUsername post fields and itsrealllysky avatar override"
```

---

### Task 2: Rename the four profiles and propagate hardcoded references

**Files:**
- Modify: `lib/mock-data/users.ts:7-18`
- Modify: `lib/mock-data/reels.ts:40`
- Modify: `lib/mock-data/notifications.ts:57,62`

**Interfaces:**
- Consumes: nothing new.
- Produces: `mockUsers` entries for `u2`, `u7`, `u9`, `u10` now carry the new `username` values that `getUser("u2"|"u7"|"u9"|"u10").username` returns everywhere in the app (feed, profile, messages, reels, notifications all read live from this array).

- [ ] **Step 1: Rename in `users.ts`**

In `lib/mock-data/users.ts`, change these four lines (keep every other field as-is):

```ts
  { id: "u2", username: "marcos.criativo", fullName: "Marcos Lima", bio: "Design & criatividade", verified: true, followers: 8420, following: 312, postsCount: 143 },
```
→
```ts
  { id: "u2", username: "itsrealllysky", fullName: "Marcos Lima", bio: "Design & criatividade", verified: true, followers: 8420, following: 312, postsCount: 143 },
```

```ts
  { id: "u7", username: "isabela.beauty", fullName: "Isabela Ferreira", bio: "Maquiadora profissional", verified: false, followers: 4300, following: 610, postsCount: 210 },
```
→
```ts
  { id: "u7", username: "isabela", fullName: "Isabela Ferreira", bio: "Maquiadora profissional", verified: false, followers: 4300, following: 610, postsCount: 210 },
```

```ts
  { id: "u9", username: "clara.eventos", fullName: "Clara Mendes", bio: "Vestidos de noiva e festas", verified: false, followers: 7800, following: 120, postsCount: 421 },
```
→
```ts
  { id: "u9", username: "suzy", fullName: "Clara Mendes", bio: "Vestidos de noiva e festas", verified: false, followers: 7800, following: 120, postsCount: 421 },
```

```ts
  { id: "u10", username: "diego.arte", fullName: "Diego Brito", bio: "Ilustrador digital", verified: false, followers: 990, following: 450, postsCount: 64 },
```
→
```ts
  { id: "u10", username: "diego", fullName: "Diego Brito", bio: "Ilustrador digital", verified: false, followers: 990, following: 450, postsCount: 64 },
```

- [ ] **Step 2: Propagate into `reels.ts`**

In `lib/mock-data/reels.ts:40`, change:

```ts
    audio: "Áudio original · marcos.criativo",
```
to:
```ts
    audio: "Áudio original · itsrealllysky",
```

- [ ] **Step 3: Propagate into `notifications.ts`**

In `lib/mock-data/notifications.ts:57` and `:62`, change:

```ts
    action: "respondeu ao seu comentário no post de marcos.criativo:",
    timeAgo: "3 d",
    group: "Últimos 7 dias",
    thumbnail: photoUrl("notif-reply", 200, 200),
    ring: true,
    reply: { toUsername: "marcos.criativo", quote: "Consegui aplicar isso hoje mesmo, obrigado! 🙏" },
```
to:
```ts
    action: "respondeu ao seu comentário no post de itsrealllysky:",
    timeAgo: "3 d",
    group: "Últimos 7 dias",
    thumbnail: photoUrl("notif-reply", 200, 200),
    ring: true,
    reply: { toUsername: "itsrealllysky", quote: "Consegui aplicar isso hoje mesmo, obrigado! 🙏" },
```

- [ ] **Step 4: Verify no old usernames remain**

Run: `grep -rn "marcos.criativo\|isabela.beauty\|clara.eventos\|diego.arte" lib/`
Expected: no output (empty).

- [ ] **Step 5: Commit**

```bash
git add lib/mock-data/users.ts lib/mock-data/reels.ts lib/mock-data/notifications.ts
git commit -m "feat(feed): rename itsrealllysky, isabela, suzy and diego profiles"
```

---

### Task 3: Update post media and captions in `posts.ts`

**Files:**
- Modify: `lib/mock-data/posts.ts:17-24`

**Interfaces:**
- Consumes: `Post.videoSrc` / `Post.displayUsername` from Task 1.
- Produces: final `mockPosts` data `PostCard` (Task 4) renders.

- [ ] **Step 1: Replace the `posts` array entries for p1–p7**

In `lib/mock-data/posts.ts`, replace lines 17-24 with:

```ts
  { id: "p1", authorId: "u2", images: [photoUrl("itsrealllysky-post", 600, 750)], caption: "🥰😍", timeAgo: "1 sem" }, // placeholder — vídeo real do usuário pendente
  { id: "p2", authorId: "u6", images: ["/foto%20olivia.69.png"], caption: "Dia lindo", timeAgo: "3 h" },
  { id: "p3", authorId: "u10", images: ["/diegoxx.jpg"], caption: "dia abençoado", timeAgo: "3 sem" },
  { id: "p4", authorId: "u9", images: [photoUrl("suzy-1", 600, 750), photoUrl("suzy-2", 600, 750), photoUrl("suzy-3", 600, 750)], caption: "Nova coleção de vestidos de festa chegou 💐", timeAgo: "2 d" }, // placeholder carrossel — imagens reais pendentes
  { id: "p5", authorId: "u7", images: [photoUrl("isabela-post", 600, 750)], caption: "Antes e depois de hoje ✨", timeAgo: "5 d" }, // placeholder — vídeo real do usuário pendente
  { id: "p6", authorId: "u1", displayUsername: "anye", images: ["/12.png"], caption: "Otimo dia para vcs", timeAgo: "3 d" },
  { id: "p7", authorId: "u1", displayUsername: "jef", images: [photoUrl("jef-post", 600, 750)], caption: "paz", timeAgo: "1 sem" }, // placeholder — vídeo real do usuário pendente
  { id: "p8", authorId: "u1", images: [photoUrl("post-8", 600, 750)], caption: "Trilha na Chapada 🥾", timeAgo: "2 sem" },
```

Note `p3` intentionally drops the old second carousel image (`post-3b`) — the user asked for a single replacement image, not a carousel, for Diego's post.

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/mock-data/posts.ts
git commit -m "feat(feed): update post media, captions and display-name overrides"
```

---

### Task 4: Teach `PostCard` to render video posts, carousels, and `displayUsername`

**Files:**
- Modify: `components/feed/post-card.tsx`

**Interfaces:**
- Consumes: `Post.videoSrc`, `Post.displayUsername` (Task 1), the `no-scrollbar` / `momentum-scroll` utility classes already defined in `app/globals.css` (used identically by `components/profile/highlights-row.tsx` etc.), the video-tag pattern from `components/reels/reel-player.tsx:70-80`.
- Produces: no new exports — same `PostCard({ post }: { post: Post })` signature.

- [ ] **Step 1: Replace the full file**

Replace `components/feed/post-card.tsx` with:

```tsx
"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Heart, MessageCircle, Repeat, Send, Bookmark, MoreHorizontal, Video, Play, Volume2, VolumeX } from "lucide-react";
import { getUser, avatarUrl } from "@/lib/mock-data/users";
import { useInteractions } from "@/lib/context/interactions-context";
import { formatCompactCount, formatCount, formatTimeAgo } from "@/lib/format";
import type { Post } from "@/lib/types";

export function PostCard({ post }: { post: Post }) {
  const author = getUser(post.authorId);
  const displayName = post.displayUsername ?? author.username;
  const { isLiked, toggleLike } = useInteractions();
  const liked = isLiked(post.id);
  const displayedLikes = post.likes + (liked ? 1 : 0);
  const [showLikeBurst, setShowLikeBurst] = useState(false);
  const [slide, setSlide] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoPaused, setVideoPaused] = useState(true);
  const [videoMuted, setVideoMuted] = useState(true);

  function handleDoubleTapLike() {
    if (!liked) toggleLike(post.id);
    setShowLikeBurst(true);
    window.setTimeout(() => setShowLikeBurst(false), 700);
  }

  function handleTrackScroll() {
    const track = trackRef.current;
    if (!track || track.clientWidth === 0) return;
    setSlide(Math.round(track.scrollLeft / track.clientWidth));
  }

  function toggleVideoPlay() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setVideoPaused(false);
    } else {
      video.pause();
      setVideoPaused(true);
    }
  }

  function toggleVideoMute() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setVideoMuted(video.muted);
  }

  return (
    <article className="border-b border-border pb-4">
      <header className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Image src={avatarUrl(author.id)} alt={displayName} width={32} height={32} className="h-[32px] w-[32px] rounded-full object-cover" />
          <span className="text-sm font-semibold text-foreground">{displayName}</span>
        </div>
        <button className="active:opacity-40" aria-label="Mais opções">
          <MoreHorizontal className="h-5 w-5 text-foreground" />
        </button>
      </header>
      <div className="relative aspect-[4/5] w-full select-none bg-muted" onDoubleClick={handleDoubleTapLike}>
        {post.videoSrc ? (
          <>
            <video
              ref={videoRef}
              src={post.videoSrc}
              poster={post.images[0]}
              preload="metadata"
              loop
              muted={videoMuted}
              playsInline
              onClick={toggleVideoPlay}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <button
              onClick={toggleVideoMute}
              aria-label={videoMuted ? "Ativar som" : "Silenciar"}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/45 text-white active:opacity-70"
            >
              {videoMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
            {videoPaused && (
              <button
                onClick={toggleVideoPlay}
                aria-label="Reproduzir"
                className="pointer-events-none absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white"
              >
                <Play className="h-6 w-6 fill-white" />
              </button>
            )}
          </>
        ) : post.images.length > 1 ? (
          <>
            <div
              ref={trackRef}
              onScroll={handleTrackScroll}
              className="no-scrollbar momentum-scroll flex h-full w-full snap-x snap-mandatory overflow-x-auto"
            >
              {post.images.map((src, index) => (
                <div key={`${post.id}-${index}`} className="relative h-full w-full shrink-0 snap-center">
                  <Image src={src} alt={post.caption} fill sizes="(max-width: 640px) 100vw, 576px" className="object-cover" priority={index === 0} />
                </div>
              ))}
            </div>
            <div className="pointer-events-none absolute right-3 top-3 rounded-full bg-black/45 px-2 py-0.5 text-xs font-medium text-white">
              {slide + 1}/{post.images.length}
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
              {post.images.map((_, index) => (
                <span key={`${post.id}-dot-${index}`} className={`h-1.5 w-1.5 rounded-full ${index === slide ? "bg-blue-500" : "bg-white/60"}`} />
              ))}
            </div>
          </>
        ) : (
          <Image src={post.images[0]} alt={post.caption} fill sizes="(max-width: 640px) 100vw, 576px" className="object-cover" />
        )}
        <Heart
          className={`pointer-events-none absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 fill-white text-white drop-shadow-lg transition-all duration-300 ${
            showLikeBurst ? "scale-100 opacity-90" : "scale-50 opacity-0"
          }`}
        />
      </div>
      <div className="flex items-center justify-between px-4 pt-3">
        <div className="flex items-center gap-4">
          <button onClick={() => toggleLike(post.id)} aria-label="Curtir" className="flex items-center gap-1.5 active:scale-90 transition-transform">
            <Heart className={`h-6 w-6 transition-transform ${liked ? "scale-110 fill-red-500 text-red-500" : "text-foreground"}`} />
            <span className="text-sm text-foreground">{formatCompactCount(displayedLikes)}</span>
          </button>
          <button aria-label="Comentar" className="flex items-center gap-1.5 active:scale-90 transition-transform">
            <MessageCircle className="h-6 w-6 -scale-x-100 text-foreground" />
            <span className="text-sm text-foreground">{formatCount(post.comments)}</span>
          </button>
          <button aria-label="Repostar" className="flex items-center gap-1.5 active:scale-90 transition-transform">
            <Repeat className="h-6 w-6 text-foreground" />
            <span className="text-sm text-foreground">{formatCount(post.reposts)}</span>
          </button>
          <button aria-label="Compartilhar" className="flex items-center gap-1.5 active:scale-90 transition-transform">
            <Send className="h-6 w-6 text-foreground" />
            <span className="text-sm text-foreground">{formatCount(post.shares)}</span>
          </button>
        </div>
        <button aria-label="Salvar" className="active:scale-90 transition-transform">
          <Bookmark className="h-6 w-6 text-foreground" />
        </button>
      </div>
      <p className="px-4 pt-2 text-sm text-foreground">
        <span className="font-semibold">{displayName}</span> {post.caption}
      </p>
      {post.credit && (
        <p className="flex items-center gap-1.5 px-4 pt-1 text-sm text-muted-foreground">
          <Video className="h-4 w-4 shrink-0" />
          <span className="text-blue-500">{post.credit}</span>
        </p>
      )}
      <p className="px-4 pt-1.5 text-xs text-muted-foreground">{formatTimeAgo(post.timeAgo)}</p>
    </article>
  );
}
```

- [ ] **Step 2: Verify it compiles and lints**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/feed/post-card.tsx
git commit -m "feat(feed): render video posts, image carousels and per-post display names"
```

---

### Task 5: Visual verification on the running app

**Files:** none (verification only).

- [ ] **Step 1: Start the dev server**

Run: `npm run dev` (background)

- [ ] **Step 2: Load `/feed` in a browser and screenshot it**

Use the Playwright MCP tools: navigate to `http://localhost:3000/feed`, take a full-page screenshot.
Expected, top to bottom: `itsrealllysky` header + avatar from `/11.png`, caption `🥰😍`; `olivia.69` post using `/foto olivia.69.png`, caption `Dia lindo`; `diego` post using `/diegoxx.jpg`, caption `dia abençoado`; `suzy` post as a 3-dot swipeable carousel, original vestidos caption; `isabela` post, caption `Antes e depois de hoje ✨`; `anye` post using `/12.png`, caption `Otimo dia para vcs`; `jef` post, caption `paz`; then the untouched `ana.viajante` "Trilha na Chapada" post.

- [ ] **Step 3: Swipe/scroll the carousel post and confirm the dot indicator and `2/3` badge update**

Use `browser_evaluate` or a manual drag on the carousel track; re-screenshot; confirm the active dot and counter move.

- [ ] **Step 4: Confirm no leftover old usernames anywhere in the app**

Run: `grep -rn "marcos.criativo\|isabela.beauty\|clara.eventos\|diego.arte" app/ components/ lib/`
Expected: no output.

- [ ] **Step 5: Full production build**

Run: `npm run build`
Expected: build succeeds with no type or lint errors.
