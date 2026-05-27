import { detectPulseSync } from "./pulseSync";
import { createEthicalVanishingEchoPolicy } from "./vanishingEchoPolicy";
import { createCivilizationScar } from "./civilizationScar";

export function fomoAdrenalineSafetyHealthy(): boolean {
  const sync = detectPulseSync({
    meanCorrelation: 0.8,
    smoothMovementScore: 0.8,
    consecutiveSeconds: 8,
  });

  const vanishing = createEthicalVanishingEchoPolicy();
  const scar = createCivilizationScar("scar-1");

  return (
    sync.active &&
    sync.grantsPower === false &&
    vanishing.powerReward === false &&
    vanishing.fakeUrgency === false &&
    scar.permanent &&
    scar.grantsPower === false
  );
}
