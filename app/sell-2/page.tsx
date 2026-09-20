import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { UpsellBackdrop } from "@/components/upsell/upsell-backdrop";
import { UpsellCountdownBanner } from "@/components/upsell/upsell-countdown-banner";
import { UpsellFunnel } from "@/components/upsell/upsell-funnel";
import { DOWNSELL_OFFER } from "@/components/upsell/upsell-offer";
import { SESSION_COOKIE_NAME, verifySession } from "@/lib/session/session";

export default async function DownsellPage() {
  const cookieStore = await cookies();
  const session = await verifySession(cookieStore.get(SESSION_COOKIE_NAME)?.value);

  // Sem guard de login: chega aqui vindo da /sell-1, antes de o comprador ter sessão.
  if (session?.upsell || session?.downsell) redirect("/feed");

  const downsellCheckoutUrl = process.env.NEXT_PUBLIC_CAKTO_CHECKOUT_URL_DOWNSELL ?? "#";

  return (
    <>
      <UpsellCountdownBanner label="Oferta especial acaba em" totalSeconds={10 * 60} />

      <UpsellBackdrop>
        <UpsellFunnel checkoutUrl={downsellCheckoutUrl} offer={DOWNSELL_OFFER} />
      </UpsellBackdrop>
    </>
  );
}
