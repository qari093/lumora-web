import { describe, expect, it } from "vitest";
import { createGuardianProfile, canGuardianMentor } from "@/src/core/lumaspace/omega/mentorship/guardianEngine";
import { matchGuardian } from "@/src/core/lumaspace/omega/mentorship/matchingEngine";
import { createMentorshipRequest, acceptMentorshipRequest, declineMentorshipRequest } from "@/src/core/lumaspace/omega/mentorship/requestEngine";
import { createMentorshipBridge, completeMentorshipBridge } from "@/src/core/lumaspace/omega/mentorship/bridgeEngine";
import { createMentorRecognition } from "@/src/core/lumaspace/omega/mentorship/recognitionEngine";
import { runLumaSpaceOmegaMegaPack11Runtime } from "@/src/core/lumaspace/omega/mentorship/omegaPack11Runtime";

describe("LumaSpace Ω∞ Mega Pack 11 — Guardian Mentorship System", () => {
  it("creates Guardian profile", () => {
    const guardian = createGuardianProfile({
      guardianId: "g1",
      displayName: "Guardian",
      domains: ["building", "building"],
      trustScore: 95,
      available: true,
      guardianGlowVisible: true,
      maxActiveMentorships: 2,
      activeMentorships: 0,
    });

    expect(guardian.domains).toEqual(["building"]);
    expect(canGuardianMentor(guardian, "building")).toBe(true);
  });

  it("matches Guardian by domain", () => {
    const guardian = createGuardianProfile({
      guardianId: "g2",
      displayName: "Guardian",
      domains: ["discipline"],
      trustScore: 90,
      available: true,
      guardianGlowVisible: true,
      maxActiveMentorships: 2,
      activeMentorships: 0,
    });

    expect(matchGuardian({ guardians: [guardian], domain: "discipline" })?.guardianId).toBe("g2");
  });

  it("creates and updates mentorship request", () => {
    const request = createMentorshipRequest({
      seekerId: "s1",
      guardianId: "g1",
      domain: "building",
      message: "Please guide my building rhythm.",
    });

    expect(request.status).toBe("pending");
    expect(acceptMentorshipRequest(request).status).toBe("accepted");
    expect(declineMentorshipRequest(request).status).toBe("declined");
  });

  it("creates mentorship bridge from accepted request", () => {
    const request = acceptMentorshipRequest(
      createMentorshipRequest({
        seekerId: "s2",
        guardianId: "g2",
        domain: "creative_block",
        message: "I need help with creative block.",
      }),
    );

    const bridge = createMentorshipBridge(request);

    expect(bridge.status).toBe("active");
    expect(bridge.prompts.length).toBeGreaterThan(0);
    expect(completeMentorshipBridge(bridge).status).toBe("completed");
  });

  it("creates mentor recognition", () => {
    const recognition = createMentorRecognition({
      guardianId: "g3",
      helpedCount: 12,
    });

    expect(recognition.legacyBloomUnlocked).toBe(true);
    expect(recognition.recognitionMotif).toBe("steady_lantern");
  });

  it("runs full mega pack runtime", () => {
    const runtime = runLumaSpaceOmegaMegaPack11Runtime();

    expect(runtime.ok).toBe(true);
    expect(runtime.guardian.guardianGlowVisible).toBe(true);
    expect(runtime.bridge.status).toBe("active");
    expect(runtime.completed.status).toBe("completed");
  });
});
