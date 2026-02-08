export type NexaRuntimeHealth = {
  ok: true;
  ts: number;
  service: "nexa";
  version: string;
};

export function getNexaRuntimeHealth(): NexaRuntimeHealth {
  return {
    ok: true,
    ts: Date.now(),
    service: "nexa",
    version: process.version,
  };
}

// Backward-compatible alias (in case any earlier code/tests referenced a different name)
export const getNexaHealth = getNexaRuntimeHealth;
