import type { CreatorAgencyState } from "./types";

export const DEFAULT_CREATOR_AGENCY: CreatorAgencyState = {
  canOptOut: true,
  canRejectSymbol: true,
  canLowerIntensity: true,
  canEnterSanctuary: true
};

export function validateCreatorAgency(state: CreatorAgencyState = DEFAULT_CREATOR_AGENCY): boolean {
  return (
    state.canOptOut === true &&
    state.canRejectSymbol === true &&
    state.canLowerIntensity === true &&
    state.canEnterSanctuary === true
  );
}
