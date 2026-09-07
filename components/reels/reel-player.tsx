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
      <Image src={reel.videoThumb} alt={reel.caption} fill sizes="384px" className="object-cover" />
      <div
        className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 pt-10"
        style={{ backgroundImage: "linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.4), transparent)" }}
      >
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
      <div className="absolute bottom-28 right-3 flex flex-col items-center gap-5 text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
        <button onClick={() => toggleLike(reel.id)} className="flex flex-col items-center gap-1">
          <Heart className={`h-7 w-7 ${liked ? "fill-red-500 text-red-500" : ""}`} />
          <span className="text-xs font-medium">{(reel.likes + (liked ? 1 : 0)).toLocaleString("pt-BR")}</span>
        </button>
        <button className="flex flex-col items-center gap-1">
          <MessageCircle className="h-7 w-7" />
          <span className="text-xs font-medium">{reel.comments}</span>
        </button>
        <button className="flex flex-col items-center gap-1">
          <Send className="h-7 w-7" />
          <span className="text-xs font-medium">{reel.shares}</span>
        </button>
        <Bookmark className="h-6 w-6" />
        <MoreHorizontal className="h-6 w-6" />
      </div>
    </div>
  );
}
