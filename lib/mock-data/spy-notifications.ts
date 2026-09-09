export type SpyNotificationGroup = "Hoje" | "Ontem" | "Últimos 7 dias";

export type SpyNotificationSegment = { text: string; bold?: boolean };

export type SpyNotificationAvatar =
  | { kind: "locked" }
  | { kind: "single"; seed: string }
  | { kind: "pair"; seeds: [string, string] };

export interface SpyNotification {
  id: string;
  group: SpyNotificationGroup;
  segments: SpyNotificationSegment[];
  timeAgo: string;
  avatar: SpyNotificationAvatar;
  thumbnailSeed?: string;
  cta?: "seguir" | "seguindo" | "testar";
}

// Conteúdo replicado de prints reais de um concorrente (stalkeia.app) — nomes
// já vêm mascarados com asterisco no dado de origem, não é anonimização nossa.
export const spyNotifications: SpyNotification[] = [
  {
    id: "n1",
    group: "Hoje",
    segments: [{ text: "Kau******", bold: true }, { text: " curtiu seu comentário: Delíciaaaa 😍😍😍" }],
    timeAgo: "48 min",
    avatar: { kind: "locked" },
    thumbnailSeed: "spy-thumb-1",
  },
  {
    id: "n2",
    group: "Ontem",
    segments: [{ text: "mar*****", bold: true }, { text: " começou a seguir você." }],
    timeAgo: "9 h",
    avatar: { kind: "single", seed: "spy-mar-camera" },
    cta: "seguindo",
  },
  {
    id: "n3",
    group: "Ontem",
    segments: [{ text: "leo*****", bold: true }, { text: " começou a seguir você." }],
    timeAgo: "12 h",
    avatar: { kind: "single", seed: "spy-leo-shirt" },
    cta: "seguindo",
  },
  {
    id: "n4",
    group: "Ontem",
    segments: [
      { text: "mar*****", bold: true },
      { text: ", " },
      { text: "cla*****", bold: true },
      { text: " e outras 1 pessoas estão no app Meta AI. Junte-se a elas agora." },
    ],
    timeAgo: "16 h",
    avatar: { kind: "pair", seeds: ["spy-mar-camera", "spy-cla"] },
    cta: "testar",
  },
  {
    id: "n5",
    group: "Últimos 7 dias",
    segments: [{ text: "Nova sugestão para seguir: " }, { text: "_bru*******", bold: true }, { text: "." }],
    timeAgo: "1 d",
    avatar: { kind: "locked" },
    cta: "seguir",
  },
  {
    id: "n6",
    group: "Últimos 7 dias",
    segments: [
      { text: "Ali*****", bold: true },
      { text: ", " },
      { text: "_lui*****", bold: true },
      { text: " e outras 3 pessoas curtiram seu comentário: Pegava muito" },
    ],
    timeAgo: "1 d",
    avatar: { kind: "pair", seeds: ["spy-ali", "spy-lui"] },
    thumbnailSeed: "spy-thumb-2",
  },
  {
    id: "n7",
    group: "Últimos 7 dias",
    segments: [{ text: "mar*****", bold: true }, { text: " começou a seguir você." }],
    timeAgo: "2 d",
    avatar: { kind: "single", seed: "spy-mar-collar" },
    cta: "seguindo",
  },
  {
    id: "n8",
    group: "Últimos 7 dias",
    segments: [{ text: "lar*****", bold: true }, { text: " adicionou 2 novos stories." }],
    timeAgo: "3 d",
    avatar: { kind: "single", seed: "spy-lar" },
    thumbnailSeed: "spy-thumb-3",
  },
  {
    id: "n9",
    group: "Últimos 7 dias",
    segments: [{ text: "Nova sugestão para seguir: " }, { text: "Lua*******", bold: true }, { text: "." }],
    timeAgo: "5 d",
    avatar: { kind: "locked" },
    cta: "seguir",
  },
  {
    id: "n10",
    group: "Últimos 7 dias",
    segments: [{ text: "fil*****", bold: true }, { text: " começou a seguir você." }],
    timeAgo: "6 d",
    avatar: { kind: "single", seed: "spy-fil" },
    cta: "seguir",
  },
  {
    id: "n11",
    group: "Últimos 7 dias",
    segments: [{ text: "gra*****", bold: true }, { text: " começou a seguir você." }],
    timeAgo: "6 d",
    avatar: { kind: "single", seed: "spy-gra" },
    cta: "seguindo",
  },
  {
    id: "n12",
    group: "Últimos 7 dias",
    segments: [{ text: "jan*****", bold: true }, { text: " mencionou você em um comentário." }],
    timeAgo: "7 d",
    avatar: { kind: "single", seed: "spy-jan" },
    thumbnailSeed: "spy-thumb-4",
  },
];

export const SPY_NOTIFICATION_GROUP_ORDER: SpyNotificationGroup[] = ["Hoje", "Ontem", "Últimos 7 dias"];
