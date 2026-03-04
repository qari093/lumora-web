export type ContentType = "ugc" | "trailer";
export type StorageTier = "HOT" | "WARM" | "ARCHIVE";

export type ArchivePolicy = Readonly<{
  version: 1;
  // Lifecycle guidance (implemented by R2 lifecycle rules in infra; here we enforce invariants + decisions)
  hotDays: number;            // keep HOT for N days
  warmDays: number;           // after HOT, keep WARM for M more days
  archiveAfterDays: number;   // move/mark ARCHIVE at this age
  deleteAfterDays?: number;   // optional deletion for UGC (trailers usually kept)
  allowPermanent: boolean;    // allow "never delete" objects
}>;

export const R2_ARCHIVE_POLICY_V1: ArchivePolicy = Object.freeze({
  version: 1,
  hotDays: 7,
  warmDays: 23,
  archiveAfterDays: 30,
  // UGC can be deletable later; trailers are treated as canonical engagement fuel.
  deleteAfterDays: 365,
  allowPermanent: true,
});

export type ArchiveDecision = Readonly<{
  tier: StorageTier;
  reason:
    | "age_hot"
    | "age_warm"
    | "age_archive"
    | "permanent"
    | "trailer_keep"
    | "delete_due";
  deleteEligible: boolean;
}>;

export type DecideArchiveInput = Readonly<{
  contentType: ContentType;
  createdAtMs: number;
  nowMs?: number;
  permanent?: boolean;
  policy?: ArchivePolicy;
}>;

function daysBetween(fromMs: number, toMs: number): number {
  return Math.max(0, Math.floor((toMs - fromMs) / (24 * 60 * 60 * 1000)));
}

/**
 * Pure decision function: used by infra orchestration and tests.
 * The actual R2 lifecycle rules are applied outside the app; this ensures app-side expectations match.
 */
export function decideArchiveTier(input: DecideArchiveInput): ArchiveDecision {
  const nowMs = typeof input.nowMs === "number" ? input.nowMs : Date.now();
  const policy = input.policy ?? R2_ARCHIVE_POLICY_V1;

  if (input.permanent && policy.allowPermanent) {
    return { tier: "HOT", reason: "permanent", deleteEligible: false };
  }

  // Trailers are treated as long-lived assets; never delete by policy.
  const isTrailer = input.contentType === "trailer";

  const ageDays = daysBetween(input.createdAtMs, nowMs);
  if (ageDays < policy.hotDays) {
    return { tier: "HOT", reason: "age_hot", deleteEligible: false };
  }
  if (ageDays < policy.hotDays + policy.warmDays) {
    return { tier: "WARM", reason: "age_warm", deleteEligible: false };
  }

  // Archive phase
  if (isTrailer) {
    return { tier: "ARCHIVE", reason: "trailer_keep", deleteEligible: false };
  }

  // UGC: archive after threshold; may become delete-eligible after deleteAfterDays.
  const del = typeof policy.deleteAfterDays === "number" ? policy.deleteAfterDays : undefined;
  if (typeof del === "number" && ageDays >= del) {
    return { tier: "ARCHIVE", reason: "delete_due", deleteEligible: true };
  }

  return { tier: "ARCHIVE", reason: "age_archive", deleteEligible: false };
}

/**
 * Enforce expected invariants for policy values.
 */
export function validateArchivePolicy(policy: ArchivePolicy): { ok: true } | { ok: false; error: string } {
  if (policy.version !== 1) return { ok: false, error: "unsupported_version" };
  if (policy.hotDays <= 0) return { ok: false, error: "hotDays_must_be_positive" };
  if (policy.warmDays < 0) return { ok: false, error: "warmDays_must_be_non_negative" };
  if (policy.archiveAfterDays < policy.hotDays) return { ok: false, error: "archiveAfterDays_too_small" };
  if (typeof policy.deleteAfterDays === "number" && policy.deleteAfterDays < policy.archiveAfterDays) {
    return { ok: false, error: "deleteAfterDays_before_archive" };
  }
  return { ok: true };
}
