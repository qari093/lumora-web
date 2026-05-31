import type { EchoCircle, EchoCircleParticipant, EchoCircleTheme } from "./types";

export function createEchoCircle(input: {
  id: string;
  theme: EchoCircleTheme;
  hostId: string;
  maxParticipants?: number;
}): EchoCircle {
  if (!input.id.trim()) throw new Error("circle_id_required");
  if (!input.hostId.trim()) throw new Error("hostId_required");

  return {
    id: input.id,
    theme: input.theme,
    hostId: input.hostId,
    maxParticipants: Math.max(3, Math.min(8, input.maxParticipants ?? 8)),
    durationMinutes: 10,
    participants: [],
    noLogs: true,
    recordingDisabled: true,
    status: "scheduled",
  };
}

export function addCircleParticipant(circle: EchoCircle, citizenId: string): EchoCircle {
  if (!citizenId.trim()) throw new Error("citizenId_required");
  if (circle.participants.some((p) => p.citizenId === citizenId)) return circle;
  if (circle.participants.length >= circle.maxParticipants) throw new Error("circle_full");

  const participant: EchoCircleParticipant = {
    citizenId,
    joinedAt: Date.now(),
    consentAccepted: true,
    speakingOrder: circle.participants.length + 1,
  };

  return {
    ...circle,
    participants: [...circle.participants, participant],
  };
}

export function startEchoCircle(circle: EchoCircle): EchoCircle {
  if (circle.participants.length < 3) throw new Error("minimum_three_participants_required");
  return { ...circle, status: "active" };
}

export function completeEchoCircle(circle: EchoCircle): EchoCircle {
  if (circle.status !== "active") throw new Error("active_circle_required");
  return { ...circle, status: "completed" };
}
