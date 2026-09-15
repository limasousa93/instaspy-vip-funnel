"use client";

import dynamic from "next/dynamic";
import { LetterGlitch } from "@/components/ui/letter-glitch";
import { useProfileResult } from "@/lib/profile-result/use-profile-result";
import { HeroSection } from "@/components/profile-result/hero-section";
import { ProfileCard } from "@/components/profile-result/profile-card";
import { DownArrowDivider } from "@/components/profile-result/shared";

// Seções abaixo da dobra: só entram no bundle inicial quando o usuário rola
// até lá — a página inteira é renderizada no cliente (o objeto profileData
// vem do localStorage), então dynamic() aqui só ajuda no tamanho do chunk
// baixado, sem custo de SSR pra evitar.
const MediaGallery = dynamic(() => import("@/components/profile-result/media-gallery").then((m) => m.MediaGallery));
const LocationCard = dynamic(() => import("@/components/profile-result/location-card").then((m) => m.LocationCard));
const StoriesCard = dynamic(() => import("@/components/profile-result/stories-card").then((m) => m.StoriesCard));
const MessagesCard = dynamic(() => import("@/components/profile-result/messages-card").then((m) => m.MessagesCard));
const OfferSection = dynamic(() => import("@/components/profile-result/offer-section").then((m) => m.OfferSection));
const Testimonials = dynamic(() => import("@/components/profile-result/testimonials").then((m) => m.Testimonials));
const FaqSection = dynamic(() => import("@/components/profile-result/faq-section").then((m) => m.FaqSection));
const GuaranteeSection = dynamic(() =>
  import("@/components/profile-result/guarantee-section").then((m) => m.GuaranteeSection),
);
const ResultFooter = dynamic(() => import("@/components/profile-result/footer").then((m) => m.ResultFooter));

export default function ResultadoPage() {
  const profile = useProfileResult();

  return (
    <div className="relative min-h-screen bg-black">
      <div className="pointer-events-none fixed inset-0 opacity-[0.15]">
        <LetterGlitch glitchSpeed={80} outerVignette smooth characters=". " />
      </div>

      <div className="relative mx-auto flex w-full max-w-md flex-col gap-5 px-4 pb-16 pt-6">
        <HeroSection />
        <ProfileCard profile={profile} />
        <MediaGallery profile={profile} />
        <LocationCard profile={profile} />
        <StoriesCard profile={profile} />
        <MessagesCard profile={profile} />

        <DownArrowDivider />
        <OfferSection profile={profile} />

        <DownArrowDivider />
        <Testimonials />
        <FaqSection />
        <GuaranteeSection />
        <ResultFooter />
      </div>
    </div>
  );
}
