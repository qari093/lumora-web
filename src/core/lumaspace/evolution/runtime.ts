export type QuestAura = "Dreamer" | "Explorer" | "Creator" | "Guardian" | "Golden Aura";
export type ReactionKind = "wonder" | "spark" | "fire" | "comfort" | "dream";

export type IdentityQuest = {
  id: string;
  title: string;
  path: QuestAura;
  current: number;
  required: number;
  reward: string;
};

export type ReactionStar = {
  id: string;
  from: string;
  kind: ReactionKind;
  x: number;
  y: number;
};

export const identityQuests: IdentityQuest[] = [
  { id: "wonder-path", title: "Save 10 Wonder memories", path: "Dreamer", current: 7, required: 10, reward: "Dreamer Aura" },
  { id: "world-path", title: "Visit 5 Worlds", path: "Explorer", current: 4, required: 5, reward: "Golden Aura" },
  { id: "creator-path", title: "Create first story", path: "Creator", current: 1, required: 1, reward: "Creator Glow" }
];

export const reactionStars: ReactionStar[] = [
  { id: "r1", from: "Ayesha", kind: "wonder", x: 48, y: 22 },
  { id: "r2", from: "Sara", kind: "comfort", x: 30, y: 48 },
  { id: "r3", from: "Hamza", kind: "fire", x: 70, y: 50 },
  { id: "r4", from: "Zayan", kind: "spark", x: 44, y: 76 },
  { id: "r5", from: "Mira", kind: "dream", x: 62, y: 32 }
];

export function getQuestProgress(quest: IdentityQuest): number {
  return Math.min(100, Math.round((quest.current / quest.required) * 100));
}

export function getNextQuest(quests: IdentityQuest[] = identityQuests): IdentityQuest | undefined {
  return quests.find((quest) => getQuestProgress(quest) < 100);
}

export function getReactionLabel(kind: ReactionKind): string {
  const labels: Record<ReactionKind, string> = {
    wonder: "Wonder",
    spark: "Spark",
    fire: "Fire",
    comfort: "Comfort",
    dream: "Dream"
  };
  return labels[kind];
}
