import { VIP_CHECKOUT_URL } from "./shared";

/** Barra fixa no topo (CTA flutuante) — some pra cima do conteúdo, sempre
 * visível enquanto o usuário rola a página. */
export function CountdownBar() {
  return (
    <div className="fixed inset-x-0 top-0 z-50 flex items-center justify-center border-b border-white/10 bg-black/90 px-4 py-2.5 backdrop-blur-sm">
      <a
        href={VIP_CHECKOUT_URL()}
        className="confirm-cta-button w-full max-w-xs rounded-full px-4 py-2.5 text-center text-sm font-bold text-white active:opacity-90"
      >
        Desbloquear Acesso Agora
      </a>
    </div>
  );
}
