export type TransformationPublishingStatus =
  | "queued"
  | "approved"
  | "published"
  | "rejected"
  | "failed";

export type TransformationPublishingItem = {
  id: string;
  transformationType:
    | "trend-to-film"
    | "teaser-recap"
    | "mood-cinematic-edit"
    | "why-this-is-heating"
    | "fandom-pulse-recap";
  entityId: string;
  title: string;
  qualityScore: number;
  status: TransformationPublishingStatus;
  createdAt: string;
  scheduledAt?: string;
  publishedAt?: string;
};

export const TRANSFORMATION_PUBLISHING_QUEUE: TransformationPublishingItem[] = [];

export function enqueueTransformationForPublishing(
  item: TransformationPublishingItem
): void {
  TRANSFORMATION_PUBLISHING_QUEUE.push(item);
}

export function getQueuedTransformations(): TransformationPublishingItem[] {
  return TRANSFORMATION_PUBLISHING_QUEUE
    .filter((item) => item.status === "queued" || item.status === "approved")
    .sort((a, b) => {
      const qualityDelta = b.qualityScore - a.qualityScore;
      if (qualityDelta !== 0) return qualityDelta;
      return Date.parse(a.createdAt) - Date.parse(b.createdAt);
    });
}

export function markTransformationPublished(
  id: string
): TransformationPublishingItem | undefined {
  const item = TRANSFORMATION_PUBLISHING_QUEUE.find((entry) => entry.id === id);
  if (!item) return undefined;

  item.status = "published";
  item.publishedAt = new Date().toISOString();
  return item;
}
