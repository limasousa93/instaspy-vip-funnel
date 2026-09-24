import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Check } from "lucide-react";
import { OnboardingBackdrop, OnboardingLogo } from "@/components/onboarding/onboarding-card";
import { SESSION_COOKIE_NAME, verifySession } from "@/lib/session/session";
import { ContinueForm } from "./continue-form";

export default async function ContinuarPage() {
  const cookieStore = await cookies();
  const session = await verifySession(cookieStore.get(SESSION_COOKIE_NAME)?.value);
  if (!session) redirect("/entrar");

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

        <h1 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl">Compra confirmada!</h1>

        <ContinueForm />
      </div>
    </OnboardingBackdrop>
  );
}
