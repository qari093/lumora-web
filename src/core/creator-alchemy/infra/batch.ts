import type { BatchJob } from "./types";

export function prioritizeBatchJobs(jobs: readonly BatchJob[]): BatchJob[] {
  return [...jobs].sort((a, b) => {
    if (b.priority !== a.priority) return b.priority - a.priority;
    return a.estimatedCostUnits - b.estimatedCostUnits;
  });
}

export function selectBatchJobsWithinBudget(jobs: readonly BatchJob[], budgetUnits: number): BatchJob[] {
  let used = 0;
  const selected: BatchJob[] = [];

  for (const job of prioritizeBatchJobs(jobs)) {
    if (used + job.estimatedCostUnits <= budgetUnits) {
      selected.push(job);
      used += job.estimatedCostUnits;
    }
  }

  return selected;
}
