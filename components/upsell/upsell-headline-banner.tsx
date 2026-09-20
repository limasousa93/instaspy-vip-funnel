import type { ReactNode } from "react";
import { ChevronRight, Settings, TriangleAlert, Zap } from "lucide-react";

// Banner claro do topo do /upsell (modelo "headline upsell"). Cores em hex puro
// (mesmo motivo documentado em app/globals.css: Safari antigo não parseia
// oklch/oklab do Tailwind).
const NAVY = "#0b0b2b";
const BLUE = "#1d4ed8";
const MUTED = "#64748b";
const YELLOW = "#f7c81b";
const YELLOW_GRADIENT = "linear-gradient(180deg, #fde84a, #f7c81b)";
const CARD_STYLE = {
  background: "#ffffff",
  border: "1px solid rgba(15,23,42,0.06)",
  boxShadow: "0 8px 24px -8px rgba(15,23,42,0.12)",
};

const WHATSAPP_ICON_PATH =
  "M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.86 9.86 0 0 0 12.04 2zm0 18.13h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.36c0-4.54 3.7-8.24 8.25-8.24a8.2 8.2 0 0 1 5.83 2.42 8.19 8.19 0 0 1 2.41 5.83c0 4.55-3.7 8.21-8.24 8.21zm4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.97-.14.17-.29.19-.53.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.24-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.15.16-.25.25-.42.08-.17.04-.31-.02-.43-.06-.12-.56-1.36-.77-1.86-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.24 3.74.59.26 1.06.41 1.42.52.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.14-1.18-.06-.11-.23-.17-.48-.29z";

const ICON_BOX = "flex h-11 w-11 shrink-0 items-center justify-center sm:h-12 sm:w-12";
const ICON_GLYPH = "h-6 w-6 sm:h-7 sm:w-7";

function InstagramIcon() {
  return (
    <div
      className={`${ICON_BOX} rounded-xl`}
      style={{ background: "linear-gradient(45deg, #fdc830 0%, #f5364d 45%, #b02fc5 75%, #4f5bd5 100%)" }}
    >
      <svg viewBox="0 0 24 24" className={ICON_GLYPH} fill="none" stroke="#fff" strokeWidth="2">
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="1" fill="#fff" stroke="none" />
      </svg>
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <div className={`${ICON_BOX} rounded-full`} style={{ background: "#25D366" }}>
      <svg viewBox="0 0 24 24" className={ICON_GLYPH} fill="#fff">
        <path d={WHATSAPP_ICON_PATH} />
      </svg>
    </div>
  );
}

function GearIcon() {
  return (
    <div className={`${ICON_BOX} rounded-xl`} style={{ background: "linear-gradient(180deg, #7c9cf5, #5a78e6)" }}>
      <Settings className={`${ICON_GLYPH} text-white`} />
    </div>
  );
}

function StepCard({ icon, step, children }: { icon: ReactNode; step: string; children: ReactNode }) {
  return (
    <div className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 md:w-auto md:flex-1" style={CARD_STYLE}>
      {icon}
      <div className="min-w-0 text-left">
        <p className="text-[11px] font-medium uppercase tracking-wide sm:text-xs" style={{ color: MUTED }}>
          {step}
        </p>
        <p className="text-sm font-extrabold leading-tight sm:text-base" style={{ color: NAVY }}>
          {children}
        </p>
      </div>
    </div>
  );
}

function StepArrow() {
  return <ChevronRight className="h-5 w-5 shrink-0 rotate-90 md:rotate-0" style={{ color: "#94a3b8" }} />;
}

