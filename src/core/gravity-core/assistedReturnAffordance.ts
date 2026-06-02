import type { GravityPortalRevealState } from "./assistedPortalReveal";

export type AssistedReturnAffordance = {
  visible: boolean;
  text: string;
  confirmRequired: true;
  navigationEnabled: false;
};

export function computeAssistedReturnAffordance(reveal: GravityPortalRevealState): AssistedReturnAffordance {
  return {
    visible: reveal.showReturnAffordance,
    text: reveal.showReturnAffordance ? "Release to preview return" : "",
    confirmRequired: true,
    navigationEnabled: false,
  };
}
