export type PersonalLimits = {
  maxSurgeMinutesPerDay: number;
  maxDuelsPerDay: number;
  maxPredictionsPerDay: number;
};

export const defaultPersonalLimits: PersonalLimits = {
  maxSurgeMinutesPerDay: 60,
  maxDuelsPerDay: 10,
  maxPredictionsPerDay: 20,
};

export function sanitizePersonalLimits(input?: Partial<PersonalLimits>): PersonalLimits {
  return {
    maxSurgeMinutesPerDay: Math.max(10, Math.min(240, input?.maxSurgeMinutesPerDay ?? defaultPersonalLimits.maxSurgeMinutesPerDay)),
    maxDuelsPerDay: Math.max(1, Math.min(100, input?.maxDuelsPerDay ?? defaultPersonalLimits.maxDuelsPerDay)),
    maxPredictionsPerDay: Math.max(1, Math.min(100, input?.maxPredictionsPerDay ?? defaultPersonalLimits.maxPredictionsPerDay)),
  };
}
