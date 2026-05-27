import type { CoreUiShell, LumaViewport, RenderMode } from "../types";

export function resolveRenderMode(viewport: LumaViewport, reducedMotion = false): RenderMode {
  if (reducedMotion) return "poetic";
  if (viewport === "desktop") return "cinematic";
  return "atmospheric";
}

export function createCoreUiShell(viewport: LumaViewport = "mobile", reducedMotion = false): CoreUiShell {
  return {
    id: "lumaspace_core_ui_shell",
    viewport,
    renderMode: resolveRenderMode(viewport, reducedMotion),
    reducedMotion,
    ready: true
  };
}
