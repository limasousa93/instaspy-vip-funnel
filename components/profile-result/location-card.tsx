import { MapPin } from "lucide-react";
import type { ProfileResultData } from "@/lib/profile-result/use-profile-result";
import { ProfileAvatar, ResultCard, SectionHeading, VIP_CHECKOUT_URL } from "./shared";

export function LocationCard({ profile }: { profile: ProfileResultData }) {
  return (
    <ResultCard>
      <SectionHeading
        icon={<MapPin className="h-5 w-5" />}
        title="Localização em tempo real"
        subtitle={`Veja onde ${profile.name} está agora, e os últimos locais por onde passou.`}
      />
      <div
        className="relative flex h-40 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-[#111216]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(139,92,246,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.15) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      >
        <div className="flex flex-col items-center gap-1">
          <div className="relative">
            <span className="absolute inset-0 -m-2 animate-ping rounded-full bg-violet-500/30" />
            <ProfileAvatar
              src={profile.avatar}
              alt={profile.username}
              size={56}
              className="relative ring-2 ring-violet-500"
            />
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-white">Localização Atual</p>
          <p className="truncate text-xs text-white/50">@{profile.username}</p>
        </div>
        <a
          href={VIP_CHECKOUT_URL()}
          className="spy-cta-button shrink-0 rounded-full px-5 py-2 text-xs font-bold text-white active:opacity-90"
        >
          Ver
        </a>
      </div>
    </ResultCard>
  );
}
