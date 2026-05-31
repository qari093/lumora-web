import type { ContributionEvent, WarmthAura } from "./types";

export function sendLight(input: {
  actorId: string;
  targetId: string;
  targetType: ContributionEvent["targetType"];
  visibility?: ContributionEvent["visibility"];
}): ContributionEvent {
  if (!input.actorId.trim()) throw new Error("actorId_required");
  if (!input.targetId.trim()) throw new Error("targetId_required");

  return {
    id: `light_${input.actorId}_${input.targetId}_${Date.now()}`,
    kind: "light",
    actorId: input.actorId,
    targetId: input.targetId,
    targetType: input.targetType,
    visibility: input.visibility ?? "private",
    warmth: 10,
    createdAt: Date.now(),
  };
}

export function createWarmthAura(ownerId: string, events: ContributionEvent[]): WarmthAura {
  const warmth = Math.min(
    100,
    events.filter((event) => event.targetId === ownerId || event.actorId === ownerId)
      .reduce((sum, event) => sum + event.warmth, 0),
  );

  const level: WarmthAura["level"] =
    warmth >= 80 ? "radiant" :
    warmth >= 50 ? "glowing" :
    warmth >= 20 ? "soft" :
    "dim";

  return {
    ownerId,
    warmth,
    level,
    visibleTo: "inner_circle",
  };
}
