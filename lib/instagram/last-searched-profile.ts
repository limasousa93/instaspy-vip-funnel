import { useEffect, useState } from "react";

const STORAGE_KEY = "ig-spy-last-profile";

export interface LastSearchedProfile {
  username: string;
  avatarUrl?: string;
}

export function saveLastSearchedProfile(profile: LastSearchedProfile): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // localStorage indisponível (modo privado, etc.) — sem problema, é só um detalhe visual do feed mock.
  }
}

export function getLastSearchedProfile(): LastSearchedProfile | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as LastSearchedProfile) : null;
  } catch {
    return null;
  }
}

/** Só retorna algo após montar no client — evita descompasso com o HTML gerado no servidor. */
export function useLastSearchedProfile(): LastSearchedProfile | null {
  const [profile, setProfile] = useState<LastSearchedProfile | null>(null);

  useEffect(() => {
    // localStorage só existe no client — não dá pra ler no initializer do
    // useState sem arriscar mismatch de hydration com o HTML do servidor.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProfile(getLastSearchedProfile());
  }, []);

  return profile;
}
