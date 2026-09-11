import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Check, Crown } from "lucide-react";
import { OnboardingBackdrop, OnboardingBadges, OnboardingCard, OnboardingLogo } from "@/components/onboarding/onboarding-card";
import { SESSION_COOKIE_NAME, verifySession } from "@/lib/session/session";

export default async function UpsellPage() {
  const cookieStore = await cookies();
  const session = await verifySession(cookieStore.get(SESSION_COOKIE_NAME)?.value);

  if (!session?.vip) redirect("/entrar");
  if (session.upsell) redirect("/feed");

  const upsellCheckoutUrl = process.env.NEXT_PUBLIC_CAKTO_CHECKOUT_URL_UPSELL ?? "#";

  return (
    <OnboardingBackdrop>
      <OnboardingCard>
        <OnboardingLogo />
        <Crown className="mx-auto h-10 w-10 fill-amber-400 text-amber-400" />
        <h1 className="mt-3 text-3xl font-extrabold leading-tight text-white sm:text-4xl">
          Desbloqueie <span className="text-violet-400">ainda mais</span>
        </h1>
        <p className="mt-4 text-sm text-white/70">
          Leve o pacote avançado e tenha acesso completo a recursos extras antes de entrar no app.
        </p>
        <div className="mt-7 flex flex-col gap-3">
          <a
            href={upsellCheckoutUrl}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 py-3.5 text-base font-bold text-white active:opacity-90"
          >
            <Check className="h-5 w-5" /> Quero desbloquear
          </a>
        </div>
        <OnboardingBadges />
      </OnboardingCard>
    </OnboardingBackdrop>
  );
}
