import type { ZenFlowSession } from "./types";

export function createZenFlowSession(id = "zen-flow-seed-session"): ZenFlowSession {
  return {
    id,
    phases: [
      "arrival",
      "breath_sync",
      "light_path",
      "soft_challenge",
      "gratitude_close",
    ],
    scoringEnabled: false,
    stressPressure: false,
    mirrorHourCompatible: true,
  };
}

export function zenFlowSessionHealthy(session = createZenFlowSession()): boolean {
  return (
    session.phases.length === 5 &&
    session.phases[0] === "arrival" &&
    session.phases.includes("breath_sync") &&
    session.phases.includes("gratitude_close") &&
    session.scoringEnabled === false &&
    session.stressPressure === false &&
    session.mirrorHourCompatible === true
  );
}
