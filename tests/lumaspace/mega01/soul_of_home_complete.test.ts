import { describe, expect, it } from "vitest";
import fs from "node:fs";
import { getHomecomingPhase, moodAtmosphere } from "@/src/core/lumaspace/homecoming/runtime";
import { defaultLumaIdentity, getIdentityModeLabel } from "@/src/core/lumaspace/identity/runtime";
import { createMaskState, toggleMaskMode } from "@/src/core/lumaspace/mask/runtime";

describe("LumaSpace Ω∞ Mega Pack 01 — Soul of Home", () => {
  it("locks Homecoming ritual runtime", () => {
    expect(getHomecomingPhase(0)).toBe("dark");
    expect(getHomecomingPhase(900)).toBe("star");
    expect(getHomecomingPhase(2200)).toBe("whisper");
    expect(getHomecomingPhase(3600)).toBe("universe");
    expect(moodAtmosphere.wonder).toContain("radial-gradient");
  });

  it("locks LumaIdentity profile modes", () => {
    expect(defaultLumaIdentity.name).toBe("Waqar");
    expect(defaultLumaIdentity.profileMode).toBe("aura");
    expect(getIdentityModeLabel("image")).toBe("Image Profile");
    expect(getIdentityModeLabel("cinematic")).toBe("Cinematic Profile");
    expect(getIdentityModeLabel("aura")).toBe("Aura Profile");
  });

  it("locks The Mask public and inner states", () => {
    expect(createMaskState("public").label).toBe("Public Self");
    expect(createMaskState("inner").label).toBe("Inner Self");
    expect(createMaskState("inner").private).toBe(true);
    expect(toggleMaskMode("public")).toBe("inner");
  });

  it("creates all canonical component surfaces", () => {
    [
      "src/components/lumaspace/homecoming/HomecomingLoader.tsx",
      "src/components/lumaspace/homecoming/LivingStar.tsx",
      "src/components/lumaspace/homecoming/NexaWhisper.tsx",
      "src/components/lumaspace/homecoming/UniverseExpansion.tsx",
      "src/components/lumaspace/identity/LumaIdentity.tsx",
      "src/components/lumaspace/identity/MoodRingAvatar.tsx",
      "src/components/lumaspace/identity/CinematicProfile.tsx",
      "src/components/lumaspace/mask/TheMask.tsx",
      "src/components/lumaspace/mask/PublicUniverse.tsx",
      "src/components/lumaspace/mask/InnerUniverse.tsx",
      "app/lumaspace/page.tsx"
    ].forEach((file) => expect(fs.existsSync(file)).toBe(true));
  });
});
