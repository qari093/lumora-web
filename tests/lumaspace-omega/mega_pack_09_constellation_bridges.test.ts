import { describe, expect, it } from "vitest";
import { createSoulThreadProfile, canUseSoulThread } from "@/src/core/lumaspace/omega/bridges/soulThreadEngine";
import { calculateAffinity, rankBridgeCandidates } from "@/src/core/lumaspace/omega/bridges/affinityEngine";
import { getDailyBridgeGatePrompt, openSerendipityGate } from "@/src/core/lumaspace/omega/bridges/serendipityGate";
import { pulsesAreReciprocal, sendStarlightPulse } from "@/src/core/lumaspace/omega/bridges/starlightPulse";
import { advanceBridgeTrust, formConstellationBridge } from "@/src/core/lumaspace/omega/bridges/bridgeEngine";
import { addThreadEcho, createThreadSpace } from "@/src/core/lumaspace/omega/bridges/threadSpace";
import { runLumaSpaceOmegaMegaPack09Runtime } from "@/src/core/lumaspace/omega/bridges/omegaPack09Runtime";

describe("LumaSpace Ω∞ Mega Pack 09 — Constellation Bridge System", () => {
  const a = createSoulThreadProfile({
    citizenId: "a",
    contributionTags: ["builder"],
    communityIds: ["c1"],
    wisdomTopics: ["starting"],
    missionDomains: ["creation"],
    openingVerse: "Gentle builder",
    consentGranted: true,
  });

  const b = createSoulThreadProfile({
    citizenId: "b",
    contributionTags: ["builder"],
    communityIds: ["c1"],
    wisdomTopics: ["starting"],
    missionDomains: ["creation"],
    openingVerse: "Quiet creator",
    consentGranted: true,
  });

  it("creates consent-safe soul thread profiles", () => {
    expect(canUseSoulThread(a)).toBe(true);
    expect(a.contributionTags).toEqual(["builder"]);
  });

  it("calculates and ranks affinity", () => {
    const candidate = calculateAffinity(a, b, "spark");
    expect(candidate.identityBlurred).toBe(true);
    expect(candidate.affinityScore).toBeGreaterThan(0);
    expect(rankBridgeCandidates([candidate])[0].citizenId).toBe("b");
  });

  it("opens serendipity gate", () => {
    const gate = openSerendipityGate({ viewer: a, candidates: [b], gate: "spark" });
    expect(gate?.citizenId).toBe("b");
    expect(getDailyBridgeGatePrompt("purpose")).toContain("build beside");
  });

  it("sends starlight pulse with sender echo", () => {
    const pulse = sendStarlightPulse({ fromCitizenId: "a", toCitizenId: "b", gate: "spark" });
    expect(pulse.senderEchoVisible).toBe(true);
    expect(pulse.gate).toBe("spark");
  });

  it("forms bridge from reciprocal pulses", () => {
    const pulseA = sendStarlightPulse({ fromCitizenId: "a", toCitizenId: "b", gate: "spark" });
    const pulseB = sendStarlightPulse({ fromCitizenId: "b", toCitizenId: "a", gate: "spark" });

    expect(pulsesAreReciprocal(pulseA, pulseB)).toBe(true);

    const bridge = formConstellationBridge({ pulseA, pulseB });
    expect(bridge.status).toBe("active");
    expect(bridge.trustStage).toBe("spark");
  });

  it("advances bridge relationship seasons", () => {
    const pulseA = sendStarlightPulse({ fromCitizenId: "a", toCitizenId: "b", gate: "purpose" });
    const pulseB = sendStarlightPulse({ fromCitizenId: "b", toCitizenId: "a", gate: "purpose" });

    let bridge = formConstellationBridge({ pulseA, pulseB });
    bridge = advanceBridgeTrust(bridge);
    bridge = advanceBridgeTrust(bridge);

    expect(bridge.trustStage).toBe("builder");
  });

  it("creates paced thread space", () => {
    const pulseA = sendStarlightPulse({ fromCitizenId: "a", toCitizenId: "b", gate: "wisdom" });
    const pulseB = sendStarlightPulse({ fromCitizenId: "b", toCitizenId: "a", gate: "wisdom" });
    const bridge = formConstellationBridge({ pulseA, pulseB });

    let thread = createThreadSpace(bridge);
    thread = addThreadEcho(thread, { id: "e1", authorId: "a", format: "text", body: "Hello with care." });

    expect(thread.exchangeLimit).toBe(1);
    expect(thread.echoes).toHaveLength(1);
  });

  it("runs full mega pack runtime", () => {
    const runtime = runLumaSpaceOmegaMegaPack09Runtime();

    expect(runtime.ok).toBe(true);
    expect(runtime.affinity.affinityScore).toBeGreaterThan(0);
    expect(runtime.bridge.status).toBe("active");
    expect(runtime.thread.echoes).toHaveLength(1);
  });
});
