export type EmotionalContract = {
  noPowerSelling: true;
  noFakeUrgency: true;
  noEmotionalExploitation: true;
  playerCanDeleteResonance: true;
};

export function createEmotionalContract(): EmotionalContract {
  return {
    noPowerSelling: true,
    noFakeUrgency: true,
    noEmotionalExploitation: true,
    playerCanDeleteResonance: true,
  };
}

export function emotionalContractHealthy(contract = createEmotionalContract()): boolean {
  return (
    contract.noPowerSelling &&
    contract.noFakeUrgency &&
    contract.noEmotionalExploitation &&
    contract.playerCanDeleteResonance
  );
}
