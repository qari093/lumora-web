import type { GravityAssistedNavigationDecision } from "./assistedNavigation";

export type GravityAssistedConfirmation = {
  integrated: boolean;
  confirmationVisible: boolean;
  confirmationText: string;
  requiresExplicitRelease: true;
  canNavigate: false;
};

export function computeAssistedConfirmation(nav: GravityAssistedNavigationDecision): GravityAssistedConfirmation {
  return {
    integrated: true,
    confirmationVisible: nav.softNavigationPrepared,
    confirmationText: nav.softNavigationPrepared ? "Release again to return" : "",
    requiresExplicitRelease: true,
    canNavigate: false,
  };
}
