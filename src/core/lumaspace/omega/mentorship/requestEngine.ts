import type { MentorshipRequest, WisdomDomain } from "./types";

export function createMentorshipRequest(input: {
  seekerId: string;
  guardianId: string;
  domain: WisdomDomain;
  message: string;
}): MentorshipRequest {
  if (!input.seekerId.trim()) throw new Error("seekerId_required");
  if (!input.guardianId.trim()) throw new Error("guardianId_required");
  if (input.message.trim().length < 8) throw new Error("message_too_short");

  return {
    id: `mentorship_request_${input.seekerId}_${input.guardianId}_${Date.now()}`,
    seekerId: input.seekerId,
    guardianId: input.guardianId,
    domain: input.domain,
    message: input.message,
    status: "pending",
  };
}

export function acceptMentorshipRequest(request: MentorshipRequest): MentorshipRequest {
  return { ...request, status: "accepted" };
}

export function declineMentorshipRequest(request: MentorshipRequest): MentorshipRequest {
  return { ...request, status: "declined" };
}
