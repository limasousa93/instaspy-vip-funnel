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
        <Image src={post.images[0]} alt={post.caption} fill sizes="(max-width: 640px) 100vw, 576px" className="object-cover" />
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
