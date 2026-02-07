export type VideosHealth = {
  ok: boolean;
  mode: "seed" | "live" | "shadow";
  items: number;
  ts: number;
};

export function getVideosHealth(): VideosHealth {
  const mode =
    (process.env.LUMORA_DATA_MODE as "seed" | "live" | "shadow") || "seed";

  // Seed-safe deterministic value
  const items = mode === "seed" ? 18 : 0;

  return {
    ok: true,
    mode,
    items,
    ts: Date.now(),
  };
}
