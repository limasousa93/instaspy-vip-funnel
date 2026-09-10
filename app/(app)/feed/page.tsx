import { FeedMobileHeader } from "@/components/feed/feed-mobile-header";
import { StoriesBar } from "@/components/feed/stories-bar";
import { PostCard } from "@/components/feed/post-card";
import { SuggestionsSidebar } from "@/components/feed/suggestions-sidebar";
import { FreeAccessWarningBanner } from "@/components/shared/free-access-warning-banner";
import { mockPosts } from "@/lib/mock-data/posts";

export default function FeedPage() {
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-xl">
        <FeedMobileHeader />
        <StoriesBar />
        {mockPosts.map((post) => (
          <PostCard
            key={post.id}
            post={post.id === "p5" ? { ...post, sensitive: true, showUnlockButton: false } : post}
          />
        ))}
        <FreeAccessWarningBanner />
      </div>
      <SuggestionsSidebar />
    </div>
  );
}
