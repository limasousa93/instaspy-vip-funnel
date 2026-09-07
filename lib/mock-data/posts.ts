import { photoUrl } from "@/lib/media";
import type { Post } from "@/lib/types";

export const mockPosts: Post[] = [
  { id: "p1", authorId: "u2", images: [photoUrl("post-1", 600, 750)], caption: "Como eu buscaria R$ 100k com uma oferta hoje, sem entrar nos nichos que todo mundo está brigando.", likes: 664, comments: 326, shares: 8, timeAgo: "1 sem" },
  { id: "p2", authorId: "u6", images: [photoUrl("post-2", 600, 750)], caption: "Belo caso de uso do novo GPT. A melhora da visão computacional é brutal.", likes: 1024, comments: 38, shares: 5, timeAgo: "3 h" },
  { id: "p3", authorId: "u10", images: [photoUrl("post-3", 600, 750), photoUrl("post-3b", 600, 750)], caption: "Por onde anda o mercado criativo em 2026?", likes: 1200, comments: 186, shares: 12, timeAgo: "3 sem" },
  { id: "p4", authorId: "u9", images: [photoUrl("post-4", 600, 750)], caption: "Nova coleção de vestidos de festa chegou 💐", likes: 342, comments: 21, shares: 3, timeAgo: "2 d" },
  { id: "p5", authorId: "u7", images: [photoUrl("post-5", 600, 750)], caption: "Antes e depois de hoje ✨", likes: 890, comments: 64, shares: 9, timeAgo: "5 d" },
];
