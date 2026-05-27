import type { NativeFypVideo } from "../schema";

export type WindowSlots = {
  prev: NativeFypVideo | null;
  current: NativeFypVideo;
  next: NativeFypVideo | null;
};

export function buildWindow(
  queue: NativeFypVideo[],
  index: number
): WindowSlots {
  return {
    prev: queue[index - 1] || null,
    current: queue[index],
    next: queue[index + 1] || null,
  };
}
