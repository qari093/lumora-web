import type { CoreUiShell, UiTelemetryEvent } from "../types";

export function validateCoreUiShell(shell: CoreUiShell): boolean {
  return Boolean(shell.id && shell.viewport && shell.renderMode && typeof shell.reducedMotion === "boolean" && shell.ready === true);
}

export function validateUiTelemetryEvent(event: UiTelemetryEvent): boolean {
  return Boolean(event.id && event.event && Number.isFinite(event.at));
}
