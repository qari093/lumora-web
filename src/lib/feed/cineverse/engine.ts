import { injectFomoContent, type FeedItem } from "@/lib/feed/fomo/engine";

export type CineVerseFeedItem = FeedItem & {
  cineverseHook?: {
    enabled: boolean;
    timelineId: string;
  };
};

export function injectCineVerseHooks(): CineVerseFeedItem[] {
  return injectFomoContent().map((item) => ({
    ...item,
    cineverseHook: item.type === "trailer"
      ? { enabled: true, timelineId: `cv_${item.id}` }
      : { enabled: false, timelineId: "" },
  }));
}
