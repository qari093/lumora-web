import { describe, expect, it } from "vitest";
import { createPresenceMarkerIdentity } from "@/src/monetization/presence-markers/identity";
import { buildPresenceMarkerUi } from "@/src/monetization/presence-markers/ui";
import { buildPresenceAudioCue } from "@/src/monetization/presence-markers/audio";
import { validatePresenceMarker } from "@/src/monetization/presence-markers/compliance";

describe("Pack09", () => {
  it("identity", () => {
    const i = createPresenceMarkerIdentity({ sponsorId: "1", sponsorName: "S" });
    expect(i.disclosure).toBe("Sponsored");
  });

  it("ui", () => {
    const ui = buildPresenceMarkerUi(createPresenceMarkerIdentity({ sponsorId: "1", sponsorName: "S" }));
    expect(ui.hiddenSubliminal).toBe(false);
  });

  it("audio", () => {
    expect(buildPresenceAudioCue(true).enabled).toBe(true);
  });

  it("compliance", () => {
    expect(validatePresenceMarker({
      visible: true,
      label: "Sponsored",
      hiddenSubliminal: false,
    }).ok).toBe(true);
  });
});
