import type { InboxSource, ProductionInboxItem } from "./types";

export function createProductionInboxItem(input: {
  userId: string;
  creatorId: string;
  source: InboxSource;
}): ProductionInboxItem {
  return {
    id: `inbox-${input.userId}-${input.creatorId}-${input.source}-${Date.now()}`,
    userId: input.userId,
    creatorId: input.creatorId,
    source: input.source,
    createdAt: new Date().toISOString(),
    read: false,
  };
}
