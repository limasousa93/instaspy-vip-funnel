"use client";

import { useLastSearchedProfile } from "@/lib/instagram/last-searched-profile";

/**
 * Objeto único que a landing /resultado inteira consome (hero, card de
 * perfil, mídias, localização, stories, mensagens, oferta...). Nunca é
 * `null`: sem perfil pesquisado ainda (acesso direto à rota), cai num
 * fallback genérico em vez de cada componente precisar checar ausência.
 *
 * `avatar` é `null` quando não há foto real do Instagram do perfil
 * consultado — nesse caso o `ProfileAvatar` renderiza um círculo preto
 * permanente em vez de buscar uma foto de stock genérica como substituta.
 */
export interface ProfileResultData {
  username: string;
  name: string;
  avatar: string | null;
  followers: number;
  following: number;
  posts: number;
  bio: string;
}

const FALLBACK_USERNAME = "perfil";

const FALLBACK_PROFILE: ProfileResultData = {
  username: FALLBACK_USERNAME,
  name: "Perfil",
  avatar: null,
  followers: 1351,
  following: 705,
  posts: 27,
  bio: "",
};

export function useProfileResult(): ProfileResultData {
  const lastProfile = useLastSearchedProfile();
  if (!lastProfile) return FALLBACK_PROFILE;

  return {
    username: lastProfile.username,
    name: lastProfile.name ?? lastProfile.username,
    avatar: lastProfile.avatarUrl ?? null,
    followers: lastProfile.followers ?? FALLBACK_PROFILE.followers,
    following: lastProfile.following ?? FALLBACK_PROFILE.following,
    posts: lastProfile.posts ?? FALLBACK_PROFILE.posts,
    bio: lastProfile.bio ?? "",
  };
}
