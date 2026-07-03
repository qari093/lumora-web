import type { CollaborationPresence, CollaborativeObject } from "./types";

export function updateCollaborationPresence(
  object: CollaborativeObject,
  presence: CollaborationPresence,
): CollaborativeObject {
  return {
    ...object,
    presence: [
      ...object.presence.filter((item) => item.userId !== presence.userId),
      {
        ...presence,
        updatedAt: presence.updatedAt || new Date().toISOString(),
      },
    ],
    members: object.members.map((member) =>
      member.userId === presence.userId
        ? { ...member, presence: presence.typing ? "editing" : presence.reaction ? "reacting" : "viewing" }
        : member,
    ),
  };
}

export function summarizeLiveCollaboration(object: CollaborativeObject) {
  return {
    activeUsers: object.presence.length,
    typingUsers: object.presence.filter((presence) => presence.typing).map((presence) => presence.userId),
    reactingUsers: object.presence.filter((presence) => Boolean(presence.reaction)).map((presence) => presence.userId),
  };
}
