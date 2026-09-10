import { Crown } from "lucide-react";

export function VipUnlockCard() {
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex items-center gap-3 rounded-2xl bg-black/80 p-3 backdrop-blur-sm">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/5">
          <Crown className="h-6 w-6 fill-amber-400 text-amber-400" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-base font-bold text-white">
            Seja <span className="text-amber-400">VIP</span>
          </p>
          <p className="text-xs leading-snug text-white/80">
            e desbloqueie todas as informações deste perfil.
          </p>
        </div>
        <div className="shrink-0 border-l border-white/20 pl-3 text-right">
          <p className="whitespace-nowrap text-sm font-bold text-white">
            R$ 27,90
          </p>
        </div>
      </div>
      <button className="w-full rounded-lg bg-green-500 py-2.5 text-sm font-bold text-white shadow-lg active:opacity-80">
        DESBLOQUEAR
      </button>
    </div>
  );
}

export function VipUnlockBanner() {
  return (
    <div className="absolute inset-x-[5%] top-1/2 -translate-y-1/2">
      <VipUnlockCard />
    </div>
  );
}
