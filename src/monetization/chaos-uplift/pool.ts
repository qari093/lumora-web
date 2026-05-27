export function allocateChaosUplift(input: {
  totalPool: number;
  creatorNoveltyScore: number;
  totalNoveltyScore: number;
  mature: boolean;
}) {
  if (!input.mature || input.totalPool <= 0 || input.creatorNoveltyScore <= 0 || input.totalNoveltyScore <= 0) {
    return 0;
  }

  return Number(((input.creatorNoveltyScore / input.totalNoveltyScore) * input.totalPool).toFixed(2));
}
