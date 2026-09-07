import Image from "next/image";
import { PlayCircle } from "lucide-react";
import { photoUrl } from "@/lib/media";

interface ExploreTile {
  id: string;
  image: string;
  views?: string;
  overlayText?: string;
}

const TILES: ExploreTile[] = [
  { id: "e1", image: photoUrl("explore-1", 400, 400) },
  { id: "e2", image: photoUrl("explore-2", 400, 400), overlayText: "Cantor compra caminhão e comemora com fãs" },
  { id: "e3", image: photoUrl("explore-3", 400, 400), views: "747 mil" },
  { id: "e4", image: photoUrl("explore-4", 400, 400), views: "971 mil" },
  { id: "e5", image: photoUrl("explore-5", 400, 400), overlayText: "Mais de 12 toneladas caem sobre uma rocha" },
  { id: "e6", image: photoUrl("explore-6", 400, 400), views: "2,2 mi" },
  { id: "e7", image: photoUrl("explore-7", 400, 400), views: "1,1 mi" },
  { id: "e8", image: photoUrl("explore-8", 400, 400) },
  { id: "e9", image: photoUrl("explore-9", 400, 400), views: "198 mil" },
];

export function ExploreGrid() {
  return (
    <div className="grid grid-cols-3 gap-1 lg:grid-cols-4 lg:gap-6">
      {TILES.map((tile) => (
        <div key={tile.id} className="relative aspect-square overflow-hidden bg-muted">
          <Image src={tile.image} alt="" fill sizes="(max-width: 1024px) 33vw, 25vw" className="object-cover" />
          {tile.overlayText && (
            <p className="absolute inset-x-0 bottom-0 line-clamp-2 bg-black/60 p-1 text-[10px] font-semibold text-white">
              {tile.overlayText}
            </p>
          )}
          {tile.views && (
            <span className="absolute bottom-1 left-1 flex items-center gap-1 text-[10px] font-semibold text-white drop-shadow">
              <PlayCircle className="h-3 w-3 fill-white text-white" /> {tile.views}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
