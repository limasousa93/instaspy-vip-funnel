"use client";

import { Check } from "lucide-react";
import { buildCheckoutUrl } from "@/lib/tracking/checkout-url";
import { trackEvent } from "@/lib/tracking/track-event";

/**
 * Botão verde "Atualizar e Desbloquear" abaixo do mockup do celular — mesmo
 * gradiente hex puro do botão "Consultar"/"Desbloquear tudo agora" do
 * upsell-whatsapp-card.tsx (Safari antigo não parseia oklch/oklab do
 * Tailwind, mesmo motivo documentado em app/globals.css).
 */
export function UpsellUnlockButton({ checkoutUrl }: { checkoutUrl: string }) {
  function handleClick() {
    trackEvent("InitiateCheckout", { currency: "BRL", value: 19.9 });
    window.location.href = buildCheckoutUrl(checkoutUrl);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-base font-bold text-white active:opacity-90"
      style={{
        background: "linear-gradient(180deg, #2fe677, #1fb959)",
        boxShadow: "0 6px 18px rgba(37,211,102,0.4), inset 0 1px 0 rgba(255,255,255,0.3)",
      }}
    >
      <Check className="h-5 w-5" /> Atualizar e Desbloquear
    </button>
  );
}
