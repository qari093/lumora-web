export type FypHealth = {
  ok: boolean;
  mode: "seed" | "live" | "shadow";
  items: number;
  ts: number;
};

export function getFypHealth(): FypHealth {
  const mode =
    (process.env.LUMORA_DATA_MODE as "seed" | "live" | "shadow") || "seed";

  // Seed-safe deterministic value
  const items = mode === "seed" ? 24 : 0;

  return {
    ok: true,
    mode,
    items,
    ts: Date.now(),
  };
}
