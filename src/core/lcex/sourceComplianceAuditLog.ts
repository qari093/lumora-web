export type SourceComplianceAuditAction =
  | "ingested"
  | "verified"
  | "downgraded"
  | "restricted"
  | "blocked"
  | "manual-reviewed"
  | "approved"
  | "suppressed";

export type SourceComplianceAuditRecord = {
  id: string;
  sourceId: string;
  entityId?: string;
  action: SourceComplianceAuditAction;
  actor: "system" | "ops" | "legal" | "culture-guardians";
  reason?: string;
  region?: string;
  language?: string;
  createdAt: string;
  metadata?: Record<string, string | number | boolean>;
};

export const SOURCE_COMPLIANCE_AUDIT_LOG: SourceComplianceAuditRecord[] = [];

function buildAuditId(record: Omit<SourceComplianceAuditRecord, "id">): string {
  return [
    record.sourceId.trim(),
    record.action,
    record.actor,
    Date.parse(record.createdAt || new Date().toISOString()),
  ].join(":");
}

export function appendSourceComplianceAuditRecord(
  input: Omit<SourceComplianceAuditRecord, "id">
): SourceComplianceAuditRecord {
  const record: SourceComplianceAuditRecord = {
    ...input,
    id: buildAuditId(input),
    sourceId: input.sourceId.trim(),
    entityId: input.entityId?.trim(),
    reason: input.reason?.trim(),
    region: input.region?.trim().toLowerCase(),
    language: input.language?.trim().toLowerCase(),
  };

  SOURCE_COMPLIANCE_AUDIT_LOG.push(record);
  return record;
}

export function getSourceComplianceAuditRecords(
  sourceId: string
): SourceComplianceAuditRecord[] {
  const normalized = sourceId.trim();
  return SOURCE_COMPLIANCE_AUDIT_LOG.filter(
    (record) => record.sourceId === normalized
  );
}

export function hasSourceComplianceIssue(sourceId: string): boolean {
  return getSourceComplianceAuditRecords(sourceId).some((record) =>
    record.action === "downgraded" ||
    record.action === "restricted" ||
    record.action === "blocked" ||
    record.action === "suppressed"
  );
}
