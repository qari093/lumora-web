export type Fyp94FomoType = "normal" | "expiring_spotlight" | "countdown_unlock" | "sequence_chain";

export type Fyp94FomoItem<T = unknown> = {
  id: string;
  item: T;
  fomoType: Fyp94FomoType;
  startsAt: string;
  expiresAt?: string;
  unlocksAt?: string;
  sequencePriority?: number;
};
