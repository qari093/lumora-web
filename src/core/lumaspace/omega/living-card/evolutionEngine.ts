import type { LivingCardState } from "./types";
import { addLivingCardAsset } from "./livingCardEngine";

export type LivingCardEvolutionEvent =
  | "first_memory"
  | "first_bridge"
  | "mission_completed"
  | "guardian_glow"
  | "chronicle_published";

export function evolveLivingCard(card: LivingCardState, event: LivingCardEvolutionEvent): LivingCardState {
  const assetByEvent = {
    first_memory: { kind: "memory" as const, label: "First memory bloom", weight: 55 },
    first_bridge: { kind: "aura" as const, label: "First constellation bridge", weight: 65 },
    mission_completed: { kind: "mission" as const, label: "Mission light tendril", weight: 70 },
    guardian_glow: { kind: "aura" as const, label: "Guardian glow", weight: 85 },
    chronicle_published: { kind: "memory" as const, label: "Chronicle chapter", weight: 75 },
  }[event];

  return addLivingCardAsset(card, {
    id: `${card.ownerId}_${event}_${card.version + 1}`,
    ...assetByEvent,
  });
}
