import type { ShareLinkKind, ShareLinkRuntime } from "./types";

export function createShareLink(kind: ShareLinkKind, targetId: string): ShareLinkRuntime {
  return {
    kind,
    targetId,
    slug: `${kind}-${targetId}`.replace(/[^a-zA-Z0-9-]/g, "-").toLowerCase(),
  };
}
