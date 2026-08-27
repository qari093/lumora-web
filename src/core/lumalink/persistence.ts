import { prisma } from "@/lib/prisma";

const clean = (value: unknown) => String(value ?? "").trim();

export function directConversationId(a: string, b: string): string {
  return "direct:" + [a, b].sort().join(":");
}

export async function findRelationship(a: string, b: string) {
  return prisma.lumaLinkConnection.findFirst({
    where: {
      OR: [
        { requesterId: a, recipientId: b },
        { requesterId: b, recipientId: a },
      ],
    },
  });
}

export async function listUserConnections(userId: string) {
  return prisma.lumaLinkConnection.findMany({
    where: {
      OR: [{ requesterId: userId }, { recipientId: userId }],
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function createConnectionForActor(
  actorId: string,
  recipientInput: unknown,
) {
  const recipientId = clean(recipientInput);

  if (!recipientId) throw new Error("recipientId_required");
  if (recipientId === actorId) throw new Error("self_connection_forbidden");

  const existing = await findRelationship(actorId, recipientId);
  if (existing) throw new Error("connection_already_exists");

  const pairKey = [actorId, recipientId].sort().join("::");

  return prisma.lumaLinkConnection.create({
    data: {
      pairKey,
      requesterId: actorId,
      recipientId,
      status: "pending",
    },
  });
}

export async function updateConnectionForActor(
  actorId: string,
  otherInput: unknown,
  statusInput: unknown,
) {
  const otherUserId = clean(otherInput);
  const status = clean(statusInput);

  if (!otherUserId) throw new Error("otherUserId_required");
  if (!["accepted", "blocked"].includes(status)) {
    throw new Error("invalid_connection_status");
  }

  const connection = await findRelationship(actorId, otherUserId);

  if (!connection) throw new Error("connection_not_found");

  if (status === "accepted" && connection.recipientId !== actorId) {
    throw new Error("recipient_only_acceptance");
  }

  if (
    connection.requesterId !== actorId &&
    connection.recipientId !== actorId
  ) {
    throw new Error("connection_access_forbidden");
  }

  return prisma.lumaLinkConnection.update({
    where: { id: connection.id },
    data: { status },
  });
}

export async function listGroupsForActor(actorId: string) {
  const memberships = await prisma.lumaLinkGroupMember.findMany({
    where: { userId: actorId },
    select: { groupId: true },
  });

  return prisma.lumaLinkGroup.findMany({
    where: {
      id: {
        in: memberships.map((row) => row.groupId),
      },
    },
    include: { members: true },
    orderBy: { updatedAt: "desc" },
  });
}

export async function createGroupForActor(
  actorId: string,
  nameInput: unknown,
  memberInputs: unknown,
) {
  const name = clean(nameInput);

  if (!name) throw new Error("group_name_required");

  const requested = Array.isArray(memberInputs)
    ? memberInputs.map(clean).filter(Boolean)
    : [];

  const memberIds = [...new Set([actorId, ...requested])];

  return prisma.lumaLinkGroup.create({
    data: {
      name,
      ownerId: actorId,
      members: {
        create: memberIds.map((userId) => ({ userId })),
      },
    },
    include: { members: true },
  });
}

export async function addGroupMemberForActor(
  actorId: string,
  groupInput: unknown,
  memberInput: unknown,
) {
  const groupId = clean(groupInput);
  const memberId = clean(memberInput);

  if (!groupId) throw new Error("groupId_required");
  if (!memberId) throw new Error("memberId_required");

  const group = await prisma.lumaLinkGroup.findUnique({
    where: { id: groupId },
  });

  if (!group) throw new Error("group_not_found");
  if (group.ownerId !== actorId) throw new Error("group_owner_required");

  await prisma.lumaLinkGroupMember.upsert({
    where: {
      groupId_userId: {
        groupId,
        userId: memberId,
      },
    },
    create: {
      groupId,
      userId: memberId,
    },
    update: {},
  });

  return prisma.lumaLinkGroup.findUnique({
    where: { id: groupId },
    include: { members: true },
  });
}

async function requireGroupMember(actorId: string, groupId: string) {
  const membership = await prisma.lumaLinkGroupMember.findUnique({
    where: {
      groupId_userId: {
        groupId,
        userId: actorId,
      },
    },
  });

  if (!membership) throw new Error("group_membership_required");
}

async function requireAcceptedConnection(
  actorId: string,
  otherUserId: string,
) {
  const relationship = await findRelationship(actorId, otherUserId);

  if (!relationship || relationship.status !== "accepted") {
    throw new Error("accepted_connection_required");
  }
}

export async function listMessagesForActor(
  actorId: string,
  conversationInput: unknown,
) {
  const conversationId = clean(conversationInput);

  if (!conversationId) throw new Error("conversationId_required");

  if (conversationId.startsWith("group:")) {
    await requireGroupMember(actorId, conversationId.slice(6));
  } else if (conversationId.startsWith("direct:")) {
    const participants = conversationId.slice(7).split(":");

    if (
      participants.length !== 2 ||
      !participants.includes(actorId)
    ) {
      throw new Error("conversation_access_forbidden");
    }

    const other =
      participants[0] === actorId
        ? participants[1]
        : participants[0];

    await requireAcceptedConnection(actorId, other);
  } else {
    throw new Error("invalid_conversation_id");
  }

  return prisma.lumaLinkMessage.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
    take: 500,
  });
}

export async function sendMessageForActor(
  actorId: string,
  input: {
    recipientId?: unknown;
    groupId?: unknown;
    body?: unknown;
  },
) {
  const recipientId = clean(input.recipientId);
  const groupId = clean(input.groupId);
  const body = clean(input.body);

  if (!body) throw new Error("message_body_required");
  if (body.length > 10000) throw new Error("message_body_too_large");

  if (Boolean(recipientId) === Boolean(groupId)) {
    throw new Error("message_target_required");
  }

  if (groupId) {
    await requireGroupMember(actorId, groupId);

    return prisma.lumaLinkMessage.create({
      data: {
        conversationId: "group:" + groupId,
        senderId: actorId,
        groupId,
        body,
      },
    });
  }

  if (recipientId === actorId) {
    throw new Error("self_message_forbidden");
  }

  await requireAcceptedConnection(actorId, recipientId);

  return prisma.lumaLinkMessage.create({
    data: {
      conversationId: directConversationId(actorId, recipientId),
      senderId: actorId,
      recipientId,
      body,
    },
  });
}

export async function setPresenceForActor(
  actorId: string,
  statusInput: unknown,
) {
  const status = clean(statusInput);

  if (!["offline", "away", "online"].includes(status)) {
    throw new Error("invalid_presence_status");
  }

  return prisma.lumaLinkPresence.upsert({
    where: { userId: actorId },
    create: {
      userId: actorId,
      status,
    },
    update: { status },
  });
}

export async function getPresenceForActor(
  actorId: string,
  targetInput?: unknown,
) {
  const targetUserId = clean(targetInput) || actorId;

  if (targetUserId !== actorId) {
    await requireAcceptedConnection(actorId, targetUserId);
  }

  const presence = await prisma.lumaLinkPresence.findUnique({
    where: { userId: targetUserId },
  });

  return (
    presence ?? {
      userId: targetUserId,
      status: "offline",
      updatedAt: null,
    }
  );
}
