export function routeToPhantomCircle(userId: string) {
  return {
    userId,
    destination: "phantom-circle",
    status: "ready",
  };
}
