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
  { id: "p1", authorId: "u2", displayUsername: "alic******", images: ["/feed1.png"], caption: "Quem curtir vai ganhar um presente 💋🍎​", timeAgo: "1 sem", sensitive: true },
  { id: "p2", authorId: "u6", images: ["/feed2.png"], caption: "Hoje tem live ao vivo comigo meus amores. aguardem. 💋​💦​💃​", timeAgo: "3 h", sensitive: true },
  { id: "p3", authorId: "u10", displayUsername: "jef_******", images: ["/feed3.png"], caption: "Isso tudo pra vc brincarem bastante. ​💋🔥🔥", timeAgo: "3 sem", sensitive: true },
  { id: "p4", authorId: "u9", displayUsername: "bel*********", images: ["/feed4.png"], caption: "Aceitam esse carinho ? 🍆​🍆​", timeAgo: "2 d", sensitive: true },
  { id: "p5", authorId: "u7", images: [photoUrl("post-5", 600, 750)], caption: "Antes e depois de hoje ✨", timeAgo: "5 d" },
  { id: "p6", authorId: "u1", images: [photoUrl("post-6", 600, 750)], caption: "Praia de Jericoacoara 🌊", timeAgo: "3 d" },
  { id: "p7", authorId: "u1", images: [photoUrl("post-7", 600, 750)], caption: "Pôr do sol em Fortaleza 🌅", timeAgo: "1 sem" },
  { id: "p8", authorId: "u1", images: [photoUrl("post-8", 600, 750)], caption: "Trilha na Chapada 🥾", timeAgo: "2 sem" },
];

export const mockPosts: Post[] = posts.map((post) => ({ ...post, ...randomEngagement() }));
