export type FeedSourceType =
  | "safe-seed"
  | "official-teaser"
  | "metadata-fallback"
  | "trend-signal"
  | "editorial"
  | "transformation"
  | "participation";

export type FeedSourceRegistryEntry = {
  id: string;
  type: FeedSourceType;
  label: string;
  active: boolean;
  priority: number;
  trusted: boolean;
};

export const FEED_SOURCE_REGISTRY: FeedSourceRegistryEntry[] = [
  {
    id: "safe-seed",
    type: "safe-seed",
    label: "Safe Seed",
    active: true,
    priority: 10,
    trusted: true,
  },
  {
    id: "official-teaser",
    type: "official-teaser",
    label: "Official Teasers",
    active: true,
    priority: 20,
    trusted: true,
  },
  {
    id: "metadata-fallback",
    type: "metadata-fallback",
    label: "Metadata Fallback",
    active: true,
    priority: 30,
    trusted: true,
  },
  {
    id: "trend-signal",
    type: "trend-signal",
    label: "Trend Signals",
    active: true,
    priority: 40,
    trusted: true,
  },
  {
    id: "editorial",
    type: "editorial",
    label: "Editorial",
    active: true,
    priority: 50,
    trusted: true,
  },
  {
    id: "transformation",
    type: "transformation",
    label: "Lumora Transformations",
    active: true,
    priority: 60,
    trusted: true,
  },
  {
    id: "participation",
    type: "participation",
    label: "Participation",
    active: true,
    priority: 70,
    trusted: false,
  },
];

export function getActiveFeedSources(): FeedSourceRegistryEntry[] {
  return FEED_SOURCE_REGISTRY
    .filter((entry) => entry.active)
    .sort((a, b) => a.priority - b.priority);
}

export function getFeedSourceById(
  id: string
): FeedSourceRegistryEntry | undefined {
  return FEED_SOURCE_REGISTRY.find((entry) => entry.id === id);
}
