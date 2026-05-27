import type { ModerationItem } from "../types";

export function validateModerationItem(
  item: ModerationItem
): boolean {
  return Boolean(
    item.itemId &&
    typeof item.text === "string" &&
    Array.isArray(item.tags) &&
    typeof item.userReports === "number"
  );
}