export function UpsellHeadlineBanner() {
  return (
    <section
      className="relative w-full overflow-hidden rounded-3xl px-4 py-6 text-center sm:px-8 sm:py-8"
      style={{ background: "#f8f9fd" }}
    >
      {/* Manchas decorativas dos cantos (amarelo no topo direito, azul embaixo à esquerda) */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full sm:h-56 sm:w-56"
        style={{ background: "radial-gradient(circle, #fde84a 0%, rgba(253,232,74,0) 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 -left-20 h-52 w-52 rounded-full sm:h-64 sm:w-64"
        style={{ background: "radial-gradient(circle, #8ea2f5 0%, rgba(142,162,245,0) 70%)" }}
      />

      <div className="relative flex flex-col items-center gap-5 sm:gap-6">
        {/* Aviso de tempo */}
        <div
          className="flex max-w-full flex-wrap items-center justify-center gap-x-3 gap-y-2 rounded-[22px] px-4 py-2.5 sm:rounded-full sm:px-6"
          style={{ background: "#0a0a0a", border: `2px solid ${YELLOW}` }}
        >
          <TriangleAlert className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" style={{ color: YELLOW }} />
          <span className="hidden h-5 w-px bg-white/40 sm:block" />
          <span className="text-xs font-bold uppercase text-white sm:text-base">
            Importante: essa página sairá do ar em
          </span>
          <span
            className="rounded-full px-3 py-1 text-xs font-extrabold sm:text-base"
            style={{ background: YELLOW_GRADIENT, color: "#0a0a0a" }}
          >
            10min
          </span>
        </div>

        {/* Passos */}
        <div className="flex w-full flex-col items-center gap-2 md:flex-row md:gap-3">
          <StepCard icon={<InstagramIcon />} step="Passo 1:">
            Acesso Instagram
          </StepCard>
          <StepArrow />
          <StepCard icon={<WhatsAppIcon />} step="Passo 2:">
            Acesso ao Whatsapp + Instagram
          </StepCard>
          <StepArrow />
          <StepCard icon={<GearIcon />} step="Passo 3:">
            Compra concluída!
          </StepCard>
        </div>

        {/* Mensagem principal */}
        <div className="flex flex-col items-center gap-1">
          <p className="flex items-center gap-2 text-lg font-extrabold sm:text-2xl" style={{ color: NAVY }}>
            <span
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-black sm:h-7 sm:w-7"
              style={{ background: YELLOW, color: "#fff" }}
            >
              !
            </span>
            Sua compra ainda não está completa...
          </p>
          <p className="text-xs sm:text-base" style={{ color: MUTED }}>
            Você não verá esta página novamente.
          </p>
        </div>

        <h2 className="text-2xl font-black uppercase leading-[1.1] sm:text-4xl md:text-5xl" style={{ color: NAVY }}>
          O que você acabou de ativar é apenas <span style={{ color: BLUE }}>metade do sistema.</span>
        </h2>
        <p className="-mt-2 text-xs font-medium uppercase sm:text-base" style={{ color: MUTED }}>
          A parte mais poderosa começa no próximo passo...
        </p>

        <span className="h-[3px] w-24 rounded-full sm:w-32" style={{ background: YELLOW }} />

        {/* Destaque */}
        <div
          className="flex w-full max-w-2xl items-center justify-center gap-3 rounded-[28px] px-5 py-3 sm:gap-4 sm:rounded-full sm:px-8"
          style={{ background: YELLOW_GRADIENT, boxShadow: "0 8px 20px -6px rgba(247,200,27,0.6)" }}
        >
          <Zap className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" style={{ color: NAVY }} fill={NAVY} />
          <span className="h-8 w-px shrink-0" style={{ background: "rgba(10,10,10,0.2)" }} />
          <p className="text-xs uppercase leading-snug sm:text-sm" style={{ color: "#0a0a0a" }}>
            Existe uma função avançada do InstaSpy que pode te dar
            <br className="hidden sm:block" />{" "}
            <span className="font-extrabold">acesso ao WhatsApp de qualquer pessoa</span>
          </p>
        </div>

        <p className="text-xs font-semibold uppercase tracking-[0.2em] sm:text-sm" style={{ color: MUTED }}>
          Faça o teste grátis e veja
        </p>
      </div>
    </section>
  );
}
