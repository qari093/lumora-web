export function deploymentReady(passed: boolean) {
  return {
    deployable: passed
  };
}
