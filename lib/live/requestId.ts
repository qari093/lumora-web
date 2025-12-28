export function makeRequestId(): string {
  // short, collision-resistant enough for local/dev + headers/tests
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
