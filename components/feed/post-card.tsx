"use client";

import { useState } from "react";
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
  const [showLikeBurst, setShowLikeBurst] = useState(false);

  function handleDoubleTapLike() {
    if (!liked) toggleLike(post.id);
    setShowLikeBurst(true);
    window.setTimeout(() => setShowLikeBurst(false), 700);
  }

  return (
    <article className="border-b border-border pb-4">
      <header className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Image src={avatarUrl(author.id)} alt={author.username} width={32} height={32} className="rounded-full" />
          <span className="text-sm font-semibold text-foreground">{author.username}</span>
          <span className="text-xs text-muted-foreground">· {post.timeAgo}</span>
        </div>
        <button className="active:opacity-40" aria-label="Mais opções">
          <MoreHorizontal className="h-5 w-5 text-foreground" />
        </button>
      </header>
      <div
        className="relative aspect-[4/5] w-full select-none bg-muted"
        onDoubleClick={handleDoubleTapLike}
      >
        <Image src={post.images[0]} alt={post.caption} fill sizes="(max-width: 640px) 100vw, 576px" className="object-cover" />
        <Heart
          className={`pointer-events-none absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 fill-white text-white drop-shadow-lg transition-all duration-300 ${
            showLikeBurst ? "scale-100 opacity-90" : "scale-50 opacity-0"
          }`}
        />
      </div>
      <div className="flex items-center justify-between px-4 pt-3">
        <div className="flex items-center gap-4">
          <button onClick={() => toggleLike(post.id)} aria-label="Curtir" className="active:scale-90 transition-transform">
            <Heart className={`h-6 w-6 transition-transform ${liked ? "scale-110 fill-red-500 text-red-500" : "text-foreground"}`} />
          </button>
          <button aria-label="Comentar" className="active:scale-90 transition-transform">
            <MessageCircle className="h-6 w-6 -scale-x-100 text-foreground" />
          </button>
          <button aria-label="Compartilhar" className="active:scale-90 transition-transform">
            <Send className="h-6 w-6 text-foreground" />
          </button>
        </div>
        <button aria-label="Salvar" className="active:scale-90 transition-transform">
          <Bookmark className="h-6 w-6 text-foreground" />
        </button>
      </div>
      <p className="px-4 pt-2 text-sm font-semibold text-foreground">{displayedLikes.toLocaleString("pt-BR")} curtidas</p>
      <p className="px-4 pt-1 text-sm text-foreground">
        <span className="font-semibold">{author.username}</span> {post.caption}
      </p>
      <p className="px-4 pt-1 text-sm text-muted-foreground">Ver todos os {post.comments} comentários</p>
    </article>
  );
}
