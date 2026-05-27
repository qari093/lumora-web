import { describe, expect, it } from "vitest";
import { validateCoreUiShell, validateUiTelemetryEvent } from "@/src/core/lumaspace-production/core-ui/contracts/coreUiContract";
import { createCoreUiShell, resolveRenderMode } from "@/src/core/lumaspace-production/core-ui/runtime/coreUiRuntime";
import { createCoreUiViewModel } from "@/src/core/lumaspace-production/core-ui/ui/coreUiViewModel";
import { createUiTelemetryEvent } from "@/src/core/lumaspace-production/core-ui/telemetry/coreUiTelemetry";

describe("LumaSpace Production Pack 01 Core UI Civilization", () => {
  it("creates valid shell", () => {
    expect(validateCoreUiShell(createCoreUiShell("desktop"))).toBe(true);
  });

  it("resolves safe render modes", () => {
    expect(resolveRenderMode("desktop", false)).toBe("cinematic");
    expect(resolveRenderMode("mobile", true)).toBe("poetic");
  });

  it("creates UI view model", () => {
    const vm = createCoreUiViewModel(createCoreUiShell("mobile"));
    expect(vm.className).toContain("lumaspace-mobile");
  });

  it("creates telemetry event", () => {
    expect(validateUiTelemetryEvent(createUiTelemetryEvent("mount"))).toBe(true);
  });
});
