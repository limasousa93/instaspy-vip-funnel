import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { OnboardingTopBanner } from "@/components/onboarding/onboarding-card";
import { LetterGlitch } from "@/components/ui/letter-glitch";
import { UpsellFunnel } from "@/components/upsell/upsell-funnel";
import { SESSION_COOKIE_NAME, verifySession } from "@/lib/session/session";

// Fundo exclusivo do /upsell: mesmo LetterGlitch verde do /resultado, em vez
// do GatewayFlow roxo do OnboardingBackdrop compartilhado (que /entrar e as
// outras telas do funil continuam usando normalmente).
function UpsellBackdrop({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4 py-10">
      <div className="pointer-events-none absolute inset-0 opacity-[0.15]">
        <LetterGlitch glitchSpeed={80} outerVignette smooth characters=". " />
      </div>
      <div className="relative w-full max-w-md">{children}</div>
    </div>
  );
}

export default async function UpsellPage() {
  const cookieStore = await cookies();
  const session = await verifySession(cookieStore.get(SESSION_COOKIE_NAME)?.value);

  if (!session?.vip) redirect("/entrar");
  if (session.upsell) redirect("/feed");

  const upsellCheckoutUrl = process.env.NEXT_PUBLIC_CAKTO_CHECKOUT_URL_UPSELL ?? "#";

  return (
    <>
      <OnboardingTopBanner>Seu pagamento foi confirmado.</OnboardingTopBanner>

      <UpsellBackdrop>
        <UpsellFunnel checkoutUrl={upsellCheckoutUrl} />
      </UpsellBackdrop>
    </>
  );
}
