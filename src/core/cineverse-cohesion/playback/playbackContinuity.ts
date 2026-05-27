export function playbackContinuity(positionSeconds: number) {
  return {
    positionSeconds,
    restorable: positionSeconds >= 0
  };
}
