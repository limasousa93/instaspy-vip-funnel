import type { ReactNode } from "react";
import Image from "next/image";
import { ShieldCheck, Lock, CheckCircle2 } from "lucide-react";
import GatewayFlow from "@/components/ui/gateway-flow";

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

// Faixa "pagamento confirmado", mesmo par de cores da Tela 4
// (fundo verde quase preto + texto verde neon + borda neon).
export function OnboardingTopBanner({ children }: { children: ReactNode }) {
  return (
    <div
      className="w-full border-b py-3.5 text-center text-[15px] font-bold tracking-[0.3px]"
      style={{ background: "#0a3d0a", color: "#00ff41", borderColor: "#00ff41" }}
    >
      {children}
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
    <div className="mb-6 flex justify-center">
      <Image
        src="/logo22.png"
        alt="InstaSpy"
        width={230}
        height={200}
        priority
        className="h-16 w-auto sm:h-20"
      />
    </div>
  );
}

export function OnboardingBadges() {
  return (
    <div className="mt-7 flex items-center justify-center gap-3 text-xs text-white/70 sm:gap-4">
      <span className="flex items-center gap-1.5">
        <ShieldCheck className="h-4 w-4 text-violet-400" /> 100% Anônimo
      </span>
      <span className="h-4 w-px bg-white/15" />
      <span className="flex items-center gap-1.5">
        <Lock className="h-4 w-4 text-violet-400" /> Sem Senha
      </span>
      <span className="h-4 w-px bg-white/15" />
      <span className="flex items-center gap-1.5 text-left">
        <CheckCircle2 className="h-4 w-4 shrink-0 text-violet-400" /> Teste
        <br className="hidden" /> Grátis
      </span>
    </div>
  );
}
