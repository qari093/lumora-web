import type { FypInteractionType } from "./interactionTypes";

export function getFypInteractionFeedback(
  type: FypInteractionType
): {
  haptic: "light" | "medium";
  label: string;
} {
  if (type === "send_to_space") {
    return { haptic: "medium", label: "Sent to Space" };
  }

  if (type === "deep_dive") {
    return { haptic: "medium", label: "Opening Deep Dive" };
  }

  return { haptic: "light", label: "Captured" };
}
