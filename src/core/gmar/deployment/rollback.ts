export function rollbackPlanHealthy() {
  return {
    snapshotBeforeDeploy: true,
    featureFlagsRequired: true,
    oneCommandRollback: true,
  };
}
