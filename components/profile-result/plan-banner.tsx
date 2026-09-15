import { ArrowRight, Check, Crown } from "lucide-react";

/**
 * Banner de plano no estilo "modelo banner" (cartão claro, cabeçalho em
 * degradê com badge flutuante e curva na base). Reutilizado para os planos
 * de R$ 37,90 e R$ 27,90 (variant="premium") e R$ 17,90 (variant="basic").
 *
 * Cores em hex puro (nunca `bg-violet-600`/`bg-gradient-to-r` do Tailwind):
 * essas utilities resolvem pra `var(--color-*)`/`linear-gradient(in oklab, ...)`
 * em oklch, que iOS Safari mais antigo não parseia — o navegador descarta o
 * background inteiro e o botão/banner fica sem cor. Mesmo motivo documentado
 * em app/globals.css pros botões `.spy-cta-button` etc.
 */
export function PlanBanner({
  badge,
  title,
  price,
  originalPrice,
  items,
  ctaHref,
  ctaText,
  ctaSubtext,
  onCtaClick,
  variant = "premium",
}: {
  badge?: string;
  title: string;
  price: string;
  originalPrice?: string;
  items: string[];
  ctaHref: string;
  ctaText: string;
  ctaSubtext?: string;
  onCtaClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  variant?: "premium" | "basic";
}) {
  const isPremium = variant === "premium";

  const headerGradient = isPremium
    ? "linear-gradient(135deg, #5b21b6, #4c1d95, #3b0764)"
    : "linear-gradient(135deg, #334155, #0f172a)";
  const ctaGradient = isPremium
    ? "linear-gradient(to right, #8b5cf6, #9333ea)"
    : "linear-gradient(to right, #475569, #1e293b)";

  return (
    <div
      className="w-full rounded-[28px] border bg-[#170f2b] shadow-[0_20px_45px_-15px_rgba(0,0,0,0.65)]"
      style={{ borderColor: "#8b5cf633" }}
    >
      <div className="relative rounded-t-[28px] rounded-b-[50%] pb-10 pt-8 text-center">
        <div
          aria-hidden
          className="absolute inset-0 overflow-hidden rounded-t-[28px] rounded-b-[50%]"
          style={{
            background: headerGradient,
            boxShadow: isPremium
              ? "inset 0 1px 0 rgba(255,255,255,0.1)"
              : "inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
        >
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
            style={{ backgroundColor: isPremium ? "#a78bfa40" : "#cbd5e126" }}
          />
        </div>
        {badge && (
          <span
            className="absolute -top-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-[#fbbf24] px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-wide text-[#0f172a] shadow-[0_6px_14px_-4px_rgba(0,0,0,0.5)]"
          >
            <Crown className="h-3.5 w-3.5 fill-[#0f172a]" /> {badge}
          </span>
        )}
        <p className="relative mt-3 text-2xl font-extrabold uppercase tracking-wide text-white sm:text-3xl">{title}</p>
        {originalPrice && (
          <p className="relative mt-1 text-sm font-bold text-white/50 line-through">{originalPrice}</p>
        )}
        <p className="relative mt-1 text-4xl font-extrabold text-white sm:text-5xl">
          <span className="align-top text-lg">R$</span> {price}
        </p>
      </div>

      <ul className="flex flex-col gap-3 px-5 py-5 text-left">
        {items.map((item) => (
          <li key={item} className="flex items-center gap-3">
            <span
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full shadow-sm"
              style={{ backgroundColor: isPremium ? "#7c3aed" : "#475569" }}
            >
              <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
            </span>
            <span className="text-sm font-medium text-white/85">{item}</span>
          </li>
        ))}
      </ul>

      <div className="px-5 pb-5">
        <a
          href={ctaHref}
          onClick={onCtaClick}
          className="flex w-full flex-col items-center gap-0.5 rounded-full py-3.5 text-sm font-bold text-white active:opacity-90"
          style={{
            background: ctaGradient,
            boxShadow: isPremium
              ? "0 12px 28px -8px rgba(124,58,237,0.75)"
              : "0 12px 28px -8px rgba(15,23,42,0.6)",
          }}
        >
          <span className="flex items-center gap-1.5">
            {ctaText} <ArrowRight className="h-4 w-4" />
          </span>
          {ctaSubtext && <span className="text-[11px] font-normal text-white/80">{ctaSubtext}</span>}
        </a>
      </div>
    </div>
  );
}
