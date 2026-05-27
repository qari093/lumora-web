import type { QuietGiftType } from "@/src/core/creator-alchemy/economy";

export type CreatorAlchemyEventType =
  | "watch"
  | "rewatch"
  | "save"
  | "linger"
  | "quiet_gift"
  | "completion";

export interface CreatorAlchemyEvent {
  id: string;
  creatorId: string;
  viewerId: string;
  videoId: string;
  type: CreatorAlchemyEventType;
  timestampSeconds?: number;
  durationMs?: number;
  giftType?: QuietGiftType;
  createdAt: string;
}

export interface CreatorLiveAggregate {
  creatorId: string;
  events: CreatorAlchemyEvent[];
  totalEvents: number;
  quietGiftCount: number;
  silentReturnCount: number;
  strongestTimestamp?: number;
}
