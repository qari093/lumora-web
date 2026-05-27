import type { CoreUiShell } from "../types";

export function createCoreUiViewModel(shell: CoreUiShell) {
  return {
    shellId: shell.id,
    className: `lumaspace-shell lumaspace-${shell.viewport} lumaspace-${shell.renderMode}`,
    atmosphereEnabled: shell.renderMode !== "poetic",
    motionSafe: !shell.reducedMotion
  };
}
