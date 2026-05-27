import type { MemorialGardenRuntime } from "./types";

export function buildMemorialGardenRuntime(input: {
  creatorId: string;
  verifiedConsent: boolean;
}): MemorialGardenRuntime {
  return {
    creatorId: input.creatorId,
    active: input.verifiedConsent,
    monetized: false,
    verifiedConsent: input.verifiedConsent
  };
}
