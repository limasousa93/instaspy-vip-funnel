import { BrandMark } from "./shared";

export function ResultFooter() {
  return (
    <footer className="flex flex-col items-center gap-3 border-t border-white/10 pt-6 text-center">
      <BrandMark />
      <p className="max-w-xs text-[11px] leading-relaxed text-white/40">
        Ferramenta destinada a uso ético e responsável. O InstaSpy não se responsabiliza pelo uso indevido das
        informações acessadas.
      </p>
      <p className="text-[10px] text-white/25">© {new Date().getFullYear()} InstaSpy. Todos os direitos reservados.</p>
    </footer>
  );
}
