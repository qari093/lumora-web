export const loadEcoFactors = async () => [];
export const estimateFromCounts = (..._args: any[]) => 0;
/* AUTO-GENERATED STUB: treesEquivalentKg
 * Very rough approximation: one mature tree ~21kg CO₂/year.
 */
export function treesEquivalentKg(kgCO2: number): number {
  if (!Number.isFinite(kgCO2) || kgCO2 <= 0) return 0;
  return kgCO2 / 21;
}

