"use client";

import { useState } from "react";
import { Crown, TriangleAlert } from "lucide-react";
import { OnboardingLogo } from "@/components/onboarding/onboarding-card";
import { PlanBanner } from "@/components/profile-result/plan-banner";
import { trackEvent } from "@/lib/tracking/track-event";
import { PremiumGiftBonus } from "@/components/upsell/premium-gift-bonus";
import { UpsellFaqSection } from "@/components/upsell/upsell-faq-section";
import { UpsellPhonePreview } from "@/components/upsell/upsell-phone-preview";
import { UpsellTestimonials } from "@/components/upsell/upsell-testimonials";
import { UpsellVslSection } from "@/components/upsell/upsell-vsl-section";
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
  "100% Secreto",
  "Receba o acesso no seu E-mail",
];

/**
 * Une o card "Digite o número do WhatsApp" e o mockup do celular num único
 * client component porque os dois precisam compartilhar o estado
 * `revealed`: o mockup começa borrado (cadeado + "Faça um teste grátis") e
 * só revela a lista/chat de verdade depois que o card confirma uma busca
 * (real ou placeholder) — ver `onResult` em UpsellWhatsAppCard.
 */
export function UpsellFunnel({
  checkoutUrl,
  offer = UPSELL_OFFER,
  showIntro = true,
  showVsl = false,
  geoLabel = null,
}: {
  checkoutUrl: string;
  offer?: UpsellOffer;
  /** false = omite título, aviso e "Faça o teste grátis." (o /upsell os substitui pelo UpsellHeadlineBanner). */
  showIntro?: boolean;
  /** true = exibe o aviso "Não fecha essa página" no card do título e, logo abaixo dele, o bloco VSL + investigação do WhatsApp (sobre o fundo do site). */
  showVsl?: boolean;
  /** Localização aproximada do visitante (ex.: "Fortaleza, CE"), exibida no card de análise da VSL. */
  geoLabel?: string | null;
}) {
  // Sem o card de busca ninguém dispara `onResult`, então o mockup já nasce revelado.
  const [revealed, setRevealed] = useState((offer.hideWhatsAppTrial || offer.phoneUnlocked) ?? false);

  // Com a VSL, o resto da página só surge junto com o botão "Clique para ver o que encontramos".
  const [ctaVisible, setCtaVisible] = useState(false);
  const showRest = !showVsl || ctaVisible;

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
            background: offer.badgeIcon === "alert" ? "#0a0a0a" : "linear-gradient(135deg, #fde68a, #f59e0b)",
            boxShadow: "0 8px 22px -4px rgba(245,158,11,0.55), 0 0 40px -8px rgba(245,158,11,0.5)",
            ...(offer.badgeIcon === "alert" ? { borderColor: "#f7c81b" } : {}),
          }}
        >
          {offer.badgeIcon === "alert" ? (
            <TriangleAlert className="h-8 w-8 fill-[#f7c81b] text-[#0a0a0a]" strokeWidth={2} />
          ) : (
            <Crown className="h-7 w-7 fill-[#3b0764] text-[#3b0764]" />
          )}
        </div>

        <div
          className="rounded-[28px] border border-violet-500/30 bg-black/70 px-6 pb-8 pt-11 text-center backdrop-blur-sm sm:px-9 sm:pt-12"
          style={{ boxShadow: "0 0 60px -15px rgba(139,92,246,0.45)" }}
        >
          {showIntro && (
            <>
              <h1 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl">
                {offer.headline}
              </h1>

              {offer.subtext?.map((line) => (
                <p key={line} className="mt-4 text-lg font-extrabold leading-snug text-white sm:text-xl">
                  {line}
                </p>
              ))}

              {offer.notice && (
                <div className="mt-4 rounded-2xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-center">
                  <p className="text-sm font-bold text-green-300">{offer.notice}</p>
                </div>
              )}

            </>
          )}

          {!offer.hideWhatsAppTrial && (
            <UpsellWhatsAppCard onResult={() => setRevealed(true)} />
          )}

          {showVsl && (
            <span
              className="mt-6 inline-flex items-center gap-2.5 rounded-lg px-5 py-2.5 text-sm font-extrabold tracking-wide text-white"
              style={{ background: "linear-gradient(90deg, #b45309, #c2570c)", boxShadow: "0 6px 20px rgba(180,83,9,0.4)" }}
            >
              <TriangleAlert className="h-4 w-4 shrink-0" style={{ color: "#fbbf24" }} fill="#fbbf24" />
              NÃO FECHA ESSA PÁGINA
              <TriangleAlert className="h-4 w-4 shrink-0" style={{ color: "#fbbf24" }} fill="#fbbf24" />
            </span>
          )}
        </div>
      </div>

      {showVsl && <UpsellVslSection geoLabel={geoLabel} onCtaVisibleChange={setCtaVisible} />}

      {showRest && (
        <>
      {!offer.belowPhoneText && (
        <p className="text-center text-3xl font-extrabold leading-tight sm:text-4xl" style={{ color: "#25D366" }}>
          Veja Algumas conversas desse perfil
        </p>
      )}

      <UpsellPhonePreview priceLabel={offer.priceLabel} revealed={revealed} onRequestSearch={handleRequestSearch} />

      {offer.belowPhoneText && (
        <p className="text-center text-2xl font-extrabold leading-tight sm:text-3xl" style={{ color: "#25D366" }}>
          {offer.belowPhoneText}
        </p>
      )}

      {!offer.hideTestimonials && <UpsellTestimonials title={offer.testimonialsTitle} />}

      <PlanBanner
        variant="premium"
        badge="Acesso Completo"
        title={offer.planTitle ?? "Atualização WhatsApp + Instagram"}
        price={offer.priceLabel}
        originalPrice={offer.originalPriceLabel}
        items={MATRIX_PLAN_ITEMS}
        ctaHref={checkoutUrl}
        ctaTone={offer.greenPlanCta ? "green" : undefined}
        bonus={offer.bonusText ? <PremiumGiftBonus text={offer.bonusText} /> : undefined}
        declineHref={offer.decline?.href}
        declineText={offer.decline?.text}
        ctaText="Desbloquear tudo agora"
        ctaSubtext="Compra 100% segura"
        onCtaClick={() =>
          trackEvent("InitiateCheckout", {
            currency: "BRL",
            value: offer.price,
            content_type: "product",
            content_ids: [offer.contentId],
            content_name: offer.contentName,
          })
        }
      />

      {!offer.hideFaq && (
        <UpsellFaqSection priceLabel={offer.priceLabel} answers={offer.faq?.answers} questions={offer.faq?.questions} omit={offer.faq?.omit} />
      )}

      {!offer.hideUnlockButton && <UpsellUnlockButton />}
        </>
      )}
    </div>
  );
}
