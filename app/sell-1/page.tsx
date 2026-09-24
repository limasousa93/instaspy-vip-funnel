import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { UpsellBackdrop } from "@/components/upsell/upsell-backdrop";
import { UpsellCountdownBanner } from "@/components/upsell/upsell-countdown-banner";
import { UpsellFunnel } from "@/components/upsell/upsell-funnel";
import { hasAnyUpgrade, SESSION_COOKIE_NAME, verifySession } from "@/lib/session/session";

export default async function UpsellPage() {
  const cookieStore = await cookies();
  const session = await verifySession(cookieStore.get(SESSION_COOKIE_NAME)?.value);

  if (!session?.vip) redirect("/entrar");
  if (hasAnyUpgrade(session)) redirect("/feed");

  const upsellCheckoutUrl = "https://pay.cakto.com.br/ybi8d48_1102048";

  return (
    <>
      <UpsellCountdownBanner />

      <UpsellBackdrop>
        <UpsellFunnel checkoutUrl={upsellCheckoutUrl} />
      </UpsellBackdrop>
    </>
  );
}
