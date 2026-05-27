export const FYP94_AUTO_REFRESH_POLICY = {
  refreshEveryHours: 6,
  appendBatchTarget: 40,
  maxManifestItems: 300,
  minPlayableItems: 30,
};

export function shouldRunFyp94Refresh(input: {
  lastRunAt?: string | null;
  now?: Date;
  everyHours?: number;
}) {
  if (!input.lastRunAt) return true;

  const now = input.now ?? new Date();
  const everyHours = input.everyHours ?? FYP94_AUTO_REFRESH_POLICY.refreshEveryHours;
  const last = new Date(input.lastRunAt);

  if (Number.isNaN(last.getTime())) return true;

  return now.getTime() - last.getTime() >= everyHours * 60 * 60 * 1000;
}
