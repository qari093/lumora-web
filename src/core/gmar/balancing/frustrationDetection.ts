export function frustrationDetection(losses: number) {
  return {
    frustrated: losses >= 5
  };
}
