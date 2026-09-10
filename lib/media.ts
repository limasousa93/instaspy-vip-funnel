const AVATAR_OVERRIDES: Record<string, string> = {
  u2: "/11.png",
  u6: "/olivia-avatar.png.png",
  u7: "/okok.png",
};

export function avatarUrl(seed: string): string {
  return AVATAR_OVERRIDES[seed] ?? `https://i.pravatar.cc/150?u=${encodeURIComponent(seed)}`;
}

export function photoUrl(seed: string, width = 600, height = 750): string {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${width}/${height}`;
}
