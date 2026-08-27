import type { CreateShareInput } from "../foundation/types";
import type { RelationshipMemory, RelationshipSignal, ShareRecipientPrediction } from "./types";
import { relationshipStrengthScore } from "./graph";

function recencyScore(lastInteractionAt: string): number {
  const ts = Date.parse(lastInteractionAt);
  if (!Number.isFinite(ts)) return 0.1;
  const days = Math.max(0, (Date.now() - ts) / 86400000);
  if (days <= 2) return 1;
  if (days <= 14) return 0.72;
  if (days <= 45) return 0.44;
  return 0.18;
}

export function predictShareRecipients(params: {
  input: CreateShareInput;
  senderId: string;
  signals: RelationshipSignal[];
  memories?: RelationshipMemory[];
}): ShareRecipientPrediction[] {
  const mood = String(params.input.metadata?.mood ?? "");
  const sourcePortal = params.input.sourcePortal;

  return params.signals
    .filter((signal) => signal.fromUserId === params.senderId || signal.toUserId === params.senderId)
    .map((signal) => {
      const recipientId = signal.fromUserId === params.senderId ? signal.toUserId : signal.fromUserId;
      const memory = params.memories?.find(
        (item) => item.userId === params.senderId && item.recipientId === recipientId,
      );

      const moodScore = mood && signal.sharedMoods.includes(mood) ? 0.18 : 0;
      const portalScore = signal.sharedPortals.includes(sourcePortal) ? 0.16 : 0;
      const memoryScore = memory?.preferredPortals.includes(sourcePortal) ? 0.12 : 0;
      const score =
        relationshipStrengthScore(signal.strength) * 0.38 +
        recencyScore(signal.lastInteractionAt) * 0.18 +
        signal.trustScore * 0.16 +
        signal.silentShareAffinity * 0.08 +
        signal.echoShareAffinity * 0.08 +
        moodScore +
        portalScore +
        memoryScore;

      const preferredMode: ShareRecipientPrediction["preferredMode"] =
        memory?.allowSilentShare && signal.silentShareAffinity >= 0.72
          ? "silent"
          : signal.echoShareAffinity >= 0.74
            ? "echo"
            : signal.kind === "family"
              ? "gift"
              : "instant";

      return {
        recipientId,
        score: Number(Math.min(1, score).toFixed(4)),
        reason:
          preferredMode === "silent"
            ? "Quiet relationship pattern; silent share is recommended."
            : preferredMode === "echo"
              ? "Voice-attached echo is likely to feel personal here."
              : "Recommended by relationship strength, trust, recency, and portal context.",
        preferredMode,
        preferredPortal: memory?.preferredPortals[0] ?? sourcePortal,
      };
    })
    .sort((a, b) => b.score - a.score);
}
