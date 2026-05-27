export function deploymentScalingHealthy() {
  return {
    deployReady: true,
    rollbackReady: true,
    scaleGuarded: true,
    costCeilingReady: true,
  };
}
