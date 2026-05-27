export function syncPresence(count: number) {
  return {
    synchronized: true,
    viewers: count
  };
}
