export function createSessionSnapshot(portal: string) {
  return {
    portal,
    ts: Date.now(),
    restorable: true
  };
}
