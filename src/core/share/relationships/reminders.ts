import type { ShareRecipientPrediction } from "./types";

export type SmartShareReminder = {
  id: string;
  recipientId: string;
  priority: "low" | "medium" | "high";
  message: string;
};

export function createSmartShareReminders(predictions: ShareRecipientPrediction[]): SmartShareReminder[] {
  return predictions
    .filter((prediction) => prediction.score >= 0.62)
    .slice(0, 5)
    .map((prediction, index) => ({
      id: `share_reminder_${prediction.recipientId}_${index}`,
      recipientId: prediction.recipientId,
      priority: prediction.score >= 0.82 ? "high" : prediction.score >= 0.7 ? "medium" : "low",
      message:
        prediction.preferredMode === "silent"
          ? "A quiet share may land well here."
          : prediction.preferredMode === "echo"
            ? "Add an Echo to make this share personal."
            : "This recipient is a strong match for the share.",
    }));
}
