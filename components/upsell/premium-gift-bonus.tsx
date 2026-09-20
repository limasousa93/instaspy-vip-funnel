/**
 * Selo de bônus do bloco de preço: presente colorido (caixa degradê rosa→laranja,
 * fita e laço dourados) com o texto embaixo. Cores em hex puro (mesmo motivo
 * documentado em app/globals.css); ids dos gradientes prefixados pra não colidir.
 */
export function PremiumGiftBonus({ text }: { text: string }) {
  return (
    <div className="relative mt-4 flex flex-col items-center gap-1.5">
      <svg viewBox="0 0 64 64" className="h-12 w-12 drop-shadow-[0_6px_10px_rgba(0,0,0,0.45)]" aria-hidden>
        <defs>
          <linearGradient id="pgb-box" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ff6ec4" />
            <stop offset="1" stopColor="#ff8a3d" />
          </linearGradient>
          <linearGradient id="pgb-lid" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ff4fa3" />
            <stop offset="1" stopColor="#ff7a2f" />
          </linearGradient>
          <linearGradient id="pgb-gold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff2a8" />
            <stop offset="1" stopColor="#f5b301" />
          </linearGradient>
        </defs>
        {/* caixa */}
        <rect x="9" y="28" width="46" height="28" rx="4" fill="url(#pgb-box)" />
        {/* tampa */}
        <rect x="6" y="20" width="52" height="12" rx="4" fill="url(#pgb-lid)" />
        <rect x="6" y="20" width="52" height="4" rx="2" fill="#ffffff" opacity="0.25" />
        {/* fita vertical */}
        <rect x="28" y="20" width="8" height="36" fill="url(#pgb-gold)" />
        {/* laço */}
        <path d="M32 20 C22 6 8 12 16 20 C20 22 28 21 32 20Z" fill="url(#pgb-gold)" />
        <path d="M32 20 C42 6 56 12 48 20 C44 22 36 21 32 20Z" fill="url(#pgb-gold)" />
        <circle cx="32" cy="20" r="4.5" fill="#f5b301" />
        <circle cx="31" cy="19" r="1.6" fill="#fff2a8" />
      </svg>
      <p className="text-sm font-extrabold text-white sm:text-base">{text}</p>
    </div>
  );
}
