export function reactionPulse(count: number) {
  return {
    count,
    visible: count > 0
  };
}
