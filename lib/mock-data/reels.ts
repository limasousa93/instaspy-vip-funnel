import { photoUrl } from "@/lib/media";
import type { Reel } from "@/lib/types";

export const mockReels: Reel[] = [
  { id: "r1", authorId: "u6", videoThumb: photoUrl("reel-1", 480, 854), caption: "Organização pessoal em menos de 3 minutos", likes: 5252, comments: 223, shares: 88 },
  { id: "r2", authorId: "u10", videoThumb: photoUrl("reel-2", 480, 854), caption: "Passando o meu carro pra frente", likes: 3120, comments: 145, shares: 40 },
  { id: "r3", authorId: "u2", videoThumb: photoUrl("reel-3", 480, 854), caption: "2020 vs 2026: minha stack de ferramentas", likes: 8900, comments: 512, shares: 210 },
  { id: "r4", authorId: "u8", videoThumb: photoUrl("reel-4", 480, 854), caption: "Recuperação tranquila, seguindo em frente", likes: 1220, comments: 88, shares: 15 },
];
