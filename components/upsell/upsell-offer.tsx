import type { ReactNode } from "react";
import { InstagramPlusWhatsApp } from "@/components/upsell/instagram-plus-whatsapp";

/** Conteúdo que muda entre as telas de oferta (/sell-1, /sell-2, /sell-3); o resto do funil é idêntico. */
export interface UpsellOffer {
  headline: ReactNode;
  /** "Faça o teste grátis." em verde e maiúsculo. */
  trialGreenUppercase?: boolean;
  /** Título do carrossel de depoimentos (padrão: "Resultados de quem já usou."). */
  testimonialsTitle?: string;
  /** Título do PlanBanner (padrão: "Atualização WhatsApp + Instagram"). */
  planTitle?: ReactNode;
  /** Botão do PlanBanner em verde. */
  greenPlanCta?: boolean;
  /** Botão cinza "Não quero" abaixo do CTA do PlanBanner: texto e destino. */
  decline?: { text: string; href: string };
  /** Ajustes do FAQ: respostas trocadas e perguntas removidas (chave = texto da pergunta). */
  faq?: { answers?: Record<string, string>; omit?: string[] };
  /** Oculta o "Faça o teste grátis." e o card de busca de WhatsApp (o mockup do celular já nasce revelado). */
  hideWhatsAppTrial?: boolean;
  /** Troca o título verde de cima do mockup por este texto, exibido abaixo dele. */
  belowPhoneText?: string;
  /** Ícone de presente com este texto embaixo, logo após `belowPhoneText`. */
  bonusText?: string;
  /** Oculta o título e o carrossel de depoimentos. */
  hideTestimonials?: boolean;
  /** Mockup do celular sem o cadeado/borrão de "teste grátis" (já revelado, sem precisar da busca). */
  phoneUnlocked?: boolean;
  /** Oculta a seção "Perguntas Frequentes". */
  hideFaq?: boolean;
  /** Oculta o botão verde "Atualizar e Desbloquear" no fim da página. */
  hideUnlockButton?: boolean;
  /** Ícone do selo no topo do card: coroa (padrão) ou triângulo de alerta amarelo. */
  badgeIcon?: "crown" | "alert";
  /** Texto opcional logo abaixo do título. */
  subtext?: string[];
  /** Aviso verde abaixo do título. */
  notice?: string;
  /** Valor numérico (BRL) enviado no evento InitiateCheckout. */
  price: number;
  /** Preço formatado, sem "R$" (ex: "19,90"). */
  priceLabel: string;
  /** Preço "de" já com "R$" (ex: "R$ 87,90"). */
  originalPriceLabel: string;
}

export const UPSELL_OFFER: UpsellOffer = {
  headline: (
    <>
      <span style={{ color: "#ff4141" }}>SUA COMPRA AINDA NÃO ESTÁ COMPLETA...</span>
    </>
  ),
  badgeIcon: "alert",
  hideUnlockButton: true,
  faq: {
    answers: {
      "O que muda com a nova atualização?":
        "Você terá acesso completo a todas as informações do whatsapp e do instagram do seu parceiro e ver tudo o que está fazendo em tempo real.",
    },
    omit: ["Por que preciso atualizar?"],
  },
  decline: { text: "Não Quero", href: "/sell-2" },
  greenPlanCta: true,
  planTitle: <InstagramPlusWhatsApp />,
  testimonialsTitle: "Resultados de quem atualizou para o completo",
  trialGreenUppercase: true,
  subtext: [
    "o que você acabou de ativar é apenas metade do sistema. a parte mais poderosa começa no próximo passo...",
    "existe uma função avançada do instaspy que pode te dar acesso ao whatsapp de qualquer pessoa",
  ],
  price: 37.9,
  priceLabel: "37,90",
  originalPriceLabel: "R$ 87,90",
};

// /sell-2 e /sell-3 compartilham a mesma página (visual e textos); só mudam
// o preço e o destino do botão "Não Quero".
function buildDownsellLayout(priceLabel: string): UpsellOffer {
  return {
    ...UPSELL_OFFER,
    headline: <span style={{ color: "#ff4141" }}>NÃO VÁ EMBORA AINDA!</span>,
    subtext: ["Essa é sua última oportunidade de ter acesso completo ao Whatsapp e Instagram"],
    hideWhatsAppTrial: true,
    belowPhoneText: `Adicione o InstaSpy Completo e acesse tudo pelo seu celular por apenas R$ ${priceLabel} e ganhe mais 1 Bônus.`,
    bonusText: "Bônus: Localização em tempo real",
    hideTestimonials: true,
    notice: undefined,
    hideFaq: true,
    phoneUnlocked: true,
    price: Number(priceLabel.replace(",", ".")),
    priceLabel,
  };
}

export const DOWNSELL_OFFER: UpsellOffer = {
  ...buildDownsellLayout("27,90"),
  decline: { text: "Não Quero", href: "/obrigado" },
};

export const CROSSELL_OFFER: UpsellOffer = {
  ...buildDownsellLayout("19,90"),
  headline: <span style={{ color: "#ff4141" }}>SUA TERCEIRA E ÚLTIMA CHANCE:</span>,
  subtext: ["Esse acesso completo nunca mais aparecerá para você."],
  belowPhoneText: "Acesso completo ao Whatsapp e Instagram por apenas R$ 19,90.",
  bonusText: undefined,
  decline: { text: "Não Quero", href: "/feed" },
};
