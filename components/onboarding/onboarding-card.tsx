import type { ReactNode } from "react";
import { ShieldCheck, Lock, Info } from "lucide-react";
import GatewayFlow from "@/components/ui/gateway-flow";
import { OnboardingGlyph } from "./onboarding-glyph";

// Fundo + moldura reaproveitados pelas 3 telas do funil de entrada (intro,
// @ do perfil, preview) — o fundo animado é o GatewayFlow (components/ui),
// o cartão por cima continua no mesmo visual roxo/preto das referências.
export function OnboardingBackdrop({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4 py-10">
      <GatewayFlow className="pointer-events-none absolute inset-0 h-full w-full" />
      <div className="relative w-full max-w-md">{children}</div>
    </div>
  );
}

export function OnboardingCard({ children }: { children: ReactNode }) {
  return (
    <div
      className="rounded-[28px] border border-violet-500/30 bg-black/70 px-6 py-8 text-center backdrop-blur-sm sm:px-9 sm:py-10"
      style={{ boxShadow: "0 0 60px -15px rgba(139,92,246,0.45)" }}
    >
      {children}
    </div>
  );
}

export function OnboardingLogo() {
  return (
    <div className="mb-6 flex flex-col items-center gap-2">
      <OnboardingGlyph className="h-9 w-9 text-white" />
      <p className="text-2xl font-extrabold text-white">
        Info <span className="text-violet-400">Perfil</span>
      </p>
      <p className="text-[11px] font-semibold tracking-[0.2em] text-white/50">
        BUSCA &middot; ANALISA &middot; DESCUBRA
      </p>
    </div>
  );
}

export function OnboardingBadges() {
  return (
    <div className="mt-7 flex items-center justify-center gap-3 text-xs text-white/70 sm:gap-4">
      <span className="flex items-center gap-1.5">
        <ShieldCheck className="h-4 w-4 text-violet-400" /> 100% Ético
      </span>
      <span className="h-4 w-px bg-white/15" />
      <span className="flex items-center gap-1.5">
        <Lock className="h-4 w-4 text-violet-400" /> Seguro
      </span>
      <span className="h-4 w-px bg-white/15" />
      <span className="flex items-center gap-1.5 text-left">
        <Info className="h-4 w-4 shrink-0 text-violet-400" /> Apenas para fins
        <br className="hidden" /> de informação
      </span>
    </div>
  );
}
