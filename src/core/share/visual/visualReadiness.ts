export type ShareVisualCheck = {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
};

export function createShareVisualCheck(
  id: string,
  label: string,
  passed: boolean,
  detail: string,
): ShareVisualCheck {
  return { id, label, passed, detail };
}

export function summarizeShareVisualReadiness(checks: ShareVisualCheck[]) {
  const passed = checks.filter((check) => check.passed).length;
  const total = checks.length;
  const score = Number((passed / Math.max(1, total)).toFixed(4));

  return {
    passed,
    total,
    score,
    ready: total > 0 && passed === total,
  };
}

export function createShareVisualContract() {
  return {
    route: "/share",
    requiredSurfaces: [
      "usl-share-demo-page",
      "usl-demo-card",
      "usl-share-button",
      "usl-share-fab",
      "usl-share-sheet",
      "usl-create-share",
    ],
    requiredStates: [
      "idle",
      "search",
      "destination_selected",
      "creating",
      "success",
      "error",
      "copy",
      "native_share",
    ],
    requiredDeviceClasses: ["mobile", "tablet", "desktop"],
    requiredAccessibility: ["button_labels", "keyboard_reachable", "focus_safe", "reduced_motion_safe"],
  };
}
