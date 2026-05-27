export type GmarEconomyUse =
  | "solace_coin"
  | "keeper_of_light"
  | "memory_patronage"
  | "echo_frame"
  | "memory_orb"
  | "squad_binding"
  | "power_boost"
  | "loot_box"
  | "fake_urgency";

const allowed = new Set<GmarEconomyUse>([
  "solace_coin",
  "keeper_of_light",
  "memory_patronage",
  "echo_frame",
  "memory_orb",
  "squad_binding",
]);

export function isGmarEconomyUseAllowed(use: GmarEconomyUse): boolean {
  return allowed.has(use);
}

export function gmarEconomyPolicyHealthy(): boolean {
  return (
    isGmarEconomyUseAllowed("solace_coin") &&
    isGmarEconomyUseAllowed("keeper_of_light") &&
    isGmarEconomyUseAllowed("memory_patronage") &&
    !isGmarEconomyUseAllowed("power_boost") &&
    !isGmarEconomyUseAllowed("loot_box") &&
    !isGmarEconomyUseAllowed("fake_urgency")
  );
}
