import type { MentorshipBridge, MentorshipRequest } from "./types";

export function createMentorshipBridge(request: MentorshipRequest): MentorshipBridge {
  if (request.status !== "accepted") throw new Error("accepted_request_required");

  return {
    id: `mentorship_bridge_${request.seekerId}_${request.guardianId}_${request.domain}`,
    seekerId: request.seekerId,
    guardianId: request.guardianId,
    domain: request.domain,
    status: "active",
    threadSpaceId: `mentorship_thread_${request.seekerId}_${request.guardianId}`,
    prompts: [
      "What are you trying to become?",
      "What is one small action you can take today?",
      "What would support look like this week?",
    ],
  };
}

export function completeMentorshipBridge(bridge: MentorshipBridge): MentorshipBridge {
  return {
    ...bridge,
    status: "completed",
  };
}
