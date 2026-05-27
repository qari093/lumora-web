import type { ModerationQueueItem } from "./types";
import { moderateCreatorAlchemyContent } from "./safetyModeration";

const QUEUE: ModerationQueueItem[] = [];

export function enqueueModerationItem(input: {
  id: string;
  source: ModerationQueueItem["source"];
  content: string;
  createdAt: string;
}): ModerationQueueItem {
  const item: ModerationQueueItem = {
    ...input,
    result: moderateCreatorAlchemyContent(input.content)
  };

  if (item.result.severity === "review" || item.result.severity === "block") {
    QUEUE.push(item);
  }

  return item;
}

export function getModerationQueue(): ModerationQueueItem[] {
  return [...QUEUE];
}
