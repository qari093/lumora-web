export function passesOneBreathRule(secondsToUnderstand: number): boolean {
  return secondsToUnderstand <= 5;
}

export function passesHalfShipRule(removedFeatureCount: number): boolean {
  return removedFeatureCount >= 3;
}
