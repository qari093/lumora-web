import type { RelationshipSignal } from "./types";

export function createRelationshipGraph(signals: RelationshipSignal[]) {
  return {
    signals,
    byUser(userId: string) {
      return signals.filter((signal) => signal.fromUserId === userId || signal.toUserId === userId);
    },
    between(a: string, b: string) {
      return signals.find(
        (signal) =>
          (signal.fromUserId === a && signal.toUserId === b) ||
          (signal.fromUserId === b && signal.toUserId === a),
      );
    },
  };
}

export function relationshipStrengthScore(strength: RelationshipSignal["strength"]): number {
  if (strength === "inner_circle") return 1;
  if (strength === "strong") return 0.78;
  if (strength === "medium") return 0.52;
  return 0.28;
}
