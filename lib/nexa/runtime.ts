export type NexaHealth = {
  ok: boolean;
  mode: "seed" | "live" | "shadow";
  modules: number;
  ts: number;
};

export function getNexaHealth(): NexaHealth {
  const mode =
    (process.env.LUMORA_DATA_MODE as "seed" | "live" | "shadow") || "seed";

  // Seed-safe deterministic number (GX modules grid)
  const modules = mode === "seed" ? 12 : 0;

  return { ok: true, mode, modules, ts: Date.now() };
}
