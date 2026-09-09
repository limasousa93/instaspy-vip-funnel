"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeft, Lock } from "lucide-react";
import { BlurredAvatar } from "@/components/ui/blurred-avatar";
import { avatarUrl, photoUrl } from "@/lib/media";
import { useLastSearchedProfile } from "@/lib/instagram/last-searched-profile";
import {
  spyNotifications,
  SPY_NOTIFICATION_GROUP_ORDER,
  type SpyNotification,
} from "@/lib/mock-data/spy-notifications";

function NotificationAvatar({ avatar }: { avatar: SpyNotification["avatar"] }) {
  if (avatar.kind === "locked") {
    return (
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary">
        <Lock className="h-4 w-4 text-muted-foreground" strokeWidth={2} />
      </div>
    );
  }
  if (avatar.kind === "pair") {
    return (
      <div className="relative h-11 w-11 shrink-0">
        <BlurredAvatar src={avatarUrl(avatar.seeds[1])} alt="" size={30} className="absolute right-0 top-0 ring-2 ring-background" />
        <BlurredAvatar src={avatarUrl(avatar.seeds[0])} alt="" size={30} className="absolute bottom-0 left-0 ring-2 ring-background" />
      </div>
    );
  }
  return <BlurredAvatar src={avatarUrl(avatar.seed)} alt="" size={44} />;
}

function NotificationRow({ n }: { n: SpyNotification }) {
  const [following, setFollowing] = useState(n.cta === "seguindo");

  return (
    <div className="flex items-start gap-3 py-2.5">
      <NotificationAvatar avatar={n.avatar} />
      <div className="min-w-0 flex-1">
        <p className="text-sm leading-snug text-foreground">
          {n.segments.map((seg, i) => (
            <span key={i} className={seg.bold ? "font-semibold text-foreground" : undefined}>
              {seg.text}
            </span>
          ))}
          <span className="text-muted-foreground"> {n.timeAgo}</span>
        </p>
      </div>
      {n.thumbnailSeed && (
        <div className="h-11 w-11 shrink-0 overflow-hidden rounded-md">
          <Image
            src={photoUrl(n.thumbnailSeed, 88, 88)}
            alt=""
            width={44}
            height={44}
            className="h-full w-full scale-125 object-cover blur-md"
          />
        </div>
      )}
      {n.cta === "testar" && (
        <button className="shrink-0 rounded-lg bg-blue-500 px-3.5 py-1.5 text-xs font-semibold text-white active:opacity-70">
          Testar
        </button>
      )}
      {(n.cta === "seguir" || n.cta === "seguindo") && (
        <button
          onClick={() => setFollowing((v) => !v)}
          className={`shrink-0 rounded-lg px-3.5 py-1.5 text-xs font-semibold active:opacity-70 ${
            following ? "bg-secondary text-foreground" : "bg-blue-500 text-white"
          }`}
        >
          {following ? "Seguindo" : "Seguir"}
        </button>
      )}
    </div>
  );
}

export function NotificationsScreen() {
  const router = useRouter();
  const lastProfile = useLastSearchedProfile();

  return (
    <div className="mx-auto max-w-3xl">
      <header className="flex items-center gap-4 px-4 py-3">
        <button onClick={() => router.back()} aria-label="Voltar" className="active:opacity-40">
          <ChevronLeft className="h-6 w-6 text-foreground" />
        </button>
        {/* Mesma regra do "Seu story"/"Sua nota": nunca mostra outro @ aqui —
            até o perfil real carregar do localStorage, fica só o fundo preto. */}
        {lastProfile ? (
          <span className="text-xl font-bold text-foreground">{lastProfile.username}</span>
        ) : (
          <span className="h-6 w-40 rounded bg-black" aria-hidden="true" />
        )}
      </header>
      <div className="px-4 pb-6">
        {SPY_NOTIFICATION_GROUP_ORDER.map((group) => {
          const items = spyNotifications.filter((n) => n.group === group);
          if (items.length === 0) return null;
          return (
            <div key={group} className="mb-4">
              <h3 className="mb-1 text-base font-semibold text-foreground">{group}</h3>
              <div>
                {items.map((n) => (
                  <NotificationRow key={n.id} n={n} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
