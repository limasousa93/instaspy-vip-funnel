import { Sparkles } from "lucide-react";
import type { ProfileResultData } from "@/lib/profile-result/use-profile-result";
import { LockedTile, ResultCard, SectionHeading } from "./shared";
import { photoUrl } from "@/lib/media";

export function StoriesCard({ profile }: { profile: ProfileResultData }) {
  const thumbs = [photoUrl(`${profile.username}-story-1`, 240, 400), photoUrl(`${profile.username}-story-2`, 240, 400)];

  return (
    <ResultCard>
      <SectionHeading
        icon={<Sparkles className="h-5 w-5" />}
        title="Stories e posts ocultos"
        subtitle={`Veja stories de "Melhores Amigos" e posts que ${profile.name} escondeu de você.`}
      />
      <div className="grid grid-cols-2 gap-3">
        {thumbs.map((src, i) => (
          <LockedTile key={i} src={src} label="Conteúdo restrito" className="aspect-[3/4]" />
        ))}
      </div>
    </ResultCard>
  );
}
