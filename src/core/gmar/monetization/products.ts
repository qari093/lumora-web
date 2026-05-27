export const gmarAllowedProducts = [
  "solace_coin",
  "keeper_of_light",
  "memory_orb",
  "echo_frame",
  "ritual_patronage",
] as const;

export function isGmarProductAllowed(product: string): boolean {
  return (gmarAllowedProducts as readonly string[]).includes(product);
}
