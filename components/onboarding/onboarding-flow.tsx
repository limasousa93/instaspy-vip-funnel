"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowRight, AtSign, Eye, Search } from "lucide-react";
import { useInstagram } from "@/hooks/useInstagram";
import { saveLastSearchedProfile } from "@/lib/instagram/last-searched-profile";
import { ProfileAvatar } from "@/components/profile-result/shared";
import { OnboardingBackdrop, OnboardingBadges, OnboardingCard, OnboardingLogo } from "./onboarding-card";
import { OnboardingProcessingScreen } from "./onboarding-processing-screen";

type Step = "intro" | "handle" | "preview";

const GRADIENT_BUTTON =
  "gradient-cta-button flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-base font-bold text-white active:opacity-90";

const SEARCH_PROCESSING_DURATION_MS = 8000;

const ANALYZED_PROFILES_INITIAL_COUNT = 105_505;

// Contador da tela de intro: sobe e desce aleatoriamente pra parecer uma
// atividade ao vivo, a cada 4-6s (delay e direção sorteados a cada ciclo).
function useFluctuatingCount(initial: number) {
  const [count, setCount] = useState(initial);

  useEffect(() => {
    let timeoutId: number;
    function scheduleNext() {
      const delay = 4000 + Math.random() * 2000;
      timeoutId = window.setTimeout(() => {
        setCount((prev) => {
          const direction = Math.random() < 0.5 ? -1 : 1;
          const delta = Math.floor(Math.random() * 40) + 5;
          return prev + direction * delta;
        });
        scheduleNext();
      }, delay);
    }
    scheduleNext();
    return () => window.clearTimeout(timeoutId);
  }, []);

  return count;
}

export function OnboardingFlow() {
  const router = useRouter();
  const { data, loading, error, search } = useInstagram();
  const [step, setStep] = useState<Step>("intro");
  const [handle, setHandle] = useState("");
  const analyzedProfilesCount = useFluctuatingCount(ANALYZED_PROFILES_INITIAL_COUNT);
  // A busca real na API pode responder antes dos 8s do ciclo do
  // ProcessingCard; esse flag força a tela de loading a ficar visível pelo
  // tempo mínimo, mesmo que os dados cheguem antes.
  const [minSearchDelayDone, setMinSearchDelayDone] = useState(true);
  const minSearchDelayTimeoutRef = useRef<number | undefined>(undefined);

  async function handleSubmitHandle(event: FormEvent) {
    event.preventDefault();
    const username = handle.trim().replace(/^@/, "");
    if (!username) return;
    setStep("preview");
    setMinSearchDelayDone(false);
    if (minSearchDelayTimeoutRef.current) window.clearTimeout(minSearchDelayTimeoutRef.current);
    minSearchDelayTimeoutRef.current = window.setTimeout(
      () => setMinSearchDelayDone(true),
      SEARCH_PROCESSING_DURATION_MS,
    );
    await search(username);
  }

  function handleConfirm() {
    if (!data) return;
    saveLastSearchedProfile({
      username: data.profile.username,
      avatarUrl: data.profile.avatarUrl,
      name: data.profile.fullName,
      followers: data.profile.followers,
      following: data.profile.following,
      posts: data.profile.postsCount,
      bio: data.profile.bio,
    });
    router.push("/tela4");
  }

  // Tela 1 — landing.
  if (step === "intro") {
    return (
      <OnboardingBackdrop>
        <OnboardingCard>
          <OnboardingLogo />
          <h1 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl">
            Descubra o que seu <span className="text-violet-400">Parceiro</span> faz quando está no Instagram
          </h1>
          <p className="mt-4 text-sm text-white/70">
            Descubra a verdade sobre qualquer pessoa, acessando o <span className="text-violet-300">instagram</span> dela!
          </p>
          <button
            onClick={() => setStep("handle")}
            className="spy-cta-button mt-7 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-base font-bold text-white active:opacity-90"
          >
            <Eye className="eye-blink-icon h-5 w-5" /> Espionar Agora
          </button>
          <OnboardingBadges />
          <p className="mt-4 text-xs text-white/50">
            +{analyzedProfilesCount.toLocaleString("pt-BR")} perfis sendo analisados
          </p>
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
            Descubra o que seu <span className="text-violet-400">Parceiro</span> faz quando está no Instagram
          </h1>
          <p className="mt-4 text-sm text-white/70">
            Digite o nome de usuário da pessoa a ser espionada, sem o arroba &quot;@&quot;.
          </p>
          <form onSubmit={handleSubmitHandle} className="mt-7">
            <div className="flex items-center gap-2 rounded-full border border-violet-500/50 bg-white/5 px-5 py-3.5">
              <AtSign className="h-5 w-5 shrink-0 text-violet-400" />
              <input
                autoFocus
                value={handle}
                onChange={(event) => setHandle(event.target.value.replace(/@/g, ""))}
                placeholder="Ex: nomedoconjuge_10"
                aria-label="Username do Instagram"
                className="w-full min-w-0 bg-transparent text-left text-base text-white placeholder:text-white/40 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={!handle.trim()}
              className="spy-cta-button mt-4 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-base font-bold text-white active:opacity-90 disabled:opacity-40"
            >
              <Eye className="h-5 w-5" /> Espionar Agora
            </button>
          </form>
          <OnboardingBadges />
        </OnboardingCard>
      </OnboardingBackdrop>
    );
  }

  // Carregamento da busca. A busca real na Apify pode responder antes de 8s,
  // então `minSearchDelayDone` garante um piso de 8s nessa tela; se a busca
  // demorar mais que isso, a tela também continua (via `loading`/`!data`)
  // até os dados chegarem ou a busca falhar.
  if (loading || !minSearchDelayDone || (!data && !error)) {
    return <OnboardingProcessingScreen name="Buscando perfil" durationMs={SEARCH_PROCESSING_DURATION_MS} />;
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
          {data.profile.avatarUrl ? (
            <ProfileAvatar
              src={data.profile.avatarUrl}
              alt={data.profile.username}
              size={84}
              className="ring-2 ring-violet-500/50"
            />
          ) : (
            <div className="h-[84px] w-[84px] shrink-0 rounded-full bg-black ring-2 ring-violet-500/50" />
          )}
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
        <div className="mt-6 flex items-start gap-2.5 rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-left">
          <AlertTriangle className="h-4 w-4 shrink-0 translate-y-0.5 text-red-400" />
          <p className="text-xs text-red-300">
            Limite de apenas 1 pesquisa por dispositivo, certifique-se que digitou o usuário corretamente.
          </p>
        </div>
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => setStep("handle")}
            className="flex flex-1 items-center justify-center gap-2 rounded-full border border-violet-500/50 py-3 text-sm font-bold text-white active:opacity-70"
          >
            <Search className="h-4 w-4" /> Corrigir @
          </button>
          <button
            onClick={handleConfirm}
            className="confirm-cta-button flex flex-1 items-center justify-center gap-2 rounded-full py-3 text-sm font-bold text-white active:opacity-90"
          >
            Confirmar <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </OnboardingCard>
    </OnboardingBackdrop>
  );
}

function OnboardingGlyphHeading({ username }: { username: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <h1 className="text-xl font-extrabold text-white sm:text-2xl">
        Confirme <span className="text-violet-400">o Instagram</span>
      </h1>
      <p className="text-sm text-white/70">
        Você deseja espionar o perfil <span className="font-semibold text-white">@{username}</span>?
      </p>
    </div>
  );
}
