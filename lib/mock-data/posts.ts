import { photoUrl } from "@/lib/media";
import type { Post } from "@/lib/types";

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomEngagement() {
  const likes = randomInt(20, 99);
  const comments = randomInt(1, Math.max(1, Math.floor((likes - 1) / 2)));
  const reposts = randomInt(2, 8);
  const shares = randomInt(4, 14);
  return { likes, comments, reposts, shares };
}

const posts: Array<Omit<Post, "likes" | "comments" | "reposts" | "shares">> = [
  { id: "p1", authorId: "u2", images: [photoUrl("post-1", 600, 750)], caption: "Como eu buscaria R$ 100k com uma oferta hoje, sem entrar nos nichos que todo mundo está brigando.", timeAgo: "1 sem" },
  { id: "p2", authorId: "u6", images: [photoUrl("post-2", 600, 750)], caption: "Belo caso de uso do novo GPT. A melhora da visão computacional é brutal.", timeAgo: "3 h" },
  { id: "p3", authorId: "u10", images: [photoUrl("post-3", 600, 750), photoUrl("post-3b", 600, 750)], caption: "Por onde anda o mercado criativo em 2026?", timeAgo: "3 sem" },
  { id: "p4", authorId: "u9", images: [photoUrl("post-4", 600, 750)], caption: "Nova coleção de vestidos de festa chegou 💐", timeAgo: "2 d" },
  { id: "p5", authorId: "u7", images: [photoUrl("post-5", 600, 750)], caption: "Antes e depois de hoje ✨", timeAgo: "5 d" },
  { id: "p6", authorId: "u1", images: [photoUrl("post-6", 600, 750)], caption: "Praia de Jericoacoara 🌊", timeAgo: "3 d" },
  { id: "p7", authorId: "u1", images: [photoUrl("post-7", 600, 750)], caption: "Pôr do sol em Fortaleza 🌅", timeAgo: "1 sem" },
  { id: "p8", authorId: "u1", images: [photoUrl("post-8", 600, 750)], caption: "Trilha na Chapada 🥾", timeAgo: "2 sem" },
];

export const mockPosts: Post[] = posts.map((post) => ({ ...post, ...randomEngagement() }));
