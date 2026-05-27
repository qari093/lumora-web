export type SupportCaseType = "refund" | "chargeback" | "invoice" | "gift_card" | "creator_payout" | "data_export";

export function createSupportCase(type: SupportCaseType, userId: string) {
  return {
    id: `case_${type}_${Date.now()}`,
    type,
    userId,
    status: "open" as const,
    createdAt: new Date().toISOString(),
  };
}

export function getSupportedLanguages(phase: 1 | 2 = 1) {
  return phase === 1 ? ["en"] : ["en", "de", "hi-ur", "es", "pt", "fr"];
}

export function canExportComplianceData(requestType: string) {
  return ["ledger", "tax", "gdpr", "audit"].includes(requestType);
}
