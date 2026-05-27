import type { Fyp94LicenseProof } from "./types";

export function createFyp94LicenseProof(input: Omit<Fyp94LicenseProof, "capturedAt">): Fyp94LicenseProof {
  return {
    ...input,
    capturedAt: new Date().toISOString(),
  };
}

export function storeFyp94LicenseProof(
  store: Record<string, Fyp94LicenseProof>,
  assetId: string,
  proof: Fyp94LicenseProof,
): Record<string, Fyp94LicenseProof> {
  return {
    ...store,
    [assetId]: proof,
  };
}
