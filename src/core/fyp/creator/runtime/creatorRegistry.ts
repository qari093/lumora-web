import type { CreatorProfile } from "../types";

export function createCreatorProfile(
  id: string,
  handle: string
): CreatorProfile {
  return {
    id,
    handle,
    tier: "seed",
    reputation: 50,
    verified: false
  };
}
