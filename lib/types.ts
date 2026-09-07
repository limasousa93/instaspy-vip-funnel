export interface User {
  id: string;
  username: string;
  fullName: string;
  bio: string;
  verified: boolean;
  followers: number;
  following: number;
  postsCount: number;
}

export interface Post {
  id: string;
  authorId: string;
  images: string[];
  caption: string;
  likes: number;
  comments: number;
  shares: number;
  timeAgo: string;
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
  caption: string;
  likes: number;
  comments: number;
  shares: number;
}

export interface Message {
  id: string;
  fromUserId: string;
  text: string;
  timeAgo: string;
}

export interface Conversation {
  id: string;
  userId: string;
  lastMessage: string;
  timeAgo: string;
  unread: boolean;
  messages: Message[];
}

export interface AppNotification {
  id: string;
  userId: string;
  text: string;
  timeAgo: string;
  group: "today" | "week" | "month";
  actionable: "follow-back" | "none";
}
