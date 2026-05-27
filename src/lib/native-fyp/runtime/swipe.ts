export function getNextIndex(
  currentIndex: number,
  direction: "up" | "down",
  max: number
): number {
  if (direction === "up") {
    return Math.min(currentIndex + 1, max - 1);
  }
  return Math.max(currentIndex - 1, 0);
}
