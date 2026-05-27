export function createServiceProbe(name: string, ok: boolean) {
  return {
    name,
    ok,
    checkedAt: new Date().toISOString(),
  };
}
