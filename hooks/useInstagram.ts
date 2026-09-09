"use client";

import { useCallback, useState } from "react";
import type { User, Post, Reel } from "@/lib/types";

export interface InstagramData {
  profile: User;
  posts: Post[];
  reels: Reel[];
}

export function useInstagram() {
  const [data, setData] = useState<InstagramData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (username: string) => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await fetch(`/api/instagram/${encodeURIComponent(username)}`);
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Não foi possível buscar este perfil.");
        return;
      }
      setData(json);
    } catch {
      setError("Falha de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, search };
}
