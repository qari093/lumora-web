export function createIdempotencyKey(seed: string): string {
  return `zencoin_${seed}_stable`;
}
