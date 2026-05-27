export function videoPreloadPolicy(connection: "slow" | "normal" | "fast") {
  return {
    preloadCount: connection === "fast" ? 3 : connection === "normal" ? 1 : 0,
    adaptive: true
  };
}
