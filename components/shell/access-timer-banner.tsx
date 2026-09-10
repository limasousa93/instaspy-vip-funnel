"use client";

import { useEffect, useState } from "react";
import { useVipModal } from "@/lib/context/vip-modal-context";

const START_SECONDS = 10 * 60;

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function AccessTimerBanner() {
  const { openVipModal } = useVipModal();
  const [secondsLeft, setSecondsLeft] = useState(START_SECONDS);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setSecondsLeft((prev) => (prev <= 1 ? START_SECONDS : prev - 1));
    }, 1000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <button
      onClick={openVipModal}
      className="fixed inset-x-0 bottom-[calc(3.5rem+env(safe-area-inset-bottom))] z-40 flex h-9 w-full items-center justify-center text-sm font-semibold text-white active:opacity-90 lg:hidden"
      style={{ backgroundImage: "linear-gradient(45deg, #f58529, #dd2a7b, #8134af)" }}
    >
      Acesso liberado por {formatTime(secondsLeft)}
    </button>
  );
}
