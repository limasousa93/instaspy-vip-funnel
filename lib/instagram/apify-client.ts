import { ApifyClient } from "apify-client";
import type { MockInstagramData, MockInstagramPost } from "./mock-data";

const ACTOR_ID = "apify/instagram-scraper";
const RUN_TIMEOUT_SECS = 90;

interface RawApifyPost {
  id?: string;
  shortCode?: string;
  caption?: string;
  likesCount?: number;
  commentsCount?: number;
  timestamp?: string;
  type?: "Image" | "Video" | "Sidecar";
  displayUrl?: string;
}

interface RawApifyProfile {
  username: string;
  error?: string;
  fullName?: string;
  biography?: string;
  followersCount?: number;
  followsCount?: number;
  postsCount?: number;
  profilePicUrl?: string;
  verified?: boolean;
  externalUrl?: string;
  latestPosts?: RawApifyPost[];
}

function toMockPost(post: RawApifyPost, index: number): MockInstagramPost {
  return {
    id: post.shortCode ?? post.id ?? `post-${index}`,
    likes: post.likesCount ?? 0,
    comments: post.commentsCount ?? 0,
    caption: post.caption ?? "",
    mediaUrl: post.displayUrl ?? "",
    timestamp: post.timestamp ?? new Date().toISOString(),
    type: post.type === "Video" ? "Video" : "Image",
  };
}

function toMockData(raw: RawApifyProfile): MockInstagramData {
  return {
    profile: {
      username: raw.username,
      fullName: raw.fullName ?? raw.username,
      biography: raw.biography ?? "",
      followersCount: raw.followersCount ?? 0,
      followsCount: raw.followsCount ?? 0,
      postsCount: raw.postsCount ?? 0,
      profilePicUrl: raw.profilePicUrl ?? "",
      verified: raw.verified ?? false,
      externalUrl: raw.externalUrl,
    },
    posts: (raw.latestPosts ?? []).map(toMockPost),
  };
}

export async function fetchInstagramData(username: string): Promise<MockInstagramData | null> {
  const token = process.env.APIFY_API_TOKEN;
  if (!token) throw new Error("APIFY_API_TOKEN não configurado");

  const client = new ApifyClient({ token });

  const run = await client.actor(ACTOR_ID).call(
    {
      directUrls: [`https://www.instagram.com/${username}/`],
      resultsType: "details",
      resultsLimit: 12,
    },
    { timeout: RUN_TIMEOUT_SECS }
  );

  const { items } = await client.dataset(run.defaultDatasetId).listItems();
  const raw = items[0] as unknown as RawApifyProfile | undefined;
  // Perfis inexistentes/privados não geram erro HTTP: o actor devolve um item
  // com { error, errorDescription } (ex.: "not_found"). Trata como não encontrado.
  if (!raw || raw.error || !raw.username) return null;

  return toMockData(raw);
}
