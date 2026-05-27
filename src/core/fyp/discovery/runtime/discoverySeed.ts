import type { DiscoveryItem } from "../types";

export function createDiscoverySeed(): DiscoveryItem[] {
  const now = Date.now();

  return [
    {
      id: "disc_viral_1",
      title: "Viral pulse seed",
      lane: "viral",
      score: 95,
      createdAt: now
    },
    {
      id: "disc_fresh_1",
      title: "Fresh signal seed",
      lane: "fresh",
      score: 88,
      createdAt: now
    },
    {
      id: "disc_local_1",
      title: "Local moment seed",
      lane: "local",
      score: 82,
      createdAt: now
    },
    {
      id: "disc_calm_1",
      title: "Calm reset seed",
      lane: "calm",
      score: 76,
      createdAt: now
    }
  ];
}
