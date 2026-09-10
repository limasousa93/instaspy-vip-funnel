"use client";

import { useVipModal } from "@/lib/context/vip-modal-context";

export function FreeAccessWarningBanner() {
  const { openVipModal } = useVipModal();

  return (
    <div className="mb-4 px-4">
      <div className="overflow-hidden rounded-lg border-2 border-red-600">
        <div className="bg-red-600 py-2 text-center text-lg font-extrabold tracking-wide text-white">
          ATENÇÃO
        </div>
        <p className="bg-white px-3 py-3 text-center text-sm font-bold leading-snug text-black">
          Seu acesso grátis revela apenas 10% de informação. O perfil completo você desbloqueia no acesso VIP.
        </p>
      </div>
      <button
        onClick={openVipModal}
        className="mt-3 w-full rounded-lg bg-green-500 py-2.5 text-sm font-bold text-white shadow-lg active:opacity-80"
      >
        DESBLOQUEAR
      </button>
    </div>
  );
}
