import { Check } from "lucide-react";
import type { ProfileResultData } from "@/lib/profile-result/use-profile-result";
import { trackPixelEvent } from "@/lib/pixel";
import { BrandMark, ResultCard, VIP_CHECKOUT_URL } from "./shared";

const BENEFITS = (name: string) => [
  `Todas as mensagens do direct de ${name}`,
  "Todas as fotos sem censura (incluindo apagadas)",
  "Localização em tempo real e locais que esteve",
  `Alerta sempre que ${name} interagir com alguém`,
  "2 bônus surpresa avaliados em R$120,00",
];

export function OfferSection({ profile }: { profile: ProfileResultData }) {
  return (
    <ResultCard className="flex flex-col items-center text-center">
      <BrandMark />
      <h2 className="mt-3 text-lg font-extrabold leading-snug text-white sm:text-xl">
        Com o Insta<span className="text-violet-400">Spy</span> você vai ter acesso completo ao instagram de{" "}
        {profile.name} por apenas:
      </h2>

      <div className="mt-4 w-full rounded-2xl border border-white/10 bg-black/40 p-4">
        <p className="text-xs text-white/40 line-through">De R$ 197,00</p>
        <p className="text-3xl font-extrabold text-violet-400 sm:text-4xl">
          R$ 27<span className="text-lg">,90</span>
        </p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[10px] text-white/50">
          <span className="flex items-center gap-1">
            <Check className="h-3 w-3 text-green-400" /> Pagamento único
          </span>
          <span className="flex items-center gap-1">
            <Check className="h-3 w-3 text-green-400" /> Acesso imediato
          </span>
          <span className="flex items-center gap-1">
            <Check className="h-3 w-3 text-green-400" /> Pagamento seguro
          </span>
        </div>
      </div>

      <ul className="mt-4 flex w-full flex-col gap-2 text-left">
        {BENEFITS(profile.name).map((benefit) => (
          <li key={benefit} className="flex items-start gap-2 rounded-xl bg-white/5 px-3 py-2 text-xs text-white/80">
            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-400" />
            {benefit}
          </li>
        ))}
      </ul>

      <a
        href={VIP_CHECKOUT_URL()}
        onClick={() => trackPixelEvent('InitiateCheckout', { currency: 'BRL', value: 27.90 })}
        className="spy-cta-button mt-5 flex w-full flex-col items-center gap-0.5 rounded-full py-3.5 text-sm font-bold text-white active:opacity-90"
      >
        Acessar tudo agora mesmo
        <span className="text-[11px] font-normal text-white/80">Compra 100% segura</span>
      </a>
    </ResultCard>
  );
}
