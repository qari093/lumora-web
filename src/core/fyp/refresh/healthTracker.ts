export interface SourceHealth {
  sourceId: string;
  successRate: number;
}

export function isHealthySource(
  health: SourceHealth
): boolean {
  return health.successRate >= 0.90;
}
