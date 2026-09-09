import { avatarUrl } from "@/lib/media";
import type { User } from "@/lib/types";

export const CURRENT_USER_ID = "u1";

export const mockUsers: User[] = [
  { id: "u1", username: "ana.viajante", fullName: "Ana Ribeiro", bio: "Explorando o mundo 🌍✈️\nFotografia amadora", verified: false, followers: 1349, following: 706, postsCount: 27 },
  { id: "u2", username: "marcos.criativo", fullName: "Marcos Lima", bio: "Design & criatividade", verified: true, followers: 8420, following: 312, postsCount: 143 },
  { id: "u3", username: "juliac.foto", fullName: "Julia Castro", bio: "Fotógrafa de casamentos", verified: false, followers: 5210, following: 890, postsCount: 302 },
  { id: "u4", username: "central.negocios", fullName: "Central de Negócios", bio: "Conteúdo sobre empreendedorismo", verified: false, followers: 34200, following: 12, postsCount: 512 },
  { id: "u5", username: "beatriz.moda", fullName: "Beatriz Souza", bio: "Moda e estilo de vida", verified: true, followers: 92100, following: 540, postsCount: 887 },
  { id: "u6", username: "olivia.69", fullName: "Olivia", bio: "Vida real, sem filtro 🌴", verified: true, followers: 15600, following: 201, postsCount: 98 },
  { id: "u7", username: "isabela.beauty", fullName: "Isabela Ferreira", bio: "Maquiadora profissional", verified: false, followers: 4300, following: 610, postsCount: 210 },
  { id: "u8", username: "lucas.finance", fullName: "Lucas Andrade", bio: "Consultor financeiro", verified: false, followers: 2100, following: 340, postsCount: 76 },
  { id: "u9", username: "clara.eventos", fullName: "Clara Mendes", bio: "Vestidos de noiva e festas", verified: false, followers: 7800, following: 120, postsCount: 421 },
  { id: "u10", username: "diego.arte", fullName: "Diego Brito", bio: "Ilustrador digital", verified: false, followers: 990, following: 450, postsCount: 64 },
  { id: "u11", username: "kallineoficial", fullName: "Kalline Cavalcante", bio: "Life & style", verified: false, followers: 3200, following: 780, postsCount: 155 },
  { id: "u12", username: "italo.virginio", fullName: "Italo Virginio", bio: "Palestrante e escritor", verified: true, followers: 68000, following: 89, postsCount: 340 },
];

export function getUser(id: string): User {
  const user = mockUsers.find((u) => u.id === id);
  if (user) return user;
  return {
    id,
    username: id,
    fullName: id,
    bio: "",
    verified: false,
    followers: 0,
    following: 0,
    postsCount: 0,
    source: "live",
  };
}

export { avatarUrl };
