import { describe, expect, it } from "vitest";
import { getDeviceInstallHints } from "@/src/lib/invite/deviceInstall";

describe("Lumora invite device install UX", () => {
  it("detects iOS", () => {
    const out = getDeviceInstallHints("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)");
    expect(out.platform).toBe("ios");
    expect(out.installHint).toContain("Add to Home Screen");
  });

  it("detects Android", () => {
    const out = getDeviceInstallHints("Mozilla/5.0 (Linux; Android 14; Pixel)");
    expect(out.platform).toBe("android");
    expect(out.installHint).toContain("Install App");
  });

  it("falls back for desktop", () => {
    const out = getDeviceInstallHints("Mozilla/5.0 (Macintosh; Intel Mac OS X)");
    expect(out.platform).toBe("desktop");
  });
});
