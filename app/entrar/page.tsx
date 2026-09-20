import { OnboardingBackdrop, OnboardingBadges, OnboardingCard, OnboardingLogo } from "@/components/onboarding/onboarding-card";
import { WhatsAppSupportButton } from "@/components/upsell/whatsapp-support-button";
import { VerifyAccessForm } from "./verify-access-form";

export default function EntrarPage() {
  return (
    <OnboardingBackdrop>
      <OnboardingCard>
        <OnboardingLogo />
        <h1 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl">
          Confirme seu <span className="text-violet-400">acesso VIP</span>
        </h1>
        <p className="mt-4 text-sm text-white/70">
          Digite o e-mail que você usou no pagamento para liberar seu acesso VIP.
        </p>
        <VerifyAccessForm />
        <OnboardingBadges />
      </OnboardingCard>
      <WhatsAppSupportButton />
    </OnboardingBackdrop>
  );
}
