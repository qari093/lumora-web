import type {
  DiscoveryItem,
  DiscoveryLane
} from "../types";

const LANES: DiscoveryLane[] = [
  "viral",
  "fresh",
  "local",
  "calm"
];

export function isDiscoveryLane(
  value: string
): value is DiscoveryLane {
  return LANES.includes(value as DiscoveryLane);
}

export function validateDiscoveryItem(
  item: DiscoveryItem
): boolean {
  return Boolean(
    item.id &&
    item.title &&
    isDiscoveryLane(item.lane) &&
    Number.isFinite(item.score) &&
    Number.isFinite(item.createdAt)
  );
}
