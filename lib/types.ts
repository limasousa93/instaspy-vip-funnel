export interface User {
  id: string;
  username: string;
  fullName: string;
  bio: string;
  verified: boolean;
  followers: number;
  following: number;
  postsCount: number;
  avatarUrl?: string;
  externalUrl?: string;
  source?: "mock" | "live";
}

export interface Post {
  id: string;
  authorId: string;
  images: string[];
  caption: string;
  likes: number;
  comments: number;
  reposts: number;
  shares: number;
  timeAgo: string;
  credit?: string;
  videoSrc?: string;
  displayUsername?: string;
  sensitive?: boolean;
  showUnlockButton?: boolean;
}

export interface Story {
  id: string;
  authorId: string;
  label: string;
  seen: boolean;
}

export interface Reel {
  id: string;
  authorId: string;
  videoThumb: string;
  videoSrc?: string;
  caption: string;
  likes: number;
  comments: number;
  reposts: number;
  shares: number;
  audio: string;
  audioThumb: string;
  followedByUserId?: string;
  displayUsername?: string;
  avatarOverride?: string;
}

export interface Message {
  id: string;
  fromUserId: string;
  text?: string;
  timeAgo: string;
  kind?: "text" | "audio" | "photo";
  audioDuration?: string;
  photoUrl?: string;
}

export interface Conversation {
  id: string;
  userId: string;
  lastMessage: string;
  timeAgo: string;
  unread: boolean;
  previewOverride?: string;
  displayNameOverride?: string;
  avatarOverride?: string;
  ring?: boolean;
  pending?: boolean;
  noAvatar?: boolean;
  locked?: boolean;
  messages: Message[];
}

export interface InboxNote {
  userId: string;
  text?: string;
  audioTitle?: string;
}

export interface MessageRequest {
  id: string;
  userId: string;
  preview: string;
  timeAgo: string;
}

export type NotificationKind = "share-story" | "share-reel" | "share-post" | "follow" | "reply" | "multi-like" | "promo";

export interface AppNotification {
  id: string;
  kind: NotificationKind;
  userIds: string[];
  extraCount?: number;
  action: string;
  timeAgo: string;
  group: "Hoje" | "Ontem" | "Últimos 7 dias";
  thumbnail?: string;
  ring?: boolean;
  cta?: "follow-back" | "try-ai";
  reply?: { toUsername: string; quote: string };
}
