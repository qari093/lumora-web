import type { BridgeRuntime, RuntimeConstellation } from "./types";

const OPPOSITES: Record<RuntimeConstellation, RuntimeConstellation> = {
  "Midnight Souls": "Neon Dreamers",
  "Neon Dreamers": "Midnight Souls",
  "Quiet Chaos": "Healing Humor",
  "Healing Humor": "Quiet Chaos",
  "Slow Fire": "Restless Voices",
  "Restless Voices": "Slow Fire"
};

export function buildBridgeRuntime(from: RuntimeConstellation, active: boolean): BridgeRuntime {
  return {
    active,
    from,
    to: OPPOSITES[from],
    anonymous: true,
    labelHidden: true
  };
}
