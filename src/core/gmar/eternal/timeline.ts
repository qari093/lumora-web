export type CivilizationTimeline = {
  erasTracked: number;
  compressionEnabled: boolean;
  recoverySafe: boolean;
};

export function createCivilizationTimeline(): CivilizationTimeline {
  return {
    erasTracked: 12,
    compressionEnabled: true,
    recoverySafe: true,
  };
}
