import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Crown } from "lucide-react";
import { OnboardingBackdrop, OnboardingBadges, OnboardingCard, OnboardingLogo } from "@/components/onboarding/onboarding-card";
import { UpsellCheckoutButton } from "@/components/upsell/upsell-checkout-button";
import { SESSION_COOKIE_NAME, verifySession } from "@/lib/session/session";

export default async function UpsellPage() {
  const cookieStore = await cookies();
  const session = await verifySession(cookieStore.get(SESSION_COOKIE_NAME)?.value);

  if (!session?.vip) redirect("/entrar");
  if (session.upsell) redirect("/feed");

  const upsellCheckoutUrl = process.env.NEXT_PUBLIC_CAKTO_CHECKOUT_URL_UPSELL ?? "#";

  return (
    <OnboardingBackdrop>
      <OnboardingCard>
        <OnboardingLogo />
        <Crown className="mx-auto h-10 w-10 fill-amber-400 text-amber-400" />
        <h1 className="mt-3 text-3xl font-extrabold leading-tight text-white sm:text-4xl">
          Atualize seu acesso para o <span className="text-violet-400">Protocolo MATRIX™</span>
        </h1>
        <div className="mt-4 rounded-2xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-center">
          <p className="text-xs font-bold text-green-300">
            O InstaSpy foi atualizado com a tecnologia MATRIX™, um protocolo até 3x mais avançado que a versão anterior. Seu acesso está quase pronto. Atualize para MATRIX™ por R$ 22,90 e tenha acesso completo.
          </p>
        </div>
        <div className="mt-7 flex flex-col gap-3">
          <UpsellCheckoutButton checkoutUrl={upsellCheckoutUrl} />
        </div>
        <OnboardingBadges />
      </OnboardingCard>
    </OnboardingBackdrop>
  );
}
