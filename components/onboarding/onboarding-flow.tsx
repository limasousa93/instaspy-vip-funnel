"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AlertTriangle, ArrowRight, AtSign, Search } from "lucide-react";
import { useInstagram } from "@/hooks/useInstagram";
import { saveLastSearchedProfile } from "@/lib/instagram/last-searched-profile";
import { avatarUrl } from "@/lib/media";
import { OnboardingBackdrop, OnboardingBadges, OnboardingCard, OnboardingLogo } from "./onboarding-card";
import { OnboardingGlyph } from "./onboarding-glyph";
import { OnboardingLoadingScreen } from "./onboarding-loading-screen";
import { OnboardingCpuScreen } from "./onboarding-cpu-screen";

type Step = "intro" | "handle" | "preview" | "redirecting";

const GRADIENT_BUTTON =
  "flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 py-3.5 text-base font-bold text-white active:opacity-90";

const REDIRECT_DELAY_MS = 1400;

export function OnboardingFlow() {
  const router = useRouter();
  const { data, loading, error, search } = useInstagram();
  const [step, setStep] = useState<Step>("intro");
  const [handle, setHandle] = useState("");

  async function handleSubmitHandle(event: FormEvent) {
    event.preventDefault();
    const username = handle.trim().replace(/^@/, "");
    if (!username) return;
    setStep("preview");
    await search(username);
  }

  function handleConfirm() {
    if (!data) return;
    saveLastSearchedProfile({ username: data.profile.username, avatarUrl: data.profile.avatarUrl });
    setStep("redirecting");
  }

  // Tela após a confirmação do preview — transição curta antes de cair no
  // feed (não há mais nenhuma busca real pendente nesse ponto).
  useEffect(() => {
    if (step !== "redirecting") return;
    const timeout = window.setTimeout(() => router.push("/feed"), REDIRECT_DELAY_MS);
    return () => window.clearTimeout(timeout);
  }, [step, router]);

  if (step === "redirecting") {
    return <OnboardingCpuScreen text="Preparando seu acesso..." />;
  }

  // Tela 1 — landing.
  if (step === "intro") {
    return (
      <OnboardingBackdrop>
        <OnboardingCard>
          <OnboardingLogo />
          <h1 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl">
            Quer saber quantos seguidores um perfil do <span className="text-violet-400">Instagram</span> tem?
          </h1>
          <p className="mt-4 text-sm text-white/70">
            Descubra o número de seguidores públicos um perfil tem de forma <span className="text-violet-300">ética</span>.
          </p>
          <button onClick={() => setStep("handle")} className={`${GRADIENT_BUTTON} mt-7`}>
            <Search className="h-5 w-5" /> Buscar Agora
          </button>
          <OnboardingBadges />
        </OnboardingCard>
      </OnboardingBackdrop>
    );
  }

  // Tela 2 — captura do @.
  if (step === "handle") {
    return (
      <OnboardingBackdrop>
        <OnboardingCard>
          <OnboardingLogo />
          <h1 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl">
            O que seu perfil no <span className="text-violet-400">Instagram</span> tem?
          </h1>
          <p className="mt-4 text-sm text-white/70">
            Digite o @ do usuário que deseja e descubra quantos seguidores públicos ele tem, de forma{" "}
            <span className="text-violet-300">rápida e simples</span>.
          </p>
          <form onSubmit={handleSubmitHandle} className="mt-7">
            <div className="flex items-center gap-2 rounded-full border border-violet-500/50 bg-white/5 px-5 py-3.5">
              <AtSign className="h-5 w-5 shrink-0 text-violet-400" />
              <input
                autoFocus
                value={handle}
                onChange={(event) => setHandle(event.target.value)}
                placeholder="Ex: noticiadodia"
                aria-label="Username do Instagram"
                className="w-full min-w-0 bg-transparent text-left text-base text-white placeholder:text-white/40 focus:outline-none"
              />
            </div>
            <button type="submit" disabled={!handle.trim()} className={`${GRADIENT_BUTTON} mt-4 disabled:opacity-40`}>
              <Search className="h-5 w-5" /> Buscar Agora
            </button>
          </form>
          <OnboardingBadges />
        </OnboardingCard>
      </OnboardingBackdrop>
    );
  }

  // Carregamento da busca. A busca real na Apify não tem duração fixa:
  // enquanto `loading` for true (estado real do hook, não um timer
  // inventado — ver tela 4.md), mostramos essa tela; ela some sozinha
  // assim que os dados chegam ou a busca falha.
  const username = handle.trim().replace(/^@/, "");

  if (loading || (!data && !error)) {
    return <OnboardingLoadingScreen key={username} text={`Buscando @${username}`} />;
  }

  if (error || !data) {
    return (
      <OnboardingBackdrop>
        <OnboardingCard>
          <OnboardingLogo />
          <p className="text-base font-semibold text-white">{error ?? "Perfil não encontrado"}</p>
          <p className="mt-1 text-sm text-white/60">Verifique o @ digitado e tente novamente.</p>
          <button onClick={() => setStep("handle")} className={`${GRADIENT_BUTTON} mt-6`}>
            Tentar outro @
          </button>
        </OnboardingCard>
      </OnboardingBackdrop>
    );
  }

  // Tela 3 — preview do perfil buscado, dados já carregados.
  return (
    <OnboardingBackdrop>
      <OnboardingCard>
        <OnboardingGlyphHeading username={data.profile.username} />
        <div className="mt-5 flex items-center gap-5 text-left">
          <Image
            src={data.profile.avatarUrl ?? avatarUrl(data.profile.id)}
            alt={data.profile.username}
            width={84}
            height={84}
            preload
            className="h-[84px] w-[84px] shrink-0 rounded-full object-cover ring-2 ring-violet-500/50"
          />
          <div className="flex flex-1 justify-between text-center">
            <div>
              <p className="text-lg font-bold text-white">{data.profile.postsCount.toLocaleString("pt-BR")}</p>
              <p className="text-xs text-white/60">posts</p>
            </div>
            <div>
              <p className="text-lg font-bold text-white">{data.profile.followers.toLocaleString("pt-BR")}</p>
              <p className="text-xs text-white/60">seguidores</p>
            </div>
            <div>
              <p className="text-lg font-bold text-white">{data.profile.following.toLocaleString("pt-BR")}</p>
              <p className="text-xs text-white/60">seguindo</p>
            </div>
          </div>
        </div>
        {data.profile.bio && (
          <p className="mt-4 whitespace-pre-line text-left text-sm text-white/80">{data.profile.bio}</p>
        )}
        <div className="mt-6 flex items-start gap-2.5 rounded-2xl border border-violet-500/40 bg-violet-500/10 px-4 py-3 text-left">
          <AlertTriangle className="h-4 w-4 shrink-0 translate-y-0.5 text-violet-300" />
          <p className="text-xs text-violet-200">
            Limite de apenas 1 consulta por dispositivo, certifique-se que digitou o usuário corretamente.
          </p>
        </div>
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => setStep("handle")}
            className="flex flex-1 items-center justify-center gap-2 rounded-full border border-violet-500/50 py-3 text-sm font-bold text-white active:opacity-70"
          >
            <Search className="h-4 w-4" /> Buscar Agora
          </button>
          <button
            onClick={handleConfirm}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 py-3 text-sm font-bold text-white active:opacity-90"
          >
            Confirmar <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        <OnboardingBadges />
      </OnboardingCard>
    </OnboardingBackdrop>
  );
}

function OnboardingGlyphHeading({ username }: { username: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <OnboardingGlyph className="h-7 w-7 text-white" />
      <h1 className="text-xl font-extrabold text-white sm:text-2xl">
        Descubra <span className="text-violet-400">o Perfil do Instagram</span>
      </h1>
      <p className="text-sm text-white/70">
        Você deseja saber mais sobre o perfil <span className="font-semibold text-white">@{username}</span>?
      </p>
    </div>
  );
}
