export function validateScaling(load: number) {
  return {
    autoscaling: load >= 0.70,
    circuitBreaker: load >= 0.95,
    healthy: load < 0.95
  };
}
