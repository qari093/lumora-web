export type GmarAuditEntry = {
  id: string;
  category: "economy" | "resonance" | "fomo" | "mirror_hour";
  public: true;
  message: string;
};

export function createGmarAuditEntry(
  id: string,
  category: GmarAuditEntry["category"],
  message: string,
): GmarAuditEntry {
  return {
    id,
    category,
    public: true,
    message,
  };
}

export function auditEntryHealthy(entry: GmarAuditEntry): boolean {
  return entry.public && entry.id.length > 0 && entry.message.length > 0;
}
