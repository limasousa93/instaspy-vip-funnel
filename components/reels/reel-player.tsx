"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Heart, MessageCircle, Repeat, Send, MoreHorizontal, BadgeCheck, Music2, Play, Volume2, VolumeX } from "lucide-react";
import { BlurredAvatar } from "@/components/ui/blurred-avatar";
import { getUser, avatarUrl } from "@/lib/mock-data/users";
import { useInteractions } from "@/lib/context/interactions-context";
import { useVipModal } from "@/lib/context/vip-modal-context";
import { formatCompactCount, formatCount, maskUsername } from "@/lib/format";
import type { Reel } from "@/lib/types";

export function ReelPlayer({ reel }: { reel: Reel }) {
  const author = getUser(reel.authorId);
  const displayName = reel.displayUsername ?? maskUsername(author.username);
  const followedByUser = reel.followedByUserId ? getUser(reel.followedByUserId) : null;
  const { isLiked, toggleLike, isFollowing, toggleFollow } = useInteractions();
  const { openVipModal } = useVipModal();
  const liked = isLiked(reel.id);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(true);
  const [muted, setMuted] = useState(false);

  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setPaused(false);
    } else {
      video.pause();
      setPaused(true);
    }
  }

  function toggleMute() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  }

  useEffect(() => {
    if (!reel.videoSrc) return;
    const video = videoRef.current;
    const feed = video?.closest<HTMLElement>(".reel-feed");
    if (!video || !feed) return;

    // A scroll listener (not IntersectionObserver) on purpose: IntersectionObserver
    // callbacks are async/coalesced by the browser, so a fast multi-slide swipe can
    // skip the notification for this reel leaving view and only fire once the user
    // has already landed one or more slides further — the video kept playing through
    // the in-between slide. Scroll events fire synchronously on every tick, so this
    // pauses exactly on the swipe that takes the video below half-visible, every time.
    function checkVisibility() {
      const videoRect = video!.getBoundingClientRect();
      const feedRect = feed!.getBoundingClientRect();
      const visibleTop = Math.max(videoRect.top, feedRect.top);
      const visibleBottom = Math.min(videoRect.bottom, feedRect.bottom);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);
      const visibleRatio = videoRect.height > 0 ? visibleHeight / videoRect.height : 0;
      if (visibleRatio < 0.5 && !video!.paused) {
        video!.pause();
        setPaused(true);
      }
    }

    feed.addEventListener("scroll", checkVisibility, { passive: true });
    return () => feed.removeEventListener("scroll", checkVisibility);
  }, [reel.videoSrc]);

  return (
    <div className="relative h-full w-full shrink-0 overflow-hidden bg-black lg:h-[85vh] lg:max-w-sm lg:rounded-xl">
      {reel.videoSrc ? (
        <video
          ref={videoRef}
          src={reel.videoSrc}
          poster={reel.videoThumb}
          preload="metadata"
          loop
          playsInline
          onClick={togglePlay}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <button
          onClick={openVipModal}
          aria-label="Reproduzir"
          className="absolute inset-0 h-full w-full"
        >
          <Image src={reel.videoThumb} alt={reel.caption} fill sizes="(max-width: 1024px) 100vw, 384px" className="object-cover" />
        </button>
      )}

      {reel.videoSrc && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3">
          <button
            onClick={toggleMute}
            aria-label={muted ? "Ativar som" : "Silenciar"}
            className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full bg-black/45 text-white active:opacity-70"
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
          {paused && (
            <button
              onClick={togglePlay}
              aria-label="Reproduzir"
              className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full bg-black/45 text-white active:opacity-70"
            >
              <Play className="h-6 w-6 fill-white" />
            </button>
          )}
        </div>
      )}

      {!reel.videoSrc && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3">
          <button
            onClick={openVipModal}
            aria-label="Ativar som"
            className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full bg-black/45 text-white active:opacity-70"
          >
            <Volume2 className="h-4 w-4" />
          </button>
          <button
            onClick={openVipModal}
            aria-label="Reproduzir"
            className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full bg-black/45 text-white active:opacity-70"
          >
            <Play className="h-6 w-6 fill-white" />
          </button>
        </div>
      )}

      <div className="absolute bottom-32 right-3 flex flex-col items-center gap-5 text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
        <button
          onClick={() => {
            toggleLike(reel.id);
            openVipModal();
          }}
          className="flex flex-col items-center gap-1"
        >
          <Heart className={`h-7 w-7 ${liked ? "fill-red-500 text-red-500" : ""}`} />
          <span className="text-xs font-semibold">{formatCompactCount(reel.likes + (liked ? 1 : 0))}</span>
        </button>
        <button onClick={openVipModal} className="flex flex-col items-center gap-1">
          <MessageCircle className="h-7 w-7 -scale-x-100" />
          <span className="text-xs font-semibold">{formatCount(reel.comments)}</span>
        </button>
        <button onClick={openVipModal} className="flex flex-col items-center gap-1">
          <Repeat className="h-7 w-7" />
          <span className="text-xs font-semibold">{formatCount(reel.reposts)}</span>
        </button>
        <button onClick={openVipModal} className="flex flex-col items-center gap-1">
          <Send className="h-7 w-7" />
          <span className="text-xs font-semibold">{formatCompactCount(reel.shares)}</span>
        </button>
        <button onClick={openVipModal} aria-label="Mais opções">
          <MoreHorizontal className="h-6 w-6" />
        </button>
      </div>

      <div
        className="absolute inset-x-0 bottom-0 space-y-2 p-3 pt-16 text-white"
        style={{ backgroundImage: "linear-gradient(to top, rgba(0,0,0,0.75), rgba(0,0,0,0.35) 60%, transparent)" }}
      >
        <div className="flex items-center gap-2 pr-14">
          <div className="shrink-0 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[2px]">
            <BlurredAvatar src={avatarUrl(author.id)} alt={displayName} size={30} className="ring-2 ring-black" />
          </div>
          <span className="text-sm font-semibold">{displayName}</span>
          {author.verified && <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-blue-500" />}
          <button
            onClick={() => {
              toggleFollow(author.id);
              openVipModal();
            }}
            className="ml-1 shrink-0 rounded-md border border-white px-2.5 py-1 text-xs font-semibold"
          >
            {isFollowing(author.id) ? "Seguindo" : "Seguir"}
          </button>
        </div>
        <div className="flex items-center gap-2 pr-14 text-xs">
          <Music2 className="h-3.5 w-3.5 shrink-0" />
          <Image src={reel.audioThumb} alt="" width={16} height={16} className="rounded-[3px]" />
          <span className="truncate">{reel.audio}</span>
        </div>
        <p className="pr-14 text-sm">{reel.caption}</p>
        {followedByUser && (
          <div className="flex items-center gap-2 pt-1 text-xs text-white/80">
            <BlurredAvatar src={avatarUrl(followedByUser.id)} alt="" size={18} />
            <span>Seguido(a) por {maskUsername(followedByUser.username)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
