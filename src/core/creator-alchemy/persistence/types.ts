import type { CreatorAlchemyEvent } from "@/src/core/creator-alchemy/live";

export interface StoredCreatorEvent extends CreatorAlchemyEvent {
  persistedAt: string;
}

export interface QuietGiftLedgerEntry {
  id: string;
  creatorId: string;
  viewerId: string;
  giftType: string;
  createdAt: string;
}

export interface ConstellationProfile {
  creatorId: string;
  constellation: string;
  confidence: number;
  updatedAt: string;
}
