export type InternalShareLink = {
  entityType: "post" | "video" | "portal" | "room";
  entityId: string;
  slug?: string | null;
  href: string;
  internal: boolean;
};

export type ShareInternalLinkVerificationInput = {
  links?: InternalShareLink[] | null;
};

export type ShareInternalLinkVerificationResult =
  | {
      ok: true;
      verification: {
        total: number;
        internalCount: number;
        validCount: number;
        ready: boolean;
      };
    }
  | { ok: false; reason: string };

const ENTITY_TYPES = new Set(["post", "video", "portal", "room"]);

export function evaluateShareInternalLinkVerification(
  input: ShareInternalLinkVerificationInput
): ShareInternalLinkVerificationResult {
  const links = Array.isArray(input.links) ? input.links : [];
  if (links.length === 0) return { ok: false, reason: "missing_links" };

  let internalCount = 0;
  let validCount = 0;

  for (const link of links) {
    if (!ENTITY_TYPES.has(link.entityType)) return { ok: false, reason: "invalid_entity_type" };
    if (!link.entityId?.trim()) return { ok: false, reason: "missing_entity_id" };
    if (!link.href?.trim()) return { ok: false, reason: "missing_href" };
    if (!link.href.startsWith("/")) return { ok: false, reason: "invalid_href" };

    if (link.internal) internalCount += 1;
    if (link.internal && link.href.includes(link.entityId)) validCount += 1;
  }

  return {
    ok: true,
    verification: {
      total: links.length,
      internalCount,
      validCount,
      ready: internalCount === links.length && validCount === links.length,
    },
  };
}
