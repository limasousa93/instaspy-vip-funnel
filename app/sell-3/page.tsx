import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { UpsellBackdrop } from "@/components/upsell/upsell-backdrop";
import { UpsellFunnel } from "@/components/upsell/upsell-funnel";
import { CROSSELL_OFFER } from "@/components/upsell/upsell-offer";
import { hasAnyUpgrade, SESSION_COOKIE_NAME, verifySession } from "@/lib/session/session";

export default async function CrossellPage() {
  const cookieStore = await cookies();
  const session = await verifySession(cookieStore.get(SESSION_COOKIE_NAME)?.value);

  if (!session?.vip) redirect("/entrar");
  if (hasAnyUpgrade(session)) redirect("/feed");

  const crossellCheckoutUrl = "https://pay.cakto.com.br/chqry6x";

  return (
    <>
      <UpsellBackdrop>
        <UpsellFunnel checkoutUrl={crossellCheckoutUrl} offer={CROSSELL_OFFER} />
      </UpsellBackdrop>
    </>
  );
}
