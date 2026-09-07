import Image from "next/image";
import { Plus, UserRoundPlus, TrendingUp } from "lucide-react";
import { avatarUrl } from "@/lib/media";
import type { User } from "@/lib/types";

export function ProfileHeader({ user }: { user: User }) {
  return (
    <div className="px-4 py-6 lg:px-0">
      <div className="flex items-center gap-8">
        <div className="relative shrink-0">
          <div className="absolute -top-3 left-0 z-10 whitespace-nowrap rounded-2xl border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground shadow-sm">
            O que você está pensando...
          </div>
          <Image src={avatarUrl(user.id)} alt={user.username} width={88} height={88} className="rounded-full" />
          <button
            aria-label="Adicionar ao story"
            className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-background ring-2 ring-background active:opacity-70"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={3} />
          </button>
        </div>
        <div className="flex flex-1 gap-8 text-center">
          <div>
            <p className="text-lg font-semibold text-foreground">{user.postsCount}</p>
            <p className="text-sm text-muted-foreground">posts</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">{user.followers.toLocaleString("pt-BR")}</p>
            <p className="text-sm text-muted-foreground">seguidores</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">{user.following}</p>
            <p className="text-sm text-muted-foreground">seguindo</p>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm font-semibold text-foreground">{user.fullName}</p>
        <p className="whitespace-pre-line text-sm text-foreground">{user.bio}</p>
      </div>
      <button className="mt-2 flex items-center gap-1.5 active:opacity-60">
        <svg viewBox="0 0 192 192" className="h-3.5 w-3.5 fill-foreground">
          <path d="M141.5 88.4c-.7-.3-1.4-.7-2.1-1 -1.2-31.2-18.3-49-46.9-49.2 -13.9-.1-25.5 3.3-33.6 15 -5.9 8.5-8.4 18.5-9 29.5l14.2 1c.5-8.4 2.3-16 6.4-21.9 5.4-7.8 13.5-9.9 22-9.8 18.6.1 27.6 11.1 28.3 32.1 -6.6-1.1-13.9-1.7-21.8-1.4 -22.2.8-38.6 12.9-37.6 32.4 1 20 20 29.7 39.6 28.9 16.9-.7 27.5-9.7 33.4-21.4 4.6 5.5 6.9 12.7 6.5 21.4 -.6 15.6-13.5 25.4-32.4 26.1 -21.8.8-38.6-9.1-40.4-26.5l-14.6 1.1c2.5 24.5 24.9 39.5 54.5 38.4 26.7-1 46.7-16.4 47.5-40.9C156.9 108 152.1 96.3 141.5 88.4zM97.1 128.5c-9.4.5-19.7-3.4-20.1-12.5 -.3-6.7 4.8-14.2 20.7-14.8 1.9-.1 3.7-.1 5.5-.1 5.9 0 11.5.6 16.5 1.6C118 116.6 109.4 127.8 97.1 128.5z" />
        </svg>
        <span className="text-sm text-muted-foreground">{user.username}</span>
      </button>
      <div className="mt-4 rounded-xl bg-secondary p-4">
        <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
          Seu painel
        </p>
        <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
          <TrendingUp className="h-3.5 w-3.5 text-green-500" />
          2,7 mil visualizações nos últimos 30 dias.
        </p>
      </div>
      <div className="mt-4 flex gap-2">
        <button className="flex-1 rounded-lg bg-secondary py-1.5 text-sm font-semibold text-foreground active:bg-secondary/70">Editar</button>
        <button className="flex-1 rounded-lg bg-secondary py-1.5 text-sm font-semibold text-foreground active:bg-secondary/70">Compartilhar perfil</button>
        <button aria-label="Convidar amigos" className="flex w-10 items-center justify-center rounded-lg bg-secondary active:bg-secondary/70">
          <UserRoundPlus className="h-4 w-4 text-foreground" />
        </button>
      </div>
    </div>
  );
}
