const WHATSAPP_ICON_PATH =
  "M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.86 9.86 0 0 0 12.04 2zm0 18.13h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.36c0-4.54 3.7-8.24 8.25-8.24a8.2 8.2 0 0 1 5.83 2.42 8.19 8.19 0 0 1 2.41 5.83c0 4.55-3.7 8.21-8.24 8.21zm4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.97-.14.17-.29.19-.53.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.24-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.15.16-.25.25-.42.08-.17.04-.31-.02-.43-.06-.12-.56-1.36-.77-1.86-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.24 3.74.59.26 1.06.41 1.42.52.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.14-1.18-.06-.11-.23-.17-.48-.29z";

const SUPPORT_WHATSAPP_URL = "https://wa.me/56986906796";

/**
 * Ícone de WhatsApp centralizado, com o rótulo "Suporte" embaixo, que abre a
 * conversa de suporte. Cores em hex puro (mesmo motivo documentado em app/globals.css).
 */
export function WhatsAppSupportButton() {
  return (
    <a
      href={SUPPORT_WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="mx-auto mt-6 flex w-fit flex-col items-center gap-1.5 active:scale-95"
    >
      <span
        className="flex h-11 w-11 items-center justify-center rounded-full"
        style={{
          background: "linear-gradient(180deg, #2fe677, #1fb959)",
          border: "2px solid rgba(255,255,255,0.35)",
          boxShadow:
            "0 6px 18px rgba(37,211,102,0.5), 0 0 24px rgba(37,211,102,0.3), inset 0 1px 0 rgba(255,255,255,0.4)",
        }}
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="#ffffff" aria-hidden>
          <path d={WHATSAPP_ICON_PATH} />
        </svg>
      </span>
      <span className="text-xs font-semibold text-white/70">Suporte</span>
    </a>
  );
}
