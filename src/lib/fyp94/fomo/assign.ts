import type { Fyp94FomoItem, Fyp94FomoType } from "./types";

export const FYP94_FOMO_DISTRIBUTION: Record<Fyp94FomoType, number> = {
  normal: 0.7,
  expiring_spotlight: 0.15,
  countdown_unlock: 0.1,
  sequence_chain: 0.05,
};

export function assignFyp94FomoType(index: number, total: number): Fyp94FomoType {
  const ratio = total <= 0 ? 0 : index / total;
  if (ratio < FYP94_FOMO_DISTRIBUTION.sequence_chain) return "sequence_chain";
  if (ratio < FYP94_FOMO_DISTRIBUTION.sequence_chain + FYP94_FOMO_DISTRIBUTION.countdown_unlock) return "countdown_unlock";
  if (ratio < FYP94_FOMO_DISTRIBUTION.sequence_chain + FYP94_FOMO_DISTRIBUTION.countdown_unlock + FYP94_FOMO_DISTRIBUTION.expiring_spotlight) return "expiring_spotlight";
  return "normal";
}

export function wrapFyp94FomoItem<T>(input: {
  id: string;
  item: T;
  fomoType: Fyp94FomoType;
  now?: Date;
  ttlMinutes?: number;
}): Fyp94FomoItem<T> {
  const now = input.now ?? new Date();
  const ttl = input.ttlMinutes ?? 60;
  const expiresAt = new Date(now.getTime() + ttl * 60_000).toISOString();
  const unlocksAt = new Date(now.getTime() + Math.min(3, ttl) * 60_000).toISOString();

  return {
    id: input.id,
    item: input.item,
    fomoType: input.fomoType,
    startsAt: now.toISOString(),
    expiresAt: input.fomoType === "expiring_spotlight" ? expiresAt : undefined,
    unlocksAt: input.fomoType === "countdown_unlock" ? unlocksAt : undefined,
    sequencePriority: input.fomoType === "sequence_chain" ? 1 : undefined,
  };
}
