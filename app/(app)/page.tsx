import { FeedMobileHeader } from "@/components/feed/feed-mobile-header";
import { StoriesBar } from "@/components/feed/stories-bar";
import { PostCard } from "@/components/feed/post-card";
import { SuggestionsSidebar } from "@/components/feed/suggestions-sidebar";
import { mockPosts } from "@/lib/mock-data/posts";

export default function FeedPage() {
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-xl">
        <FeedMobileHeader />
        <StoriesBar />
        {mockPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      <SuggestionsSidebar />
    </div>
  );
}
