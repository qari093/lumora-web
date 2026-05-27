export type LivePerformanceBudget = {
  memoryMb: number;
  cpuPercent: number;
};

export function passesPulseSphereBudget(budget: LivePerformanceBudget): boolean {
  return budget.memoryMb <= 45 && budget.cpuPercent <= 5;
}
