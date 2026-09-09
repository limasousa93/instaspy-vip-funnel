"use client";

import { useEffect, useRef, useState } from "react";
import { ReelPlayer } from "@/components/reels/reel-player";
import { ReelsMobileHeader } from "@/components/reels/reels-mobile-header";
import { mockReels } from "@/lib/mock-data/reels";
import type { Reel } from "@/lib/types";

export default function ReelsPage() {
  const feedRef = useRef<HTMLDivElement>(null);
  const [liveReel, setLiveReel] = useState<Reel | null>(null);

  useEffect(() => {
    function setAppVh() {
      document.documentElement.style.setProperty("--app-vh", `${window.innerHeight * 0.01}px`);
    }
    setAppVh();
    window.addEventListener("resize", setAppVh);
    window.visualViewport?.addEventListener("resize", setAppVh);
    return () => {
      window.removeEventListener("resize", setAppVh);
      window.visualViewport?.removeEventListener("resize", setAppVh);
    };
  }, []);

  useEffect(() => {
    const targetId = new URLSearchParams(window.location.search).get("r");
    if (!targetId || mockReels.some((r) => r.id === targetId)) return;
    const username = targetId.slice(0, targetId.indexOf("-"));
    if (!username) return;
    fetch(`/api/instagram/${encodeURIComponent(username)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        const reel = (json?.reels as Reel[] | undefined)?.find((r) => r.id === targetId);
        if (reel) setLiveReel(reel);
      })
      .catch(() => {});
  }, []);

  const reels = liveReel ? [liveReel, ...mockReels] : mockReels;

  useEffect(() => {
    const targetId = new URLSearchParams(window.location.search).get("r");
    if (!targetId || !feedRef.current) return;
    const index = reels.findIndex((r) => r.id === targetId);
    if (index === -1) return;
    feedRef.current.scrollTop = index * feedRef.current.clientHeight;
  }, [reels]);

  return (
    <>
      <ReelsMobileHeader />
      <div ref={feedRef} className="reel-feed no-scrollbar snap-y snap-mandatory overflow-y-scroll bg-black">
        {reels.map((reel) => (
          <section
            key={reel.id}
            className="reel-slide flex snap-start snap-always items-center justify-center overflow-hidden"
          >
            <ReelPlayer reel={reel} />
          </section>
        ))}
      </div>
    </>
  );
}
