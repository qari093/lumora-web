import { createSoulThreadProfile } from "./soulThreadEngine";
import { calculateAffinity } from "./affinityEngine";
import { openSerendipityGate, getDailyBridgeGatePrompt } from "./serendipityGate";
import { sendStarlightPulse, pulsesAreReciprocal } from "./starlightPulse";
import { formConstellationBridge, advanceBridgeTrust } from "./bridgeEngine";
import { createThreadSpace, addThreadEcho } from "./threadSpace";

export function runLumaSpaceOmegaMegaPack09Runtime() {
  const a = createSoulThreadProfile({
    citizenId: "omega-a",
    contributionTags: ["builder", "mentor"],
    communityIds: ["lumasp-builders"],
    wisdomTopics: ["starting", "discipline"],
    missionDomains: ["creation", "learning"],
    openingVerse: "Building with quiet fire",
    consentGranted: true,
  });

  const b = createSoulThreadProfile({
    citizenId: "omega-b",
    contributionTags: ["builder", "creator"],
    communityIds: ["lumasp-builders"],
    wisdomTopics: ["starting", "resilience"],
    missionDomains: ["creation", "wellness"],
    openingVerse: "Healing through code",
    consentGranted: true,
  });

  const affinity = calculateAffinity(a, b, "spark");
  const gate = openSerendipityGate({ viewer: a, candidates: [b], gate: "spark" });
  const pulseA = sendStarlightPulse({ fromCitizenId: "omega-a", toCitizenId: "omega-b", gate: "spark" });
  const pulseB = sendStarlightPulse({ fromCitizenId: "omega-b", toCitizenId: "omega-a", gate: "spark" });
  const bridge = formConstellationBridge({ pulseA, pulseB });
  const advanced = advanceBridgeTrust(advanceBridgeTrust(bridge));

  let thread = createThreadSpace(bridge);
  thread = addThreadEcho(thread, {
    id: "echo-a",
    authorId: "omega-a",
    format: "text",
    body: "Your verse resonated with my path.",
  });

  return {
    ok:
      affinity.affinityScore > 0 &&
      gate?.citizenId === "omega-b" &&
      getDailyBridgeGatePrompt("spark").includes("shares your light") &&
      pulseA.senderEchoVisible &&
      pulsesAreReciprocal(pulseA, pulseB) &&
      bridge.status === "active" &&
      advanced.trustStage === "builder" &&
      thread.echoes.length === 1,
    a,
    b,
    affinity,
    gate,
    pulseA,
    pulseB,
    bridge,
    advanced,
    thread,
  };
}
