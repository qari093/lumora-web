import type { NativeFypVideo } from "../schema";
import { buildEventsFallback } from "./fallback";

export function ensureNonEmptyFeed(items: NativeFypVideo[]): NativeFypVideo[] {
  if (!items || items.length === 0) {
    return buildEventsFallback();
  }
  return items;
}
