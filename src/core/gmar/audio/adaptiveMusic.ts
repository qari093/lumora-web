export type GmarMusicMode = "ambient" | "explore" | "combat";

export function resolveMusic(intensity: number): GmarMusicMode {
  const value = Number.isFinite(Number(intensity)) ? Number(intensity) : 0;
  if (value >= 80) return "combat";
  if (value >= 40) return "explore";
  return "ambient";
}
