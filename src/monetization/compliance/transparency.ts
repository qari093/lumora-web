export type TransparencyLogEntry = {
  id: string;
  eventType: "ad_shown" | "zen_earned" | "zen_spent" | "creator_paid" | "ad_blocked";
  actorId: string;
  reason: string;
  createdAt: string;
};

export function createTransparencyLogEntry(input: Omit<TransparencyLogEntry, "createdAt"> & { createdAt?: string }) {
  return {
    ...input,
    createdAt: input.createdAt || new Date().toISOString(),
  };
}
