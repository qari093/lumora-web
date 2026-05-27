import { describe, expect, it } from "vitest";
import { validateProfileUniverseRuntime } from "@/src/core/lumaspace-production/profile/contracts/profileContract";
import { canViewProfile } from "@/src/core/lumaspace-production/profile/permissions/profileVisibility";
import { createProfileRenderModel } from "@/src/core/lumaspace-production/profile/render/profileRenderer";
import { runProfileUniverseRuntime } from "@/src/core/lumaspace-production/profile/runtime/profileRuntime";

describe("LumaSpace Production Pack 02 Profile Universe", () => {
  it("runs valid profile runtime", () => {
    expect(validateProfileUniverseRuntime(runProfileUniverseRuntime())).toBe(true);
  });

  it("enforces visibility", () => {
    const runtime = runProfileUniverseRuntime();
    expect(canViewProfile(runtime.identity, "friend")).toBe(true);
    expect(canViewProfile({ ...runtime.identity, visibility: "private" }, "public")).toBe(false);
  });

  it("creates render model", () => {
    const runtime = runProfileUniverseRuntime();
    expect(createProfileRenderModel(runtime.identity, runtime.hero).auraClass).toBe("aura-violet-bloom");
  });
});
