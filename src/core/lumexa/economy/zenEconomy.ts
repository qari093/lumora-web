export type LumexaZenEconomyState = {
  balance: number;
  calmDividend: number;
};

export function createLumexaZenEconomyState(
  balance = 0,
  calmDividend = 0
): LumexaZenEconomyState {
  return {
    balance: Number.isFinite(balance) ? balance : 0,
    calmDividend: Number.isFinite(calmDividend) ? calmDividend : 0,
  };
}

export const LUMEXA_ZEN_ECONOMY_READY = true;
