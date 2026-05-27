export function injectEmotionalSnapshot(input: { afterWitnessViewed: boolean; traceCount: number }) {
  const visible = input.afterWitnessViewed && input.traceCount > 0;
  return { visible, label: visible ? "A quiet trace remained" : "", interpretationText: false };
}
