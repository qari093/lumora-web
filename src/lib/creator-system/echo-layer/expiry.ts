export function isEchoExpired(nowMs: number, expiresAtMs: number): boolean {
  return nowMs >= expiresAtMs;
}

export function resolveEchoActive(nowMs: number, expiresAtMs: number): boolean {
  return nowMs < expiresAtMs;
}
