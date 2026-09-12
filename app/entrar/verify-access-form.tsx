"use client";

import { useActionState } from "react";
import { verifyAccessAction } from "./actions";

const initialState = { error: undefined as string | undefined };

export function VerifyAccessForm() {
  const [state, formAction, pending] = useActionState(verifyAccessAction, initialState);

  return (
    <form action={formAction} className="mt-7 w-full">
      <div className="flex items-center gap-2 rounded-full border border-violet-500/50 bg-white/5 px-5 py-3.5">
        <input
          name="contact"
          autoFocus
          placeholder="E-mail ou celular usado na compra"
          aria-label="E-mail ou celular usado na compra"
          className="w-full min-w-0 bg-transparent text-left text-base text-white placeholder:text-white/40 focus:outline-none"
        />
      </div>
      {state.error && <p className="mt-3 text-sm font-semibold text-red-400">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="gradient-cta-button mt-4 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-base font-bold text-white active:opacity-90 disabled:opacity-40"
      >
        {pending ? "Verificando..." : "Acessar"}
      </button>
    </form>
  );
}
