"use client";

import { useState } from "react";
import type { ProfileResultData } from "@/lib/profile-result/use-profile-result";
import { trackEvent } from "@/lib/tracking/track-event";
import { BrandMark, ResultCard, CHECKOUT_URL_MAIN, PREMIUM_BENEFITS, BASIC_BENEFITS } from "./shared";
import { PlanBanner } from "./plan-banner";
import { UpgradeModal } from "./upgrade-modal";

export function OfferSection({ profile }: { profile: ProfileResultData }) {
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  return (
    <ResultCard className="flex flex-col items-center text-center">
      <BrandMark />
      <h2 className="mt-3 text-lg font-extrabold leading-snug text-white sm:text-xl">
        Com o Insta<span className="text-violet-400">Spy</span> você vai ter acesso completo ao instagram de{" "}
        {profile.name}. Escolha seu plano:
      </h2>

      <div className="mt-5 w-full">
        <PlanBanner
          variant="premium"
          badge="Mais Escolhido"
          title="Completo"
          originalPrice="De R$ 197,00"
          price="37,90"
          items={PREMIUM_BENEFITS}
          ctaHref={CHECKOUT_URL_MAIN}
          ctaText="Acessar tudo agora mesmo"
          ctaSubtext="Compra 100% segura"
          onCtaClick={() => trackEvent("InitiateCheckout", { currency: "BRL", value: 37.9 })}
        />
      </div>

      <div className="mt-4 w-full">
        <PlanBanner
          variant="basic"
          title="Básico"
          originalPrice="De R$ 97,00"
          price="17,90"
          items={BASIC_BENEFITS}
          ctaHref="#"
          ctaText="Quero começar"
          onCtaClick={(e) => {
            e.preventDefault();
            setUpgradeOpen(true);
          }}
        />
      </div>

      <UpgradeModal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} />
    </ResultCard>
  );
}
