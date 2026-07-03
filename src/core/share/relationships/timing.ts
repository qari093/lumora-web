import type { RelationshipMemory, ShareRecipientPrediction } from "./types";

export type DeliveryTiming = {
  recipientId: string;
  delivery: "now" | "silent_next_visit" | "scheduled_gentle";
  reason: string;
};

export function chooseRelationshipDeliveryTiming(
  prediction: ShareRecipientPrediction,
  memory?: RelationshipMemory,
): DeliveryTiming {
  if (prediction.preferredMode === "silent" && memory?.allowSilentShare) {
    return {
      recipientId: prediction.recipientId,
      delivery: "silent_next_visit",
      reason: "Recipient allows silent shares and this relationship favors non-interruptive delivery.",
    };
  }

  if (memory?.quietHours) {
    return {
      recipientId: prediction.recipientId,
      delivery: "scheduled_gentle",
      reason: "Recipient is in quiet hours; schedule a calm delivery.",
    };
  }

  return {
    recipientId: prediction.recipientId,
    delivery: "now",
    reason: "Immediate delivery is safe for this relationship context.",
  };
}
