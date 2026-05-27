export function createIdempotencyKey(seed: string) {
  return `zendoro_${seed}`;
}
