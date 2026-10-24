import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { UpsellBackdrop } from "@/components/upsell/upsell-backdrop";
import { UpsellCountdownBanner } from "@/components/upsell/upsell-countdown-banner";
import { UpsellFunnel } from "@/components/upsell/upsell-funnel";
import { DOWNSELL_OFFER } from "@/components/upsell/upsell-offer";
import { hasAnyUpgrade, SESSION_COOKIE_NAME, verifySession } from "@/lib/session/session";

export default async function DownsellPage() {
  const cookieStore = await cookies();
  const session = await verifySession(cookieStore.get(SESSION_COOKIE_NAME)?.value);

  if (!session?.vip) redirect("/entrar");
  if (hasAnyUpgrade(session)) redirect("/feed");

  const downsellCheckoutUrl = "https://pay.cakto.com.br/3chrxbd_921615";

  return (
    <>
      <UpsellCountdownBanner label="Oferta especial acaba em" totalSeconds={40 * 60} />

      <UpsellBackdrop>
        <UpsellFunnel checkoutUrl={downsellCheckoutUrl} offer={DOWNSELL_OFFER} />
      </UpsellBackdrop>
    </>
  );
}
