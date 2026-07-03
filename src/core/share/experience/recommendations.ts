import type { CreateShareInput } from "../foundation/types";
import type { UniversalShareDestination } from "./destinations";

export function explainShareRecommendation(
  input: CreateShareInput,
  destination: UniversalShareDestination,
): string {
  if (input.sourcePortal === "fyp" && destination.portal === "lumaspace") {
    return "Best path: turn this FYP trace into a LumaSpace memory.";
  }

  if (input.sourcePortal === "lumaspace" && destination.portal === "lumalink") {
    return "Best path: continue this memory as a conversation.";
  }

  if (destination.supportsSilent && input.metadata?.mood === "calm") {
    return "Suggested because calm shares work well as quiet arrivals.";
  }

  if (destination.supportsExternal) {
    return "Use this when the recipient is outside Lumora.";
  }

  return "Recommended by context, destination priority, and recent activity.";
}
