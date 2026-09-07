import type { AppNotification } from "@/lib/types";

export const mockNotifications: AppNotification[] = [
  { id: "n1", userId: "u11", text: "começou a seguir você.", timeAgo: "21h", group: "today", actionable: "follow-back" },
  { id: "n2", userId: "u2", text: 'respondeu ao seu comentário: "Info enviada! Confira sua caixa de entrada"', timeAgo: "2 d", group: "week", actionable: "none" },
  { id: "n3", userId: "u10", text: "e outras pessoas curtiram seu post.", timeAgo: "4 d", group: "week", actionable: "none" },
  { id: "n4", userId: "u7", text: "curtiu seu post.", timeAgo: "4 d", group: "week", actionable: "none" },
  { id: "n5", userId: "u9", text: "começou a seguir você.", timeAgo: "5 d", group: "week", actionable: "follow-back" },
  { id: "n6", userId: "u5", text: "e outras 3 pessoas curtiram seu story.", timeAgo: "6 d", group: "month", actionable: "none" },
  { id: "n7", userId: "u12", text: 'respondeu ao seu comentário: "Enviei no direct"', timeAgo: "31 sem", group: "month", actionable: "none" },
];
