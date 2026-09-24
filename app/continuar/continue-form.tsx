"use client";

import { useFormStatus } from "react-dom";
import { refreshSession } from "./actions";

function ContinueButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full items-center justify-center rounded-full py-3.5 text-base font-bold text-white active:opacity-90 disabled:opacity-60"
      style={{
        background: "linear-gradient(180deg, #2fe677, #1fb959)",
        boxShadow: "0 6px 18px rgba(37,211,102,0.4), inset 0 1px 0 rgba(255,255,255,0.3)",
      }}
    >
      {pending ? "Verificando..." : "Continuar"}
    </button>
  );
}

export function ContinueForm() {
  return (
    <form action={refreshSession} className="w-full">
      <ContinueButton />
    </form>
  );
}
