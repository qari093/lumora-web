import { createGuardianProfile, canGuardianMentor } from "./guardianEngine";
import { matchGuardian } from "./matchingEngine";
import { createMentorshipRequest, acceptMentorshipRequest } from "./requestEngine";
import { createMentorshipBridge, completeMentorshipBridge } from "./bridgeEngine";
import { createMentorRecognition } from "./recognitionEngine";

export function runLumaSpaceOmegaMegaPack11Runtime() {
  const guardian = createGuardianProfile({
    guardianId: "guardian-011",
    displayName: "Quiet Guardian",
    domains: ["building", "discipline", "creative_block"],
    trustScore: 92,
    available: true,
    guardianGlowVisible: true,
    maxActiveMentorships: 3,
    activeMentorships: 1,
  });

  const matched = matchGuardian({
    guardians: [guardian],
    domain: "building",
  });

  const request = acceptMentorshipRequest(
    createMentorshipRequest({
      seekerId: "seeker-011",
      guardianId: guardian.guardianId,
      domain: "building",
      message: "I need help building consistently.",
    }),
  );

  const bridge = createMentorshipBridge(request);
  const completed = completeMentorshipBridge(bridge);
  const recognition = createMentorRecognition({
    guardianId: guardian.guardianId,
    helpedCount: 12,
  });

  return {
    ok:
      canGuardianMentor(guardian, "building") &&
      matched?.guardianId === guardian.guardianId &&
      request.status === "accepted" &&
      bridge.status === "active" &&
      completed.status === "completed" &&
      recognition.legacyBloomUnlocked,
    guardian,
    matched,
    request,
    bridge,
    completed,
    recognition,
  };
}
