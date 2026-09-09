import type { MessageRequest } from "@/lib/types";

export const mockMessageRequests: MessageRequest[] = [
  { id: "req1", userId: "u12", preview: "Oi! Vi seu perfil e queria trocar uma ideia sobre parcerias.", timeAgo: "2 d" },
  { id: "req2", userId: "u2", preview: "Fala! Curti muito seu conteúdo, bora trocar uma ideia?", timeAgo: "3 d" },
  { id: "req3", userId: "u5", preview: "Oii, adorei seu último post 😍", timeAgo: "4 d" },
  { id: "req4", userId: "u11", preview: "E aí, a gente se conhece de algum lugar?", timeAgo: "6 d" },
];
