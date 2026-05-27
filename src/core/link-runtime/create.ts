import type { LinkTargetKind, LumoraLink } from "./types";

export function createLumoraLink(input: { kind: LinkTargetKind; targetId: string }): LumoraLink {
  return {
    id: `${input.kind}-${input.targetId}`.replace(/[^a-zA-Z0-9-]/g, "-").toLowerCase(),
    kind: input.kind,
    targetId: input.targetId,
    createdAt: new Date().toISOString(),
  };
}
