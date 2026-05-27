export type SolaceCoin = {
  id: "solace-coin";
  priceUsd: 4.99;
  power: 0;
  replayFirstLight: true;
  permanent: true;
};

export function createSolaceCoin(): SolaceCoin {
  return {
    id: "solace-coin",
    priceUsd: 4.99,
    power: 0,
    replayFirstLight: true,
    permanent: true,
  };
}
