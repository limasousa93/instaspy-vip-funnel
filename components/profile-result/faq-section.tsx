"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQ_ITEMS = [
  {
    question: "A ferramenta realmente funciona?",
    answer:
      "Sim! O InstaSpy utiliza tecnologia avançada para acessar dados do Instagram de forma completamente invisível. Milhares de usuários já confirmaram a eficácia da ferramenta.",
  },
  {
    question: "A pessoa vai saber que eu stalkeei o perfil dela?",
    answer:
      "Não! O acesso é 100% invisível. A pessoa não recebe nenhuma notificação e não há rastros de que você visualizou o perfil dela.",
  },
  {
    question: "Funciona em perfis privados?",
    answer:
      "Sim! O InstaSpy funciona em qualquer tipo de perfil, incluindo perfis privados, contas verificadas e perfis comerciais.",
  },
  {
    question: "Preciso instalar alguma coisa?",
    answer:
      "Não! O InstaSpy funciona totalmente na nuvem. Você só precisa acessar pelo navegador, sem precisar baixar ou instalar nada no seu dispositivo.",
  },
  {
    question: "Como funciona a garantia?",
    answer: "Oferecemos garantia de 30 dias. Se não ficar satisfeito, devolvemos 100% do seu dinheiro, sem perguntas.",
  },
  {
    question: "Quanto tempo tenho acesso?",
    answer:
      "O acesso é vitalício. Uma vez adquirido, você pode usar a ferramenta para sempre, sem mensalidades ou renovações.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-3">
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
