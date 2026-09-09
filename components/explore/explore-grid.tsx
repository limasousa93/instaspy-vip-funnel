import Image from "next/image";
import { PlayCircle } from "lucide-react";
import { photoUrl } from "@/lib/media";

interface ExploreTile {
  id: string;
  image: string;
  views?: string;
  overlayText?: string;
}

const CAPTIONS = [
  "Motorista flagra caminhão parando no acostamento",
  "Resultado surpreendeu todo mundo",
  "Dica rápida para economizar combustível",
  "Ele não esperava por essa reação",
  "Comemoração que viralizou nas redes",
  "Truque simples que poucos conhecem",
];

const VIEW_COUNTS = [
  "89 mil", "139 mil", "156 mil", "198 mil", "297 mil", "312 mil", "540 mil",
  "678 mil", "747 mil", "971 mil", "1,1 mi", "1,3 mi", "1,9 mi", "2,2 mi", "2,8 mi",
];

const TILE_COUNT = 34;

const TILES: ExploreTile[] = Array.from({ length: TILE_COUNT }, (_, i) => {
  const id = `e${i + 1}`;
  const image = photoUrl(`explore-${i + 1}`, 400, 400);
  switch (i % 5) {
    case 1:
      return { id, image, views: VIEW_COUNTS[i % VIEW_COUNTS.length] };
    case 2:
      return { id, image, overlayText: CAPTIONS[i % CAPTIONS.length] };
    case 3:
      return { id, image, views: VIEW_COUNTS[(i + 3) % VIEW_COUNTS.length], overlayText: CAPTIONS[(i + 2) % CAPTIONS.length] };
    case 4:
      return { id, image, views: VIEW_COUNTS[(i + 7) % VIEW_COUNTS.length] };
    default:
      return { id, image };
  }
});

export function ExploreGrid() {
  return (
    <div className="grid grid-cols-3 gap-1 lg:grid-cols-4 lg:gap-6">
      {TILES.map((tile) => (
        <div key={tile.id} className="relative aspect-square overflow-hidden bg-muted">
          <Image src={tile.image} alt="" fill sizes="(max-width: 1024px) 33vw, 25vw" className="object-cover" />
          {tile.overlayText ? (
            <div className="absolute inset-x-0 bottom-0 space-y-0.5 bg-black/60 p-1">
              {tile.views && (
                <span className="flex items-center gap-1 text-[10px] font-semibold text-white">
                  <PlayCircle className="h-3 w-3 fill-white text-white" /> {tile.views}
                </span>
              )}
              <p className="line-clamp-2 text-[10px] font-semibold text-white">{tile.overlayText}</p>
            </div>
          ) : (
            tile.views && (
              <span className="absolute bottom-1 left-1 flex items-center gap-1 text-[10px] font-semibold text-white drop-shadow">
                <PlayCircle className="h-3 w-3 fill-white text-white" /> {tile.views}
              </span>
            )
          )}
        </div>
      ))}
    </div>
  );
}
