"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const LIKES_KEY = "ig-clone-likes";
const FOLLOWS_KEY = "ig-clone-follows";

interface InteractionsContextValue {
  isLiked: (postId: string) => boolean;
  toggleLike: (postId: string) => void;
  isFollowing: (userId: string) => boolean;
  toggleFollow: (userId: string) => void;
}

const InteractionsContext = createContext<InteractionsContextValue | null>(null);

function readSet(key: string): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

export function InteractionsProvider({ children }: { children: ReactNode }) {
  const [likes, setLikes] = useState<Set<string>>(new Set());
  const [follows, setFollows] = useState<Set<string>>(new Set());

  useEffect(() => {
    // One-time hydration-safe read: localStorage doesn't exist during SSR,
    // so liked/followed state can only be known once mounted on the client.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLikes(readSet(LIKES_KEY));
    setFollows(readSet(FOLLOWS_KEY));
  }, []);

  function toggleLike(postId: string) {
    setLikes((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId);
      else next.add(postId);
      window.localStorage.setItem(LIKES_KEY, JSON.stringify([...next]));
      return next;
    });
  }

  function toggleFollow(userId: string) {
    setFollows((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) next.delete(userId);
      else next.add(userId);
      window.localStorage.setItem(FOLLOWS_KEY, JSON.stringify([...next]));
      return next;
    });
  }

  return (
    <InteractionsContext.Provider
      value={{
        isLiked: (postId) => likes.has(postId),
        toggleLike,
        isFollowing: (userId) => follows.has(userId),
        toggleFollow,
      }}
    >
      {children}
    </InteractionsContext.Provider>
  );
}

export function useInteractions(): InteractionsContextValue {
  const ctx = useContext(InteractionsContext);
  if (!ctx) throw new Error("useInteractions must be used within InteractionsProvider");
  return ctx;
}
