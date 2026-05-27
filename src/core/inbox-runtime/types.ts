export type InboxItemKind = "post" | "premium_post" | "product_drop" | "live_event";

export interface InboxItemRuntime {
  id: string;
  userId: string;
  creatorId: string;
  kind: InboxItemKind;
  createdAt: string;
  read: boolean;
}
