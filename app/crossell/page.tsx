import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { OnboardingTopBanner } from "@/components/onboarding/onboarding-card";
import { DeclineOfferLink } from "@/components/upsell/decline-offer-link";
import { UpsellBackdrop } from "@/components/upsell/upsell-backdrop";
import { UpsellFunnel } from "@/components/upsell/upsell-funnel";
import { CROSSELL_OFFER } from "@/components/upsell/upsell-offer";
import { SESSION_COOKIE_NAME, verifySession } from "@/lib/session/session";

export default async function CrossellPage() {
  const cookieStore = await cookies();
  const session = await verifySession(cookieStore.get(SESSION_COOKIE_NAME)?.value);

  if (!session?.vip) redirect("/entrar");
  if (session.upsell || session.downsell) redirect("/feed");

  const crossellCheckoutUrl = process.env.NEXT_PUBLIC_CAKTO_CHECKOUT_URL_CROSSELL ?? "#";

  return (
    <>
      <OnboardingTopBanner>Seu pagamento foi confirmado.</OnboardingTopBanner>

      <UpsellBackdrop>
        <UpsellFunnel checkoutUrl={crossellCheckoutUrl} offer={CROSSELL_OFFER} />
        <DeclineOfferLink href="/feed">Não quero</DeclineOfferLink>
      </UpsellBackdrop>
    </>
  );
}
