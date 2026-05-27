export type InboxSource = "free_post" | "premium_post" | "product_drop" | "live_event";

export interface ProductionInboxItem {
  id: string;
  userId: string;
  creatorId: string;
  source: InboxSource;
  createdAt: string;
  read: boolean;
}
