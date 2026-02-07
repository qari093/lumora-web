export type GmarHealth = {
  ok: boolean;
  mode: "seed" | "live" | "shadow";
  games: number;
  ts: number;
};

export function getGmarHealth(): GmarHealth {
  const mode =
    (process.env.LUMORA_DATA_MODE as "seed" | "live" | "shadow") || "seed";

  // Seed-safe deterministic number (Astro Shooter + Zen Flow + placeholder)
  const games = mode === "seed" ? 3 : 0;

  return { ok: true, mode, games, ts: Date.now() };
}
