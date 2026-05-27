export function shouldCollapse(nowMs: number, expiresAtMs: number): boolean {
  return nowMs >= expiresAtMs;
}
