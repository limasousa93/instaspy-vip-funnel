import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { UpsellBackdrop } from "@/components/upsell/upsell-backdrop";
import { UpsellCountdownBanner } from "@/components/upsell/upsell-countdown-banner";
import { UpsellFunnel } from "@/components/upsell/upsell-funnel";
import { SESSION_COOKIE_NAME, verifySession } from "@/lib/session/session";

export default async function UpsellPage() {
  const cookieStore = await cookies();
  const session = await verifySession(cookieStore.get(SESSION_COOKIE_NAME)?.value);

  // Sem guard de login: o comprador chega aqui direto do pagamento, antes de ter sessão.
  // Quem já tem o upsell (sessão existente) vai direto pro app.
  if (session?.upsell) redirect("/feed");

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
