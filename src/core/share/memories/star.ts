import type { UniversalShareObject } from "../foundation/types";
import type { LivingMemoryMood, MemoryStar } from "./types";

function normalizeMood(value: unknown): LivingMemoryMood {
  const mood = String(value || "wonder");
  if (["wonder", "calm", "joy", "focus", "dream", "shadow", "creator"].includes(mood)) {
    return mood as LivingMemoryMood;
  }
  return "wonder";
}

export function createMemoryStar(share: UniversalShareObject): MemoryStar {
  const metadata = share.metadata as Record<string, unknown>;
  const mood = normalizeMood(metadata?.mood);
  const atmosphere = typeof metadata?.atmosphere === "string" ? metadata.atmosphere : `${mood}-atmosphere`;

  return {
    id: `memory_star_${share.id}`,
    shareId: share.id,
    title: share.title,
    mood,
    atmosphere,
    brightness: mood === "wonder" ? 0.92 : mood === "calm" ? 0.72 : 0.82,
    pulse: mood === "calm" ? "soft" : "alive",
    passiveDiscovery: true,
    createdAt: new Date().toISOString(),
  };
}

export function evolveMemoryStar(star: MemoryStar, interactionWeight: number): MemoryStar {
  const brightness = Math.min(1, Number((star.brightness + interactionWeight * 0.08).toFixed(4)));

  return {
    ...star,
    brightness,
    pulse: brightness >= 0.88 ? "alive" : brightness >= 0.58 ? "soft" : "still",
  };
}
