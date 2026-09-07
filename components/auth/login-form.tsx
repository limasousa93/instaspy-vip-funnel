"use client";

import { ArrowLeft } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useAuth } from "@/lib/context/auth-context";

export function LoginForm({ onBack }: { onBack: () => void }) {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (identifier.trim() && password.trim()) login(identifier);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
      <div className="flex items-center gap-3">
        <button type="button" onClick={onBack} aria-label="Voltar">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <h1 className="text-lg font-semibold text-foreground">Entrar no Instagram</h1>
      </div>
      <input
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
        placeholder="Número de celular, nome de usuário ou email"
        className="w-full rounded-md border border-border bg-transparent px-3 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        placeholder="Senha"
        className="w-full rounded-md border border-border bg-transparent px-3 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
      />
      <button
        type="submit"
        disabled={!identifier.trim() || !password.trim()}
        className="w-full rounded-full bg-primary py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-50"
      >
        Entrar
      </button>
      <p className="text-center text-sm text-primary">Esqueceu a senha?</p>
      <button type="button" className="w-full rounded-full bg-secondary py-2.5 text-sm font-semibold text-blue-500 hover:bg-secondary/80">
        Entrar com o Facebook
      </button>
      <button type="button" className="w-full rounded-full border border-primary py-2.5 text-sm font-medium text-primary hover:bg-primary/10">
        Criar nova conta
      </button>
    </form>
  );
}
