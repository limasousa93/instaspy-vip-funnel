import Image from "next/image";
import { Plus } from "lucide-react";
import { photoUrl } from "@/lib/media";

const HIGHLIGHTS = [
  { id: "h2", label: "❤️" },
  { id: "h3", label: "Família" },
];

export function HighlightsRow() {
  return (
    <div className="no-scrollbar momentum-scroll flex gap-4 overflow-x-auto px-4 pb-4 lg:px-0">
      <button className="flex w-16 shrink-0 flex-col items-center gap-1 active:opacity-60">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-border">
          <Plus className="h-5 w-5 text-foreground" />
        </div>
        <span className="text-xs text-foreground">Novo</span>
      </button>
      {HIGHLIGHTS.map((h) => (
        <button key={h.id} className="flex w-16 shrink-0 flex-col items-center gap-1 active:opacity-60">
          <div className="h-16 w-16 overflow-hidden rounded-full border border-border">
            <Image src={photoUrl(h.id, 100, 100)} alt={h.label} width={64} height={64} className="h-full w-full object-cover" />
          </div>
          <span className="truncate text-xs text-foreground">{h.label}</span>
        </button>
      ))}
    </div>
  );
}
