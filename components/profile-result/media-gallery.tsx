import { Smartphone } from "lucide-react";
import type { ProfileResultData } from "@/lib/profile-result/use-profile-result";
import { photoUrl } from "@/lib/media";
import { LockedTile, ResultCard, SectionHeading } from "./shared";

export function MediaGallery({ profile }: { profile: ProfileResultData }) {
  const thumbs = Array.from({ length: 6 }, (_, i) => photoUrl(`${profile.username}-media-${i}`, 240, 240));

  return (
    <ResultCard>
      <SectionHeading
        icon={<Smartphone className="h-5 w-5" />}
        title={`Veja Mídias de ${profile.name}`}
        subtitle="Veja todas as mídias recebidas e enviadas, incluindo itens apagados."
      />
      <div className="grid grid-cols-3 gap-2">
        {thumbs.map((src, i) => (
          <LockedTile key={i} src={src} />
        ))}
      </div>
    </ResultCard>
  );
}
