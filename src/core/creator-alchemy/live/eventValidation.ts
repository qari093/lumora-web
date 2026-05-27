import type { CreatorAlchemyEvent } from "./types";
import { isQuietGiftType } from "@/src/core/creator-alchemy/economy";

export function validateCreatorAlchemyEvent(event: CreatorAlchemyEvent): boolean {
  if (!event.id || !event.creatorId || !event.viewerId || !event.videoId || !event.createdAt) return false;
  if (!["watch", "rewatch", "save", "linger", "quiet_gift", "completion"].includes(event.type)) return false;
  if (event.type === "quiet_gift" && (!event.giftType || !isQuietGiftType(event.giftType))) return false;
  if (typeof event.timestampSeconds === "number" && event.timestampSeconds < 0) return false;
  if (typeof event.durationMs === "number" && event.durationMs < 0) return false;
  return true;
}

export function sanitizeCreatorAlchemyEvents(events: readonly CreatorAlchemyEvent[]): CreatorAlchemyEvent[] {
  return events.filter(validateCreatorAlchemyEvent).slice(0, 1000);
}
