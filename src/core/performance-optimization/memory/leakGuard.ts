export function leakGuard(openHandles: number) {
  return {
    safe: openHandles < 50,
    openHandles
  };
}
