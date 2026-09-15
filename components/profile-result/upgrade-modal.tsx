"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowRight, X } from "lucide-react";
import { trackPixelEvent } from "@/lib/pixel";
import { CHECKOUT_URL_BASIC, CHECKOUT_URL_UPSELL, PREMIUM_BENEFITS } from "./shared";
import { PlanBanner } from "./plan-banner";

export function UpgradeModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  const [entered, setEntered] = useState(false);
  const [fitScale, setFitScale] = useState(1);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setMounted(true);
      const raf = requestAnimationFrame(() => setEntered(true));
      return () => cancelAnimationFrame(raf);
    }
    setEntered(false);
    const timeout = window.setTimeout(() => setMounted(false), 200);
    return () => window.clearTimeout(timeout);
  }, [open]);

  useEffect(() => {
    if (!mounted) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mounted]);

  // Encolhe o card (sem cortar nem gerar scroll) quando a tela é curta demais
  // pra exibi-lo por inteiro na escala natural. Calculada só na abertura e na
  // virada de orientação — nunca em "resize"/visualViewport, que dispara toda
  // hora no mobile quando a barra de endereço some/aparece ao arrastar o dedo,
  // o que fazia o banner encolher e "tremer" durante o toque.
  useLayoutEffect(() => {
    if (!mounted) return;
    const el = contentRef.current;
    if (!el) return;

    function updateScale() {
      if (!el) return;
      // innerHeight (não visualViewport) — não reage ao show/hide da barra
      // de endereço durante o toque, só à orientação real do dispositivo.
      const viewportHeight = window.innerHeight;
      const available = viewportHeight - 32;
      const natural = el.scrollHeight;
      setFitScale(natural > available ? available / natural : 1);
    }

    updateScale();
    window.addEventListener("orientationchange", updateScale);
    return () => window.removeEventListener("orientationchange", updateScale);
  }, [mounted]);

  if (!mounted) return null;

  return createPortal(
    <div
      onClick={onClose}
      className={`fixed inset-0 z-[100] flex items-center justify-center overflow-hidden overscroll-none bg-black/70 px-4 backdrop-blur-md transition-opacity duration-200 ${
        entered ? "opacity-100" : "opacity-0"
      }`}
      style={{ touchAction: "none" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-sm transition-all duration-200 ${entered ? "opacity-100" : "opacity-0"}`}
        style={{ transform: `scale(${entered ? fitScale : fitScale * 0.95})` }}
      >
        <div ref={contentRef} className="relative flex w-full flex-col items-center gap-3">
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="absolute -top-2 right-0 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white text-black shadow-lg active:opacity-70"
          >
            <X className="h-5 w-5" strokeWidth={2.5} />
          </button>

          <div
            className="w-full rounded-2xl border p-4 text-center shadow-2xl"
            style={{ borderColor: "#34d3994d", background: "linear-gradient(135deg, #059669, #065f46)" }}
          >
            <h2 className="text-lg font-extrabold leading-snug text-white">
              Espere! Você pode desbloquear a versão completa
            </h2>
            <p className="mt-1 text-xs leading-snug text-white/80">
              Por apenas mais <span className="font-bold text-white">R$ 10</span> você recebe todos os recursos e
              benefícios da versão premium.
            </p>
          </div>

          <PlanBanner
            variant="premium"
            badge="Mais Vendido"
            title="Completo"
            originalPrice="De R$ 37,90"
            price="27,90"
            items={PREMIUM_BENEFITS}
            ctaHref={CHECKOUT_URL_UPSELL}
            ctaText="Quero desbloquear tudo"
            onCtaClick={() => trackPixelEvent("InitiateCheckout", { currency: "BRL", value: 27.9 })}
          />

          <a
            href={CHECKOUT_URL_BASIC}
            onClick={() => trackPixelEvent("InitiateCheckout", { currency: "BRL", value: 17.9 })}
            className="flex w-full flex-col items-center gap-0.5 rounded-full py-3.5 text-sm font-bold text-white shadow-[0_12px_28px_-8px_rgba(15,23,42,0.6)] active:opacity-90"
            style={{ background: "linear-gradient(to right, #475569, #1e293b)" }}
          >
            <span className="flex items-center gap-1.5">
              Quero básico <ArrowRight className="h-4 w-4" />
            </span>
          </a>
        </div>
      </div>
    </div>,
    document.body,
  );
}
