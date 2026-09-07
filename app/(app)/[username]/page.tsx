import { notFound } from "next/navigation";
import { ProfileMobileHeader } from "@/components/profile/profile-mobile-header";
import { ProfileHeader } from "@/components/profile/profile-header";
import { SuggestedPeopleRow } from "@/components/profile/suggested-people-row";
import { HighlightsRow } from "@/components/profile/highlights-row";
import { ProfileTabs } from "@/components/profile/profile-tabs";
import { mockUsers } from "@/lib/mock-data/users";
import { mockPosts } from "@/lib/mock-data/posts";
import { mockReels } from "@/lib/mock-data/reels";

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const user = mockUsers.find((u) => u.id === username || u.username === username);
  if (!user) notFound();

  const posts = mockPosts.filter((p) => p.authorId === user.id);
  const reels = mockReels.filter((r) => r.authorId === user.id);
  const reposts = mockReels.filter((r) => r.authorId !== user.id).slice(0, 2);
  const tagged = mockPosts.filter((p) => p.authorId !== user.id).slice(0, 3);

  return (
    <div className="mx-auto max-w-3xl">
      <ProfileMobileHeader username={user.username} />
      <ProfileHeader user={user} />
      <SuggestedPeopleRow excludeUserId={user.id} />
      <HighlightsRow />
      <ProfileTabs posts={posts} reels={reels} reposts={reposts} tagged={tagged} />
    </div>
  );
}
