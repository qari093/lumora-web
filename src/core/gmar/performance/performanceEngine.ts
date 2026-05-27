export function fpsGuard(fps: number) {
  return {
    stable: fps >= 55
  };
}
