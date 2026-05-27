export type EthicalVanishingEcho = {
  maxPerMonth: 3;
  publicWindowHours: 4;
  powerReward: false;
  visibleCountdownOnlyInHub: true;
  fakeUrgency: false;
};

export function createEthicalVanishingEchoPolicy(): EthicalVanishingEcho {
  return {
    maxPerMonth: 3,
    publicWindowHours: 4,
    powerReward: false,
    visibleCountdownOnlyInHub: true,
    fakeUrgency: false,
  };
}

export function ethicalVanishingEchoHealthy(): boolean {
  const policy = createEthicalVanishingEchoPolicy();

  return (
    policy.maxPerMonth <= 3 &&
    policy.publicWindowHours === 4 &&
    !policy.powerReward &&
    policy.visibleCountdownOnlyInHub &&
    !policy.fakeUrgency
  );
}
