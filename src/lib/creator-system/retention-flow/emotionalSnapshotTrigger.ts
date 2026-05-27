export function shouldTriggerEmotionalSnapshot(input: {
  afterWitnessViewed: boolean;
  humanTraceCount: number;
}): boolean {
  return input.afterWitnessViewed && input.humanTraceCount > 0;
}
