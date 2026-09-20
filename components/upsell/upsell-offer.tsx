import type { ReactNode } from "react";

/** Conteúdo que muda entre as telas de oferta (/upsell, /downsell, /crossell); o resto do funil é idêntico. */
export interface UpsellOffer {
  headline: ReactNode;
  notice: string;
  /** Valor numérico (BRL) enviado no evento InitiateCheckout. */
  price: number;
  /** Preço formatado, sem "R$" (ex: "19,90"). */
  priceLabel: string;
  /** Preço "de" já com "R$" (ex: "R$ 87,90"). */
  originalPriceLabel: string;
}

const NOTICE_BASE =
  "Além das buscas por Instagram, com a nova atualização você terá acesso a uma tecnologia avançada de análise por WhatsApp, capaz de puxar todas as conversas, áudios e vídeos de qualquer pessoa. Seu acesso atual não inclui essa nova tecnologia.";

export const UPSELL_OFFER: UpsellOffer = {
  headline: (
    <>
      Falta apenas ativar a <span className="text-violet-400">nova versão do sistema</span>.
    </>
  ),
  notice: `${NOTICE_BASE} Para ativar a versão mais recente e desbloquear todos os recursos disponíveis, basta pagar apenas a diferença de R$ 19,90.`,
  price: 19.9,
  priceLabel: "19,90",
  originalPriceLabel: "R$ 87,90",
};

export const DOWNSELL_OFFER: UpsellOffer = {
  headline: (
    <>
      Espera! <span className="text-violet-400">Última chance com desconto</span>
    </>
  ),
  notice: `${NOTICE_BASE} Para ativar a versão mais recente com desconto especial, basta pagar apenas R$ 27,90.`,
  price: 27.9,
  priceLabel: "27,90",
  originalPriceLabel: "R$ 67,90",
};

export const CROSSELL_OFFER: UpsellOffer = {
  headline: (
    <>
      Oferta especial — <span className="text-violet-400">só para você</span>
    </>
  ),
  notice: `${NOTICE_BASE} Para ativar a versão mais recente e desbloquear todos os recursos disponíveis, basta pagar apenas R$ 19,90.`,
  price: 19.9,
  priceLabel: "19,90",
  originalPriceLabel: "R$ 47,90",
};
