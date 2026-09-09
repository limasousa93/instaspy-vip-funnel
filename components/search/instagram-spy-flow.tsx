"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useInstagram } from "@/hooks/useInstagram";
import { saveLastSearchedProfile } from "@/lib/instagram/last-searched-profile";
import { FetchingProgressScreen } from "@/components/search/fetching-progress-screen";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { avatarUrl } from "@/lib/media";

type Step = "intro" | "handle" | "preview";

const GREEN_BUTTON = "w-full bg-green-600! text-white! hover:bg-green-700!";

export function InstagramSpyFlow() {
  const router = useRouter();
  const { data, loading, error, search } = useInstagram();
  const [step, setStep] = useState<Step>("intro");
  const [handle, setHandle] = useState("");

  async function handleConfirmHandle(event: FormEvent) {
    event.preventDefault();
    const username = handle.trim().replace(/^@/, "");
    if (!username) return;
    setStep("preview");
    await search(username);
  }

  function handleConfirmPreview() {
    if (!data) return;
    saveLastSearchedProfile({ username: data.profile.username, avatarUrl: data.profile.avatarUrl });
    router.push(`/${encodeURIComponent(data.profile.username)}`);
  }

  if (step === "preview" && loading) {
    return <FetchingProgressScreen key={handle} username={handle.trim().replace(/^@/, "")} />;
  }

  if (step === "preview" && (error || !data)) {
    return (
      <div className="mx-auto flex max-w-sm flex-col items-center gap-3 px-4 py-16 text-center">
        <p className="text-base font-semibold text-foreground">{error ?? "Perfil não encontrado"}</p>
        <p className="text-sm text-muted-foreground">Verifique o @ digitado e tente novamente.</p>
        <Button variant="outline" onClick={() => setStep("handle")}>
          Tentar outro @
        </Button>
      </div>
    );
  }

  if (step === "preview" && data) {
    return (
      <div className="mx-auto flex max-w-sm flex-col items-center gap-4 px-4 py-12 text-center">
        <Image
          src={data.profile.avatarUrl ?? avatarUrl(data.profile.id)}
          alt={data.profile.username}
          width={96}
          height={96}
          preload
          className="h-[96px] w-[96px] rounded-full object-cover"
        />
        <div>
          <p className="text-base font-semibold text-foreground">{data.profile.fullName}</p>
          <p className="text-sm text-muted-foreground">@{data.profile.username}</p>
        </div>
        <div className="flex gap-6 text-sm">
          <div>
            <p className="font-semibold text-foreground">{data.profile.postsCount.toLocaleString("pt-BR")}</p>
            <p className="text-muted-foreground">posts</p>
          </div>
          <div>
            <p className="font-semibold text-foreground">{data.profile.followers.toLocaleString("pt-BR")}</p>
            <p className="text-muted-foreground">seguidores</p>
          </div>
          <div>
            <p className="font-semibold text-foreground">{data.profile.following.toLocaleString("pt-BR")}</p>
            <p className="text-muted-foreground">seguindo</p>
          </div>
        </div>
        {data.profile.bio && (
          <p className="line-clamp-3 whitespace-pre-line text-sm text-foreground">{data.profile.bio}</p>
        )}
        <Button className={GREEN_BUTTON} onClick={handleConfirmPreview}>
          Confirmar
        </Button>
      </div>
    );
  }

  if (step === "handle") {
    return (
      <form onSubmit={handleConfirmHandle} className="mx-auto flex max-w-sm flex-col gap-4 px-4 py-16 text-center">
        <p className="text-sm font-semibold text-foreground">
          Digite o seu @ do Instagram para ter acesso às informações:
        </p>
        <Input
          value={handle}
          onChange={(event) => setHandle(event.target.value)}
          placeholder="@seu.usuario"
          aria-label="Username do Instagram"
        />
        <Button type="submit" disabled={!handle.trim()} className={GREEN_BUTTON}>
          Confirmar
        </Button>
      </form>
    );
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col items-center gap-4 px-4 py-16 text-center">
      <p className="text-lg font-semibold text-foreground">
        Quer saber quantos seguidores você tem e os primeiros posts do seu perfil?
      </p>
      <Button className={GREEN_BUTTON} onClick={() => setStep("handle")}>
        Sim, quero saber
      </Button>
    </div>
  );
}
