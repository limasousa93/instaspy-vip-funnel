import Image from "next/image";
import { Plus } from "lucide-react";
import { photoUrl } from "@/lib/media";

const HIGHLIGHTS = [
  { id: "h2", label: "❤️" },
  { id: "h3", label: "Família" },
];

export function HighlightsRow() {
  return (
    <div className="flex gap-4 overflow-x-auto px-4 pb-4 lg:px-0">
      <div className="flex w-16 shrink-0 flex-col items-center gap-1">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border">
          <Plus className="h-5 w-5 text-foreground" />
        </div>
        <span className="text-xs text-muted-foreground">Novo</span>
      </div>
      {HIGHLIGHTS.map((h) => (
        <div key={h.id} className="flex w-16 shrink-0 flex-col items-center gap-1">
          <div className="h-14 w-14 overflow-hidden rounded-full border border-border">
            <Image src={photoUrl(h.id, 100, 100)} alt={h.label} width={56} height={56} className="h-full w-full object-cover" />
          </div>
          <span className="truncate text-xs text-muted-foreground">{h.label}</span>
        </div>
      ))}
    </div>
  );
}
