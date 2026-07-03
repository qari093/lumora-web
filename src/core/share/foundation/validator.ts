import type { UniversalShareObject } from "./types";

export type ShareValidationResult =
  | { ok: true }
  | { ok: false; errors: string[] };

export function validateUniversalShareObject(share: UniversalShareObject): ShareValidationResult {
  const errors: string[] = [];

  if (!share.id.startsWith("uso_")) errors.push("invalid_share_id");
  if (share.version !== "usl.v1") errors.push("invalid_version");
  if (!share.kind) errors.push("missing_kind");
  if (!share.sourcePortal) errors.push("missing_source_portal");
  if (!share.destinationPortal) errors.push("missing_destination_portal");
  if (!share.sourceObjectId.trim()) errors.push("missing_source_object_id");
  if (!share.title.trim()) errors.push("missing_title");
  if (!share.createdBy.trim()) errors.push("missing_created_by");
  if (!share.ownerId.trim()) errors.push("missing_owner_id");
  if (!share.integrityHash.startsWith("sha_")) errors.push("invalid_integrity_hash");
  if (!Array.isArray(share.metadata.tags)) errors.push("metadata_tags_must_be_array");
  if (share.telemetry.attempts < 0) errors.push("invalid_attempt_count");

  return errors.length ? { ok: false, errors } : { ok: true };
}
