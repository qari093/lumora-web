import type { UniversalShareObject } from "../foundation/types";

export function createUniversalShareDeepLink(
  share: UniversalShareObject,
  origin = "https://lumora.local",
): string {
  const base = origin.replace(/\/$/, "");
  const params = new URLSearchParams({
    id: share.id,
    source: share.sourcePortal,
    destination: share.destinationPortal,
    kind: share.kind,
  });

  return `${base}/share/open?${params.toString()}`;
}

export function createShareCopyText(share: UniversalShareObject, origin?: string): string {
  return `${share.title}\n${createUniversalShareDeepLink(share, origin)}`;
}
