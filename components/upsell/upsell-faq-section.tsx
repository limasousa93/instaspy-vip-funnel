"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQ_ITEMS = [
  {
    question: "O que muda com a nova atualização?",
    answer:
      "A nova versão amplia a experiência da plataforma com recursos avançados integrados ao Instagram e WhatsApp, oferecendo uma versão mais completa e atualizada do sistema.",
  },
  {
    question: "Por que preciso atualizar?",
    answer:
      "Os novos recursos relacionados ao Instagram e WhatsApp estão disponíveis exclusivamente na versão atualizada. Seu acesso atual não inclui essas funcionalidades.",
  },
  {
    question: "Quanto custa para ativar a nova versão?",
    answer: "Para liberar a atualização completa, basta pagar uma taxa única de R$ 19,90.",
  },
  {
    question: "O acesso é liberado imediatamente?",
    answer:
      "Sim. Após a confirmação do pagamento, a atualização é ativada automaticamente e você recebe acesso imediato à nova versão da plataforma.",
  },
];

export function UpsellFaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <h2 className="text-center text-lg font-extrabold text-white sm:text-xl">Perguntas Frequentes</h2>
      <div className="flex flex-col gap-2">
        {FAQ_ITEMS.map((item, i) => {
          const open = openIndex === i;
          return (
            <div key={item.question} className="overflow-hidden rounded-xl border border-white/10 bg-[#0b0b0f]/90">
              <button
                onClick={() => setOpenIndex(open ? null : i)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-semibold text-white"
                aria-expanded={open}
              >
                {item.question}
                <ChevronDown className={`h-4 w-4 shrink-0 text-white/50 transition-transform ${open ? "rotate-180" : ""}`} />
              </button>
              {open && <p className="px-4 pb-3 text-xs text-white/60">{item.answer}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
