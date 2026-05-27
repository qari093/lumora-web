export function shouldDisplayFyp94Attribution(input: {
  lastDisplayedAt?: string;
  now?: Date;
  minHours?: number;
}): boolean {
  if (!input.lastDisplayedAt) return true;

  const now = input.now ?? new Date();
  const minHours = input.minHours ?? 12;
  const elapsed = now.getTime() - new Date(input.lastDisplayedAt).getTime();

  return elapsed >= minHours * 60 * 60_000;
}
