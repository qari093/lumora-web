import { FYP_FRESHNESS_CONFIG } from "./freshnessConfig";

export function meetsRotationTarget(
  replacedPercent: number
): boolean {
  return (
    replacedPercent >=
    FYP_FRESHNESS_CONFIG.weeklyReplacementTargetPercent
  );
}
