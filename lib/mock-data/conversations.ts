import type { Conversation } from "@/lib/types";

export const mockConversations: Conversation[] = [
  {
    id: "c1", userId: "u7", lastMessage: "Você: Hoje vai dar tudo certo meu amor. De...", timeAgo: "2h", unread: true,
    messages: [
      { id: "m1", fromUserId: "u7", text: "Bom dia! Tudo pronto para hoje?", timeAgo: "09:10" },
      { id: "m2", fromUserId: "u1", text: "Hoje vai dar tudo certo meu amor. De boa!", timeAgo: "09:12" },
    ],
  },
  {
    id: "c2", userId: "u10", lastMessage: "Você: Só isso mas ta vendendo muito", timeAgo: "11h", unread: false,
    messages: [{ id: "m3", fromUserId: "u1", text: "Só isso mas ta vendendo muito", timeAgo: "ontem" }],
  },
  {
    id: "c3", userId: "u8", lastMessage: "Luan enviou um anexo.", timeAgo: "5d", unread: false,
    messages: [{ id: "m4", fromUserId: "u8", text: "Segue o anexo com a proposta.", timeAgo: "5d" }],
  },
  {
    id: "c4", userId: "u3", lastMessage: "Julia enviou um anexo.", timeAgo: "5d", unread: false,
    messages: [{ id: "m5", fromUserId: "u3", text: "Envio as fotos hoje ainda!", timeAgo: "5d" }],
  },
  {
    id: "c5", userId: "u9", lastMessage: "🥰", timeAgo: "1 sem", unread: false,
    messages: [{ id: "m6", fromUserId: "u9", text: "🥰", timeAgo: "1 sem" }],
  },
];
