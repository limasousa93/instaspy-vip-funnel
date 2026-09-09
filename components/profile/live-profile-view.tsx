"use client";

import { useEffect } from "react";
import { useInstagram } from "@/hooks/useInstagram";
import { ProfileMobileHeader } from "@/components/profile/profile-mobile-header";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileTabs } from "@/components/profile/profile-tabs";
import { FetchingProgressScreen } from "@/components/search/fetching-progress-screen";

export function LiveProfileView({ username }: { username: string }) {
  const { data, loading, error, search } = useInstagram();

  useEffect(() => {
    search(username);
  }, [username, search]);

  if (loading || (!data && !error)) {
    return <FetchingProgressScreen key={username} username={username} />;
  }

  if (error || !data) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-2 px-4 text-center">
        <p className="text-base font-semibold text-foreground">{error ?? "Perfil não encontrado"}</p>
        <p className="text-sm text-muted-foreground">Verifique o username e tente novamente.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <ProfileMobileHeader username={data.profile.username} />
      <ProfileHeader user={data.profile} />
      <ProfileTabs posts={data.posts} reels={data.reels} reposts={[]} tagged={[]} />
    </div>
  );
}
