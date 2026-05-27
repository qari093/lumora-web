import type {
  ModerationDecision,
  ModerationItem
} from "../types";

import { validateModerationItem } from "../contracts/moderationContract";

const BLOCK_TERMS = [
  "terror",
  "kill",
  "abuse"
];

export function evaluateModeration(
  item: ModerationItem
): ModerationDecision {
  if (!validateModerationItem(item)) {
    throw new Error("invalid_moderation_item");
  }

  const reasons: string[] = [];
  const normalized = item.text.toLowerCase();

  for (const term of BLOCK_TERMS) {
    if (normalized.includes(term)) {
      reasons.push(`blocked_term:${term}`);
    }
  }

  if (item.userReports >= 5) {
    reasons.push("high_report_volume");
  }

  if (reasons.some((r) => r.startsWith("blocked_term"))) {
    return {
      itemId: item.itemId,
      state: "blocked",
      reasons
    };
  }

  if (reasons.length > 0) {
    return {
      itemId: item.itemId,
      state: "review",
      reasons
    };
  }

  return {
    itemId: item.itemId,
    state: "approved",
    reasons: []
  };
}
