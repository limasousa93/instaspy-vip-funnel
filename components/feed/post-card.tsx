"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, MessageCircle, Repeat, Send, Bookmark, MoreHorizontal, Video, EyeOff } from "lucide-react";
import { BlurredAvatar } from "@/components/ui/blurred-avatar";
import { getUser, avatarUrl } from "@/lib/mock-data/users";
import { useInteractions } from "@/lib/context/interactions-context";
import { formatCompactCount, formatCount, formatTimeAgo, maskUsername } from "@/lib/format";
import type { Post } from "@/lib/types";

export function PostCard({ post }: { post: Post }) {
  const author = getUser(post.authorId);
  const displayName = post.displayUsername ?? maskUsername(author.username);
  const { isLiked, toggleLike } = useInteractions();
  const liked = isLiked(post.id);
  const displayedLikes = post.likes + (liked ? 1 : 0);
  const [showLikeBurst, setShowLikeBurst] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const hidden = Boolean(post.sensitive) && !revealed;

  function handleDoubleTapLike() {
    if (hidden) return;
    if (!liked) toggleLike(post.id);
    setShowLikeBurst(true);
    window.setTimeout(() => setShowLikeBurst(false), 700);
  }

  return (
    <article className="border-b border-border pb-4">
      <header className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <BlurredAvatar src={avatarUrl(author.id)} alt={displayName} size={32} />
          <span className="text-sm font-semibold text-foreground">{displayName}</span>
        </div>
        <button className="active:opacity-40" aria-label="Mais opções">
          <MoreHorizontal className="h-5 w-5 text-foreground" />
        </button>
      </header>
      <div
        className="relative aspect-[4/5] w-full select-none bg-muted"
        onDoubleClick={handleDoubleTapLike}
      >
        <Image
          src={post.images[0]}
          alt={post.caption}
          fill
          sizes="(max-width: 640px) 100vw, 576px"
          className="object-cover"
        />
        {hidden && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <EyeOff className="h-10 w-10 text-white" strokeWidth={1.75} />
            <button
              onClick={(e) => {
                e.stopPropagation();
                setRevealed(true);
              }}
              className="rounded-full border border-white px-6 py-2 text-sm font-semibold text-white active:opacity-70"
            >
              Ver
            </button>
          </div>
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
