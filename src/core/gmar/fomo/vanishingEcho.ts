export type VanishingEchoPolicy = {
  maxPerMonth: 3;
  publicHours: 4;
  powerReward: false;
  beautyOnly: true;
};

export function createVanishingEchoPolicy(): VanishingEchoPolicy {
  return {
    maxPerMonth: 3,
    publicHours: 4,
    powerReward: false,
    beautyOnly: true,
  };
}

export function vanishingEchoPolicyHealthy(policy = createVanishingEchoPolicy()): boolean {
  return policy.maxPerMonth <= 3 && policy.publicHours === 4 && !policy.powerReward && policy.beautyOnly;
}
