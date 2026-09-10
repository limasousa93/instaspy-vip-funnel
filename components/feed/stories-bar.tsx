"use client";

import Image from "next/image";
import { BlurredAvatar } from "@/components/ui/blurred-avatar";
import { photoUrl } from "@/lib/media";
import { useLastSearchedProfile } from "@/lib/instagram/last-searched-profile";
import { useVipModal } from "@/lib/context/vip-modal-context";
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
  const { openVipModal } = useVipModal();

  return (
    <div className="no-scrollbar momentum-scroll flex gap-4 overflow-x-auto border-b border-border px-4 py-4 lg:px-0">
      <button onClick={openVipModal} className="flex w-20 shrink-0 flex-col items-center gap-1 active:opacity-60">
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
        <button key={name} onClick={openVipModal} className="flex w-20 shrink-0 flex-col items-center gap-1.5 active:opacity-60">
          <div
            className={`relative rounded-full p-[3px] ${live ? "live-story-ring" : ""}`}
            style={
              closeFriends
                ? { backgroundColor: "#22c55e" }
                : { backgroundImage: "linear-gradient(45deg, #f58529, #dd2a7b, #8134af)" }
            }
          >
            <div className="rounded-full bg-background p-[2px]">
              {/* ana.souza (live) é a referência: sem blur, redonda perfeita
                  em qualquer navegador — nas demais, o blur fica só na
                  <Image> filha (ver BlurredAvatar) pra não quebrar o
                  arredondamento no Safari/Android. */}
              {live ? (
                <Image
                  src={image ?? photoUrl(`feed-story-${i}`, 150, 150)}
                  alt={name}
                  width={72}
                  height={72}
                  className="h-[72px] w-[72px] rounded-full object-cover"
                />
              ) : (
                <BlurredAvatar src={image ?? photoUrl(`feed-story-${i}`, 150, 150)} alt={name} size={72} />
              )}
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
