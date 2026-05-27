export type ZenEconomyUse =
  | "solace_coin"
  | "keeper_of_light"
  | "memory_orb"
  | "echo_frame"
  | "memory_patronage"
  | "squad_binding"
  | "civilization_naming"
  | "aura_cosmetic"
  | "power_boost"
  | "loot_box"
  | "progression_skip";

const allowedUses = new Set<ZenEconomyUse>([
  "solace_coin",
  "keeper_of_light",
  "memory_orb",
  "echo_frame",
  "memory_patronage",
  "squad_binding",
  "civilization_naming",
  "aura_cosmetic",
]);

export function isZenEconomyUseAllowed(use: ZenEconomyUse): boolean {
  return allowedUses.has(use);
}

export function zenEconomyUsePolicyHealthy(): boolean {
  return (
    isZenEconomyUseAllowed("solace_coin") &&
    isZenEconomyUseAllowed("keeper_of_light") &&
    isZenEconomyUseAllowed("memory_orb") &&
    !isZenEconomyUseAllowed("power_boost") &&
    !isZenEconomyUseAllowed("loot_box") &&
    !isZenEconomyUseAllowed("progression_skip")
  );
}
