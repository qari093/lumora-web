export function liveReady(servers: number) {
  return {
    ready: servers >= 1
  };
}
