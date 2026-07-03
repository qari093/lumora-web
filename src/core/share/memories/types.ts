import type { UniversalShareObject } from "../foundation/types";

export type LivingMemoryKind =
  | "memory_star"
  | "shared_garden"
  | "memory_constellation"
  | "journey_capsule"
  | "time_capsule"
  | "echo_memory"
  | "atmosphere_memory"
  | "shared_silence";

export type LivingMemoryMood =
  | "wonder"
  | "calm"
  | "joy"
  | "focus"
  | "dream"
  | "shadow"
  | "creator";

export type LivingMemoryVisibility = "private" | "shared" | "group" | "public";

export type MemoryStar = {
  id: string;
  shareId: string;
  title: string;
  mood: LivingMemoryMood;
  atmosphere: string;
  brightness: number;
  pulse: "still" | "soft" | "alive";
  passiveDiscovery: boolean;
  createdAt: string;
};

export type SharedGarden = {
  id: string;
  ownerId: string;
  title: string;
  flowers: MemoryStar[];
  atmosphere: string;
  growthScore: number;
};

export type MemoryConstellation = {
  id: string;
  title: string;
  stars: MemoryStar[];
  lines: Array<{ from: string; to: string; strength: number }>;
  contributors: string[];
};

export type JourneyCapsule = {
  id: string;
  title: string;
  memories: MemoryStar[];
  delivery: "now" | "scheduled" | "future";
  unlockAt?: string;
};

export type EchoShare = {
  id: string;
  shareId: string;
  voiceDurationSeconds: number;
  transcriptHint: string;
  expiresAt?: string;
};

export type AtmosphereShare = {
  id: string;
  shareId: string;
  mood: LivingMemoryMood;
  atmosphere: string;
  durationMs: number;
};

export type LivingMemoryTimelineItem = {
  id: string;
  at: string;
  kind: LivingMemoryKind;
  title: string;
  weight: number;
};

export type LivingMemoryRecord = {
  id: string;
  sourceShare: UniversalShareObject;
  kind: LivingMemoryKind;
  visibility: LivingMemoryVisibility;
  star: MemoryStar;
  echo?: EchoShare;
  atmosphere?: AtmosphereShare;
  timeline: LivingMemoryTimelineItem[];
};
