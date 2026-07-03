import type { LivingMemoryRecord, LivingMemoryTimelineItem } from "./types";

export function createLivingMemoryTimeline(records: LivingMemoryRecord[]): LivingMemoryTimelineItem[] {
  return records
    .flatMap((record) => record.timeline)
    .sort((a, b) => Date.parse(a.at) - Date.parse(b.at));
}

export function appendTimelineItem(
  record: LivingMemoryRecord,
  item: Omit<LivingMemoryTimelineItem, "id" | "at">,
): LivingMemoryRecord {
  return {
    ...record,
    timeline: [
      ...record.timeline,
      {
        ...item,
        id: `timeline_${record.id}_${record.timeline.length + 1}`,
        at: new Date().toISOString(),
      },
    ],
  };
}
