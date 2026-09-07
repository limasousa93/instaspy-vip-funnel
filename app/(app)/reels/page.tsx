"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { ReelPlayer } from "@/components/reels/reel-player";
import { mockReels } from "@/lib/mock-data/reels";

export default function ReelsPage() {
  const [index, setIndex] = useState(0);

  return (
    <div className="relative flex justify-center py-4">
      <ReelPlayer reel={mockReels[index]} />
      <div className="absolute right-4 top-4 hidden flex-col gap-2 lg:flex">
        <button
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
          className="rounded-full bg-secondary p-2 disabled:opacity-30"
          aria-label="Reel anterior"
        >
          <ChevronUp className="h-5 w-5" />
        </button>
        <button
          onClick={() => setIndex((i) => Math.min(mockReels.length - 1, i + 1))}
          disabled={index === mockReels.length - 1}
          className="rounded-full bg-secondary p-2 disabled:opacity-30"
          aria-label="Próximo reel"
        >
          <ChevronDown className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
