import type { NativeFypVideo } from "../schema";

export function createInitialQueue(items: NativeFypVideo[]): NativeFypVideo[] {
  return items.slice(0, 20);
}
