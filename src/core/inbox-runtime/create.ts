import type { InboxItemKind, InboxItemRuntime } from "./types";

export function createInboxItem(input: { userId: string; creatorId: string; kind: InboxItemKind }): InboxItemRuntime {
  return {
    id: `inbox-${input.userId}-${input.creatorId}-${Date.now()}`,
    userId: input.userId,
    creatorId: input.creatorId,
    kind: input.kind,
    createdAt: new Date().toISOString(),
    read: false,
  };
}
