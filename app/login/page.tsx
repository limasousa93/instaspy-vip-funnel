"use client";

import { useState } from "react";
import { AccountSwitcher } from "@/components/auth/account-switcher";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  const [step, setStep] = useState<"switcher" | "form">("switcher");

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      {step === "switcher" ? (
        <AccountSwitcher onPickAccount={() => setStep("form")} />
      ) : (
        <LoginForm onBack={() => setStep("switcher")} />
      )}
      <p className="fixed bottom-6 text-xs font-semibold text-muted-foreground">∞ Meta</p>
    </main>
  );
}
