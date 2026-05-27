export const MIN_VIABLE_CIRCLE_SIZE = 3;

export function isMinimumViableCircle(attendeeIds: string[]): boolean {
  return new Set(attendeeIds).size >= MIN_VIABLE_CIRCLE_SIZE;
}
