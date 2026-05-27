import type { CivilizationDoctrine } from "../foundation/types";

export const CIVILIZATION_DOCTRINE: CivilizationDoctrine = {
  status: "locked",
  creatorFirst: true,
  trustRequired: true,
  antiManipulation: true,
  synchronizedAtmospheres: true
};

export function assertDoctrineLocked(): true {
  if (CIVILIZATION_DOCTRINE.status !== "locked") {
    throw new Error("Lumora FYP doctrine is not locked.");
  }

  return true;
}

export function validateGovernance(): boolean {
  return (
    CIVILIZATION_DOCTRINE.creatorFirst &&
    CIVILIZATION_DOCTRINE.trustRequired &&
    CIVILIZATION_DOCTRINE.antiManipulation &&
    CIVILIZATION_DOCTRINE.synchronizedAtmospheres
  );
}
