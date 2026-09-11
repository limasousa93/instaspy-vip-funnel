import { MessageCircle, Phone, Video } from "lucide-react";
import type { ProfileResultData } from "@/lib/profile-result/use-profile-result";
import { ProfileAvatar, ResultCard, SectionHeading } from "./shared";

const BLUR_WIDTHS = [70, 85, 55, 90];

export function MessagesCard({ profile }: { profile: ProfileResultData }) {
  return (
    <ResultCard>
      <SectionHeading
        icon={<MessageCircle className="h-5 w-5" />}
        title="Mensagens do Direct"
        subtitle={`Veja literalmente todas as mensagens de ${profile.name}, incluindo mensagens temporárias.`}
      />
      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#111216]">
        <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2">
          <ProfileAvatar src={profile.avatar} alt={profile.username} size={28} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold text-white">{profile.name}</p>
            <p className="flex items-center gap-1 text-[10px] text-green-400">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400" /> online
            </p>
          </div>
          <Phone className="h-4 w-4 shrink-0 text-white/60" />
          <Video className="h-4 w-4 shrink-0 text-white/60" />
        </div>
        <div className="flex flex-col gap-2 p-3">
          {BLUR_WIDTHS.map((w, i) => (
            <div
              key={i}
              className={`h-6 rounded-full bg-white/10 blur-[3px] ${i % 2 === 0 ? "self-start" : "self-end"}`}
              style={{ width: `${w}%` }}
            />
          ))}
        </div>
      </div>
    </ResultCard>
  );
}
