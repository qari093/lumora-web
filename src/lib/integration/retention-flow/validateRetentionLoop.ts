export function validateRetentionLoop(input: {
  reminder?: { enabled?: boolean };
  snapshot?: { visible?: boolean };
  moment?: { durationMs?: number };
  transition?: { visible?: boolean };
}) {
  const ok = Boolean(
    input.reminder?.enabled === true &&
    input.snapshot?.visible === true &&
    input.moment?.durationMs === 6000 &&
    input.transition?.visible === true
  );
  return { ok };
}
