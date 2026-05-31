import { createEchoCircle, addCircleParticipant, startEchoCircle, completeEchoCircle } from "./circleEngine";
import { createCircleRitualPlan } from "./ritualEngine";
import { createCircleModerationSignal, circleCanContinue } from "./moderationEngine";
import { createCircleBloom } from "./bloomEngine";

export function runLumaSpaceOmegaMegaPack12Runtime() {
  let circle = createEchoCircle({
    id: "circle-012",
    theme: "belonging",
    hostId: "host-012",
    maxParticipants: 4,
  });

  circle = addCircleParticipant(circle, "u1");
  circle = addCircleParticipant(circle, "u2");
  circle = addCircleParticipant(circle, "u3");
  circle = startEchoCircle(circle);

  const ritual = createCircleRitualPlan(circle);
  const moderation = createCircleModerationSignal({
    circleId: circle.id,
    severity: "low",
    reason: "calm_check",
  });

  const completed = completeEchoCircle(circle);
  const bloom = createCircleBloom({
    citizenId: "u1",
    circleId: circle.id,
    theme: circle.theme,
  });

  return {
    ok:
      circle.status === "active" &&
      circle.noLogs &&
      circle.recordingDisabled &&
      ritual.totalMinutes === 10 &&
      circleCanContinue([moderation]) &&
      completed.status === "completed" &&
      bloom.privateByDefault,
    circle,
    ritual,
    moderation,
    completed,
    bloom,
  };
}
