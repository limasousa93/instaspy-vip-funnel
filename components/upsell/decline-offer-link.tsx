import Link from "next/link";

/** Link discreto "Não quero" abaixo do funil de oferta — texto pequeno, cinza, sem destaque. */
export function DeclineOfferLink({ href, children }: { href: string; children: string }) {
  return (
    <div className="mt-6 text-center">
      <Link href={href} className="text-xs text-white/35 underline underline-offset-2 hover:text-white/50">
        {children}
      </Link>
    </div>
  );
}
