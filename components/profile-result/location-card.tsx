"use client";

import { buildCheckoutUrl } from "@/lib/tracking/checkout-url";
import Image from "next/image";
import { MapPin } from "lucide-react";
import type { ProfileResultData } from "@/lib/profile-result/use-profile-result";
import { CHECKOUT_URL_MAIN, ProfileAvatar, ResultCard, SectionHeading } from "./shared";

export function LocationCard({ profile }: { profile: ProfileResultData }) {
  return (
    <ResultCard>
      <SectionHeading
        icon={<MapPin className="h-5 w-5" />}
        title="Localização em tempo real"
        subtitle={`Veja onde ${profile.name} está agora, e os últimos locais por onde passou.`}
      />
      <div className="relative flex h-40 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-[#111216]">
        <Image src="/mapa.png" alt="" fill sizes="(min-width: 640px) 400px, 100vw" className="object-cover" />
        <div className="absolute inset-0 bg-black/25" />
        <div className="relative flex flex-col items-center gap-1">
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
          href={CHECKOUT_URL_MAIN}
          onClick={(e) => {
            e.preventDefault();
            window.location.href = buildCheckoutUrl(CHECKOUT_URL_MAIN);
          }}
          className="spy-cta-button shrink-0 rounded-full px-5 py-2 text-xs font-bold text-white active:opacity-90"
        >
          Ver
        </a>
      </div>
    </ResultCard>
  );
}
