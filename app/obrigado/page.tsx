import Link from "next/link";
import { Check } from "lucide-react";
import { OnboardingBackdrop, OnboardingLogo } from "@/components/onboarding/onboarding-card";

export default function ObrigadoPage() {
  return (
    <OnboardingBackdrop>
      <div className="flex flex-col items-center gap-6 text-center">
        <OnboardingLogo />

        <div
          className="flex h-24 w-24 items-center justify-center rounded-full"
          style={{ background: "linear-gradient(180deg, #2fe677, #1fb959)", boxShadow: "0 8px 30px rgba(37,211,102,0.45)" }}
        >
          <Check className="h-14 w-14 text-white" strokeWidth={3} />
        </div>

        <h1 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl">Obrigado pela sua compra! 🎉</h1>
        <p className="text-base text-white/60">Seu acesso ao Instagram Spy está pronto.</p>

        <Link
          href="/entrar"
          className="flex w-full items-center justify-center rounded-full py-3.5 text-base font-bold text-white active:opacity-90"
          style={{
            background: "linear-gradient(180deg, #2fe677, #1fb959)",
            boxShadow: "0 6px 18px rgba(37,211,102,0.4), inset 0 1px 0 rgba(255,255,255,0.3)",
          }}
        >
          Acessar meu produto
        </Link>
      </div>
    </OnboardingBackdrop>
  );
}
