import type { User, Post, Reel } from "@/lib/types";
import type { MockInstagramData, MockInstagramPost } from "./mock-data";

export interface NormalizedInstagramData {
  profile: User;
  posts: Post[];
  reels: Reel[];
}

function timeAgoFromTimestamp(timestamp: string): string {
  const diffMinutes = Math.floor((Date.now() - new Date(timestamp).getTime()) / 60_000);
  if (diffMinutes < 60) return `${Math.max(diffMinutes, 1)} min`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} h`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} d`;
  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 4) return `${diffWeeks} sem`;
  return `${Math.floor(diffDays / 30)} mês`;
}

function engagementSplit(post: MockInstagramPost): { reposts: number; shares: number } {
  return {
    reposts: Math.max(1, Math.round(post.likes * 0.02)),
    shares: Math.max(1, Math.round(post.likes * 0.01)),
  };
}

export function normalizeProfile(data: MockInstagramData): User {
  const { profile } = data;
  return {
    id: profile.username,
    username: profile.username,
    fullName: profile.fullName,
    bio: profile.biography,
    verified: profile.verified,
    followers: profile.followersCount,
    following: profile.followsCount,
    postsCount: profile.postsCount,
    avatarUrl: profile.profilePicUrl,
    externalUrl: profile.externalUrl,
    source: "live",
  };
}

export function normalizePosts(data: MockInstagramData): Post[] {
  return data.posts
    .filter((post) => post.type === "Image")
    .map((post) => {
      const { reposts, shares } = engagementSplit(post);
      return {
        id: `${data.profile.username}-${post.id}`,
        authorId: data.profile.username,
        images: [post.mediaUrl],
        caption: post.caption,
        likes: post.likes,
        comments: post.comments,
        reposts,
        shares,
        timeAgo: timeAgoFromTimestamp(post.timestamp),
      };
    });
}

export function normalizeReels(data: MockInstagramData): Reel[] {
  return data.posts
    .filter((post) => post.type === "Video")
    .map((post) => {
      const { reposts, shares } = engagementSplit(post);
      return {
        id: `${data.profile.username}-${post.id}`,
        authorId: data.profile.username,
        videoThumb: post.mediaUrl,
        caption: post.caption,
        likes: post.likes,
        comments: post.comments,
        reposts,
        shares,
        audio: `Áudio original · ${data.profile.username}`,
        audioThumb: post.mediaUrl,
      };
    });
}

export function normalizeInstagramData(data: MockInstagramData): NormalizedInstagramData {
  return {
    profile: normalizeProfile(data),
    posts: normalizePosts(data),
    reels: normalizeReels(data),
  };
}
