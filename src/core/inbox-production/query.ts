import type { ProductionInboxItem } from "./types";

export function sortInboxChronologically(items: ProductionInboxItem[]) {
  return [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
