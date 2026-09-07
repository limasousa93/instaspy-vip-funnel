import Image from "next/image";
import { avatarUrl } from "@/lib/media";
import type { User } from "@/lib/types";

export function ProfileHeader({ user }: { user: User }) {
  return (
    <div className="px-4 py-6 lg:px-0">
      <div className="flex items-center gap-8">
        <Image src={avatarUrl(user.id)} alt={user.username} width={88} height={88} className="rounded-full" />
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
      <div className="mt-4 flex gap-2">
        <button className="flex-1 rounded-lg bg-secondary py-1.5 text-sm font-semibold text-foreground">Editar</button>
        <button className="flex-1 rounded-lg bg-secondary py-1.5 text-sm font-semibold text-foreground">Compartilhar perfil</button>
      </div>
    </div>
  );
}
