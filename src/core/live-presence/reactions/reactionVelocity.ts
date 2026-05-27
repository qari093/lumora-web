export function reactionVelocity(speed: number) {
  return {
    safe: speed < 1000
  };
}
