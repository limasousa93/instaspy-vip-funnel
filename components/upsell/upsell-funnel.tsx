"use client";

import { useState } from "react";
import { Crown } from "lucide-react";
import { OnboardingLogo } from "@/components/onboarding/onboarding-card";
import { PlanBanner } from "@/components/profile-result/plan-banner";
import { trackEvent } from "@/lib/tracking/track-event";
import { UpsellFaqSection } from "@/components/upsell/upsell-faq-section";
import { UpsellPhonePreview } from "@/components/upsell/upsell-phone-preview";
import { UpsellTestimonials } from "@/components/upsell/upsell-testimonials";
import { UpsellUnlockButton } from "@/components/upsell/upsell-unlock-button";
import { UpsellWhatsAppCard } from "@/components/upsell/upsell-whatsapp-card";
import { UPSELL_OFFER, type UpsellOffer } from "@/components/upsell/upsell-offer";

const MATRIX_PLAN_ITEMS = [
  "Acesso a fotos",
  "Acesso a vídeos",
  "Acesso a áudios",
  "Localizações",
  "Conversas arquivadas",
  "Conversas apagadas",
  "Acesso à câmera frontal do celular",
  "Notificações",
  "Acesso imediato",
  "100% anônimo",
];

/**
 * Une o card "Digite o número do WhatsApp" e o mockup do celular num único
 * client component porque os dois precisam compartilhar o estado
 * `revealed`: o mockup começa borrado (cadeado + "Faça um teste grátis") e
 * só revela a lista/chat de verdade depois que o card confirma uma busca
 * (real ou placeholder) — ver `onResult` em UpsellWhatsAppCard.
 */
export function UpsellFunnel({ checkoutUrl, offer = UPSELL_OFFER }: { checkoutUrl: string; offer?: UpsellOffer }) {
  const [revealed, setRevealed] = useState(false);

  function handleRequestSearch() {
    const input = document.getElementById("whatsapp-number-input");
    input?.scrollIntoView({ behavior: "smooth", block: "center" });
    (input as HTMLInputElement | null)?.focus();
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <OnboardingLogo />

      <div className="relative w-full">
        <div
          className="absolute -top-8 left-1/2 z-10 flex h-16 w-16 -translate-x-1/2 items-center justify-center rounded-full border-[3px] border-black"
          style={{
            background: "linear-gradient(135deg, #fde68a, #f59e0b)",
            boxShadow: "0 8px 22px -4px rgba(245,158,11,0.55), 0 0 40px -8px rgba(245,158,11,0.5)",
          }}
        >
          <Crown className="h-7 w-7 fill-[#3b0764] text-[#3b0764]" />
        </div>

        <div
          className="rounded-[28px] border border-violet-500/30 bg-black/70 px-6 pb-8 pt-11 text-center backdrop-blur-sm sm:px-9 sm:pt-12"
          style={{ boxShadow: "0 0 60px -15px rgba(139,92,246,0.45)" }}
        >
          <h1 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl">
            {offer.headline}
          </h1>

          <div className="mt-4 rounded-2xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-center">
            <p className="text-sm font-bold text-green-300">{offer.notice}</p>
          </div>

          <p className="mt-3 text-xl font-extrabold text-violet-400">Faça o teste grátis.</p>

          <UpsellWhatsAppCard checkoutUrl={checkoutUrl} price={offer.price} onResult={() => setRevealed(true)} />
        </div>
      </div>

      <p className="text-center text-3xl font-extrabold leading-tight sm:text-4xl" style={{ color: "#25D366" }}>
        Veja Algumas conversas desse perfil
      </p>

      <UpsellPhonePreview checkoutUrl={checkoutUrl} price={offer.price} priceLabel={offer.priceLabel} revealed={revealed} onRequestSearch={handleRequestSearch} />

      <UpsellTestimonials />

      <PlanBanner
        variant="premium"
        badge="Acesso Completo"
        title="Atualização WhatsApp + Instagram"
        price={offer.priceLabel}
        originalPrice={offer.originalPriceLabel}
        items={MATRIX_PLAN_ITEMS}
        ctaHref={checkoutUrl}
        ctaText="Desbloquear tudo agora"
        ctaSubtext="Compra 100% segura"
        onCtaClick={() => trackEvent("InitiateCheckout", { currency: "BRL", value: offer.price })}
      />

      <UpsellFaqSection priceLabel={offer.priceLabel} />

      <UpsellUnlockButton checkoutUrl={checkoutUrl} price={offer.price} />
    </div>
  );
}
