import type { ProfileResultData } from "@/lib/profile-result/use-profile-result";
import { ProfileAvatar, ResultCard } from "./shared";

export function ProfileCard({ profile }: { profile: ProfileResultData }) {
  return (
    <div className="flex flex-col gap-3">
      <ResultCard className="text-left">
        <div className="flex items-center gap-4">
          <ProfileAvatar
            src={profile.avatar}
            alt={profile.username}
            size={64}
            className="ring-2 ring-violet-500/50"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-bold text-white">{profile.name}</p>
            <p className="truncate text-xs text-white/50">@{profile.username}</p>
            <div className="mt-2 flex gap-4 text-center">
              <div>
                <p className="text-sm font-bold text-white">{profile.posts.toLocaleString("pt-BR")}</p>
                <p className="text-[10px] text-white/50">posts</p>
              </div>
              <div>
                <p className="text-sm font-bold text-white">{profile.followers.toLocaleString("pt-BR")}</p>
                <p className="text-[10px] text-white/50">seguidores</p>
              </div>
              <div>
                <p className="text-sm font-bold text-white">{profile.following.toLocaleString("pt-BR")}</p>
                <p className="text-[10px] text-white/50">seguindo</p>
              </div>
            </div>
          </div>
        </div>
        {profile.bio && (
          <p className="mt-3 whitespace-pre-line text-xs text-white/70">{profile.bio}</p>
        )}
      </ResultCard>

      <div className="rounded-2xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-center">
        <p className="text-xs font-bold text-green-300">Espionagem 100% finalizada!</p>
      </div>
    </div>
  );
}
