"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Star } from "lucide-react";

interface Testimonial {
  text: string;
  name: string;
  avatar: string;
}

// Fotos aleatórias de homens/mulheres (randomuser.me), número fixo por item
// pra ficar determinístico entre servidor e cliente.
const TESTIMONIALS: Testimonial[] = [
  {
    text: "Eu vi tudo do celular da minha esposa. Fotos apagadas e mensagens enviadas: Quando vi o resultado fiquei em choque. Valeu cada centavo investido.",
    name: "Marcos S.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    text: "Eu sempre desconfiava de algo mas ele nunca deixava eu pegar o celular dele mas agora vi tudo.",
    name: "Camila R.",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    text: "O melhor é que dá pra ver os vídeos apagados.",
    name: "Juliana P.",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    text: "Ela nem sonha que eu tenho o instagram e whatsapp dela conectado comigo agora.",
    name: "Rafael T.",
    avatar: "https://randomuser.me/api/portraits/men/54.jpg",
  },
  {
    text: "Agora eu sei tudo que ela conversa com todo mundo.",
    name: "Bruno L.",
    avatar: "https://randomuser.me/api/portraits/men/77.jpg",
  },
];

const SLIDE_INTERVAL_MS = 5000;

/** Carrossel de depoimentos: avança automaticamente a cada 5s e volta pro início ao chegar no último. */
export function UpsellTestimonials() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setIndex((i) => (i + 1) % TESTIMONIALS.length);
    }, SLIDE_INTERVAL_MS);
    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-4">
      <p className="text-center text-2xl font-extrabold leading-tight text-white sm:text-3xl">
        Resultados de quem já usou.
      </p>

      <div className="w-full overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {TESTIMONIALS.map((testimonial, i) => (
            <div key={i} className="w-full shrink-0 px-1">
              <div
                className="flex flex-col gap-3 rounded-2xl border border-violet-500/30 bg-black/70 p-4 backdrop-blur-sm"
                style={{ boxShadow: "0 0 40px -15px rgba(139,92,246,0.4)" }}
              >
                <div className="flex items-center gap-3">
                  <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-white/10">
                    <Image src={testimonial.avatar} alt="" fill sizes="44px" className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-white">{testimonial.name}</p>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, starIndex) => (
                        <Star key={starIndex} className="h-3 w-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-left text-sm leading-snug text-white/85">{testimonial.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        {TESTIMONIALS.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all ${i === index ? "w-5 bg-violet-400" : "w-1.5 bg-white/25"}`}
          />
        ))}
      </div>
    </div>
  );
}
