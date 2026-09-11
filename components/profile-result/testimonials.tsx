"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AlertTriangle } from "lucide-react";
import { avatarUrl } from "@/lib/media";
import { ResultCard } from "./shared";

// Mesma lógica de mascaramento do resto do app (lib/format.ts:
// maskUsername) — mantém os 4 primeiros caracteres reais e troca o resto
// por asteriscos, só que aqui com 7 "*" em vez de 3.
function maskTestimonialName(name: string): string {
  return `${name.slice(0, 4)}*******`;
}

const TESTIMONIALS = [
  {
    name: "marcosvianad",
    timeAgo: "1h",
    text: "Achei q era golpe mas testei mesmo assim. Paguei, o acesso foi imediato. Tava tudo lá: direct, fotos e até apagadas, até a localização funcionou. Valeu cada centavo.",
  },
  {
    name: "ana.ribeirox",
    timeAgo: "3h",
    text: "Desconfiada até o último minuto, mas funcionou certinho. Vi mensagens que ele jurava não existir. Recomendo demais.",
  },
  {
    name: "juli.santoss",
    timeAgo: "6h",
    text: "Rápido e discreto, ela nunca vai saber que eu vi o perfil. Melhor R$47 que já gastei.",
  },
  {
    name: "camila.rosad",
    timeAgo: "2h",
    text: "Descobri que ele conversava com outra. Acabou com todas as minhas dúvidas. Eu suspeitava de traição. Em poucos minutos encontrei o que precisava.",
  },
  {
    name: "patriciasilv",
    timeAgo: "5h",
    text: "Descobri mensagens escondidas e percebi que estava sendo enganada. Achava que era impressão minha.",
  },
];

export function Testimonials() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActive((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => window.clearInterval(interval);
  }, []);

  const testimonial = TESTIMONIALS[active];

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-center text-lg font-extrabold text-white sm:text-xl">
        Veja o que falam as pessoas <br className="sm:hidden" />
        que usam o Insta<span className="text-violet-400">Spy</span>
      </h2>
      <ResultCard>
        <div className="flex items-center gap-3">
          <Image
            src={avatarUrl(testimonial.name)}
            alt={testimonial.name}
            width={36}
            height={36}
            className="h-9 w-9 rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-bold text-white">{maskTestimonialName(testimonial.name)}</p>
            <p className="text-[11px] text-white/40">{testimonial.timeAgo}</p>
          </div>
        </div>
        <p className="mt-3 text-sm text-white/80">{testimonial.text}</p>
        <div className="mt-4 flex justify-center gap-1.5">
          {TESTIMONIALS.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 w-1.5 rounded-full transition-colors ${i === active ? "bg-violet-400" : "bg-white/20"}`}
            />
          ))}
        </div>
      </ResultCard>
      <div className="flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-left">
        <AlertTriangle className="h-4 w-4 shrink-0 translate-y-0.5 text-red-400" />
        <p className="text-xs text-red-300">
          As informações acessadas são extremamente sensíveis. Use com responsabilidade.
        </p>
      </div>
    </div>
  );
}
