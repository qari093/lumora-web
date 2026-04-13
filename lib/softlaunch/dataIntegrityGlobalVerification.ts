export type IntegrityEntity = {
  id: string;
  type: string;
  checksum: string;
  valid: boolean;
};

export type DataIntegrityInput = {
  entities?: IntegrityEntity[] | null;
};

export type DataIntegrityResult =
  | {
      ok: true;
      verification: {
        total: number;
        valid: number;
        consistent: boolean;
      };
    }
  | { ok: false; reason: string };

export function evaluateDataIntegrityGlobalVerification(
  input: DataIntegrityInput
): DataIntegrityResult {
  const entities = Array.isArray(input.entities) ? input.entities : [];
  if (entities.length === 0) return { ok: false, reason: "missing_entities" };

  const ids = new Set<string>();
  let validCount = 0;

  for (const e of entities) {
    if (!e.id?.trim()) return { ok: false, reason: "missing_id" };
    if (ids.has(e.id)) return { ok: false, reason: "duplicate_id" };
    ids.add(e.id);

    if (!e.type?.trim()) return { ok: false, reason: "missing_type" };
    if (!/^[a-fA-F0-9]{8,128}$/.test(e.checksum || "")) {
      return { ok: false, reason: "invalid_checksum" };
    }

    if (e.valid) validCount += 1;
  }

  return {
    ok: true,
    verification: {
      total: entities.length,
      valid: validCount,
      consistent: validCount === entities.length,
    },
  };
}
