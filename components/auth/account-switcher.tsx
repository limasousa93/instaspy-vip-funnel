"use client";

import { ChevronRight, Settings } from "lucide-react";
import Image from "next/image";
import { avatarUrl } from "@/lib/media";

const SAVED_ACCOUNTS = [
  { username: "ana.viajante", seed: "u1" },
  { username: "clockyagenda", seed: "clocky" },
  { username: "dra.alicemoreira", seed: "alice" },
];

export function AccountSwitcher({ onPickAccount }: { onPickAccount: () => void }) {
  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-foreground">Entrar no Instagram</h1>
        <Settings className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        {SAVED_ACCOUNTS.map((acc) => (
          <button
            key={acc.username}
            onClick={onPickAccount}
            className="flex w-full items-center justify-between rounded-md px-2 py-2 text-left hover:bg-accent"
          >
            <span className="flex items-center gap-3">
              <Image src={avatarUrl(acc.seed)} alt={acc.username} width={36} height={36} className="rounded-full" />
              <span className="text-sm text-foreground">{acc.username}</span>
            </span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        ))}
      </div>
      <button onClick={onPickAccount} className="w-full rounded-full bg-secondary py-2.5 text-sm text-foreground hover:bg-secondary/80">
        Usar outro perfil
      </button>
      <button onClick={onPickAccount} className="w-full rounded-full border border-primary py-2.5 text-sm font-medium text-primary hover:bg-primary/10">
        Criar nova conta
      </button>
    </div>
  );
}
