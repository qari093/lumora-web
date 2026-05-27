export type WitnessIdentity = {
  witnessId: string;
  witnessName: string;
  createdAt: string;
  anonymousToPublic: true;
};

export function createWitnessIdentity(input: {
  witnessId: string;
  witnessName: string;
  createdAt?: string;
}): WitnessIdentity {
  return {
    witnessId: input.witnessId,
    witnessName: input.witnessName.trim(),
    createdAt: input.createdAt || new Date().toISOString(),
    anonymousToPublic: true,
  };
}
