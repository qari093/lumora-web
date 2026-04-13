export type FinalWaveProgressScope =
  | "master-seal"
  | "final-wave"
  | "launch-corridor"
  | "closeout"
  | "verification";

export type FinalWaveProgressStatus =
  | "pending"
  | "in-progress"
  | "complete"
  | "blocked";

export type FinalWaveProgressRecord = {
  id: string;
  scope: FinalWaveProgressScope;
  title: string;
  status: FinalWaveProgressStatus;
  createdAt: string;
  updatedAt: string;
};

export const FINAL_WAVE_PROGRESS_REGISTRY: FinalWaveProgressRecord[] = [];

export function registerFinalWaveProgress(
  record: FinalWaveProgressRecord
): void {
  FINAL_WAVE_PROGRESS_REGISTRY.push({
    ...record,
    id: record.id.trim(),
    title: record.title.trim(),
  });
}

export function getFinalWaveProgressById(
  id: string
): FinalWaveProgressRecord | undefined {
  const normalizedId = id.trim();
  return FINAL_WAVE_PROGRESS_REGISTRY.find((record) => record.id === normalizedId);
}

export function getCompleteFinalWaveProgressItems(): FinalWaveProgressRecord[] {
  return FINAL_WAVE_PROGRESS_REGISTRY.filter((record) => record.status === "complete");
}
