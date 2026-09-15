"use client";

import { Check } from "lucide-react";
import { trackEvent } from "@/lib/tracking/track-event";

export function UpsellCheckoutButton({ checkoutUrl }: { checkoutUrl: string }) {
  function handleClick() {
    trackEvent('InitiateCheckout', { currency: 'BRL', value: 19.90 });
    window.location.href = checkoutUrl;
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="gradient-cta-button flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-base font-bold text-white active:opacity-90"
    >
      <Check className="h-5 w-5" /> Atualizar e acessar
    </button>
  );
}
