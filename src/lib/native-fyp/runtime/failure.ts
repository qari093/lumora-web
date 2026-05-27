import type { NativeFypVideo } from "../schema";

export function handleFailure(
  queue: NativeFypVideo[],
  failedId: string
): NativeFypVideo[] {
  return queue.filter(v => v.id !== failedId);
}
