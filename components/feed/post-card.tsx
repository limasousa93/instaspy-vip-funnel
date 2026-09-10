"use client";

import Image from "next/image";
import { Heart, MessageCircle, Repeat, Send, Bookmark, MoreHorizontal, Video, EyeOff } from "lucide-react";
import { BlurredAvatar } from "@/components/ui/blurred-avatar";
import { getUser, avatarUrl } from "@/lib/mock-data/users";
import { useInteractions } from "@/lib/context/interactions-context";
import { useVipModal } from "@/lib/context/vip-modal-context";
import { formatCompactCount, formatCount, formatTimeAgo, maskUsername } from "@/lib/format";
import type { Post } from "@/lib/types";

export function PostCard({ post }: { post: Post }) {
  const author = getUser(post.authorId);
  const displayName = post.displayUsername ?? maskUsername(author.username);
  const { isLiked, toggleLike } = useInteractions();
  const { openVipModal } = useVipModal();
  const liked = isLiked(post.id);
  const displayedLikes = post.likes + (liked ? 1 : 0);
  const sensitive = Boolean(post.sensitive);
  const hidden = sensitive;

  return (
    <article className="border-b border-border pb-4">
      <header className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <BlurredAvatar src={avatarUrl(author.id)} alt={displayName} size={32} />
          <span className="text-sm font-semibold text-foreground">{displayName}</span>
        </div>
        <button onClick={openVipModal} className="active:opacity-40" aria-label="Mais opções">
          <MoreHorizontal className="h-5 w-5 text-foreground" />
        </button>
      </header>
      <div
        className="relative aspect-[4/5] w-full select-none bg-muted"
        onDoubleClick={openVipModal}
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
                openVipModal();
              }}
              className="rounded-full border border-white px-6 py-2 text-sm font-semibold text-white active:opacity-70"
            >
              Ver
            </button>
          </div>
        )}
        {post.showUnlockButton && (
          <button className="absolute inset-x-[6%] top-[62%] rounded-lg bg-green-500 py-2.5 text-sm font-bold text-white shadow-lg active:opacity-80">
            DESBLOQUEAR
          </button>
        )}
      </div>
      <div className="flex items-center justify-between px-4 pt-3">
        <div className="flex items-center gap-4">
          <button onClick={() => toggleLike(post.id)} aria-label="Curtir" className="flex items-center gap-1.5 active:scale-90 transition-transform">
            <Heart className={`h-6 w-6 transition-transform ${liked ? "scale-110 fill-red-500 text-red-500" : "text-foreground"}`} />
            <span className="text-sm text-foreground">{formatCompactCount(displayedLikes)}</span>
          </button>
          <button onClick={openVipModal} aria-label="Comentar" className="flex items-center gap-1.5 active:scale-90 transition-transform">
            <MessageCircle className="h-6 w-6 -scale-x-100 text-foreground" />
            <span className="text-sm text-foreground">{formatCount(post.comments)}</span>
          </button>
          <button onClick={openVipModal} aria-label="Repostar" className="flex items-center gap-1.5 active:scale-90 transition-transform">
            <Repeat className="h-6 w-6 text-foreground" />
            <span className="text-sm text-foreground">{formatCount(post.reposts)}</span>
          </button>
          <button onClick={openVipModal} aria-label="Compartilhar" className="flex items-center gap-1.5 active:scale-90 transition-transform">
            <Send className="h-6 w-6 text-foreground" />
            <span className="text-sm text-foreground">{formatCount(post.shares)}</span>
          </button>
        </div>
        <button onClick={openVipModal} aria-label="Salvar" className="active:scale-90 transition-transform">
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
