"use client";

import Image from "next/image";
import { photoUrl } from "@/lib/media";
import { useLastSearchedProfile } from "@/lib/instagram/last-searched-profile";
import { maskUsername } from "@/lib/format";

// Só a primeira bolinha é dado real (o último perfil buscado no funil).
// As demais são preenchimento visual — mockup, como o resto do clone —
// não representam seguidores nem qualquer outra pessoa real.
// `live` acrescenta a etiqueta "Ao vivo" + pulso (ver .live-story-ring em
// globals.css); `closeFriends` troca o anel padrão pelo verde de "melhores
// amigos" do Instagram, com a foto borrada.
const MOCK_STORY_NAMES: { name: string; live?: boolean; closeFriends?: boolean; image?: string }[] = [
  { name: "ana.souza", live: true, image: "/ana.souza.png" },
  { name: "bruno_lima", closeFriends: true },
  { name: "carla.mendes", closeFriends: true },
  { name: "diego.alves", closeFriends: true },
  { name: "elisa.reis" },
  { name: "fabio.costa" },
  { name: "giovanna_p" },
  { name: "hugo.matos" },
  { name: "ines_ferraz" },
  { name: "joao.pedro" },
  { name: "karen.dias" },
  { name: "lucas.melo" },
  { name: "marina_cruz" },
  { name: "nina.rocha" },
  { name: "otavio.lima" },
  { name: "paula.vieira" },
  { name: "quiteria_sz" },
  { name: "rafa.santos" },
  { name: "sofia.borges" },
];

export function StoriesBar() {
  const lastProfile = useLastSearchedProfile();
  const yourAvatar = lastProfile?.avatarUrl;
  const yourLabel = "Seu story";

  return (
    <div className="no-scrollbar momentum-scroll flex gap-4 overflow-x-auto border-b border-border px-4 py-4 lg:px-0">
      <button className="flex w-20 shrink-0 flex-col items-center gap-1 active:opacity-60">
        <div className="rounded-full bg-muted p-[3px]">
          <div className="rounded-full bg-background p-[2px]">
            <div className="h-[72px] w-[72px] overflow-hidden rounded-full bg-black">
              {/* Nunca mostra avatar mockup aqui: até o perfil real carregar do
                  localStorage, fica preto — evita o flash de uma foto falsa. */}
              {yourAvatar && (
                <Image
                  src={yourAvatar}
                  alt={yourLabel}
                  width={72}
                  height={72}
                  preload
                  className="h-full w-full object-cover"
                />
              )}
            </div>
          </div>
        </div>
        <span className="w-full truncate text-center text-xs text-muted-foreground">{yourLabel}</span>
      </button>
      {MOCK_STORY_NAMES.map(({ name, live, closeFriends, image }, i) => (
        <button key={name} className="flex w-20 shrink-0 flex-col items-center gap-1.5 active:opacity-60">
          <div
            className={`relative rounded-full p-[3px] ${live ? "live-story-ring" : ""}`}
            style={
              closeFriends
                ? { backgroundColor: "#3bd16f" }
                : { backgroundImage: "linear-gradient(45deg, #fbbf24, #ec4899, #9333ea)" }
            }
          >
            {/* overflow-hidden aqui (não no <Image>) porque Safari falha ao
                arredondar um elemento que também tem filter: blur() — o
                clipe precisa ficar num container sem blur. */}
            <div className="overflow-hidden rounded-full bg-background p-[2px]">
              <Image
                src={image ?? photoUrl(`feed-story-${i}`, 150, 150)}
                alt={name}
                width={72}
                height={72}
                className={`h-[72px] w-[72px] object-cover ${live ? "" : "blur-sm"}`}
              />
            </div>
            {live && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-pink-600 px-1.5 py-[1px] text-[10px] font-semibold text-white">
                Ao vivo
              </span>
            )}
          </div>
          <span className="w-full truncate text-center text-xs text-muted-foreground">{maskUsername(name)}</span>
        </button>
      ))}
    </div>
  );
}
