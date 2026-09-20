import type { ReactNode } from "react";
import { LetterGlitch } from "@/components/ui/letter-glitch";

// Fundo exclusivo das telas de oferta (/upsell, /downsell, /crossell): mesmo
// LetterGlitch verde do /resultado, em vez do GatewayFlow roxo do
// OnboardingBackdrop compartilhado (que /entrar e as outras telas do funil
// continuam usando normalmente).
export function UpsellBackdrop({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4 py-10">
      <div className="pointer-events-none absolute inset-0 opacity-[0.15]">
        <LetterGlitch glitchSpeed={80} outerVignette smooth characters=". " />
      </div>
      <div className="relative w-full max-w-md">{children}</div>
    </div>
  );
}
