export type ConnectionStatus = "pending" | "accepted" | "blocked";
export type PresenceStatus = "offline" | "away" | "online";

export type LumaLinkConnection = {
  id: string;
  requesterId: string;
  recipientId: string;
  status: ConnectionStatus;
  createdAt: string;
  updatedAt: string;
};

export type LumaLinkGroup = {
  id: string;
  name: string;
  ownerId: string;
  memberIds: string[];
  createdAt: string;
};

export type LumaLinkMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  recipientId?: string;
  groupId?: string;
  body: string;
  createdAt: string;
};

export type LumaLinkPresence = {
  userId: string;
  status: PresenceStatus;
  updatedAt: string;
};

type LumaLinkState = {
  connections: Map<string, LumaLinkConnection>;
  groups: Map<string, LumaLinkGroup>;
  messages: Map<string, LumaLinkMessage[]>;
  presence: Map<string, LumaLinkPresence>;
};

declare global {
  var __lumalink_runtime_state__: LumaLinkState | undefined;
}

function createState(): LumaLinkState {
  return {
    connections: new Map(),
    groups: new Map(),
    messages: new Map(),
    presence: new Map(),
  };
}

const state =
  global.__lumalink_runtime_state__ ??
  (global.__lumalink_runtime_state__ = createState());

function clean(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function stablePair(a: string, b: string): string {
  return [a, b].sort().join(":");
}

function id(prefix: string): string {
  return `${prefix}_${crypto.randomUUID()}`;
}

function now(): string {
  return new Date().toISOString();
}

export function createConnection(input: {
  requesterId: string;
  recipientId: string;
}): LumaLinkConnection {
  const requesterId = clean(input.requesterId);
  const recipientId = clean(input.recipientId);

  if (!requesterId || !recipientId) {
    throw new Error("connection_participants_required");
  }

  if (requesterId === recipientId) {
    throw new Error("self_connection_forbidden");
  }

  const pair = stablePair(requesterId, recipientId);
  const existing = state.connections.get(pair);

  if (existing) return existing;

  const timestamp = now();
  const connection: LumaLinkConnection = {
    id: id("connection"),
    requesterId,
    recipientId,
    status: "pending",
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  state.connections.set(pair, connection);
  return connection;
}

export function updateConnectionStatus(input: {
  requesterId: string;
  recipientId: string;
  status: ConnectionStatus;
}): LumaLinkConnection {
  const requesterId = clean(input.requesterId);
  const recipientId = clean(input.recipientId);
  const pair = stablePair(requesterId, recipientId);
  const existing = state.connections.get(pair);

  if (!existing) throw new Error("connection_not_found");

  const updated = {
    ...existing,
    status: input.status,
    updatedAt: now(),
  };

  state.connections.set(pair, updated);
  return updated;
}

export function listConnections(userId: string): LumaLinkConnection[] {
  const normalized = clean(userId);
  if (!normalized) return [];

  return [...state.connections.values()].filter(
    (connection) =>
      connection.requesterId === normalized ||
      connection.recipientId === normalized,
  );
}

export function relationshipBetween(
  firstUserId: string,
  secondUserId: string,
): LumaLinkConnection | null {
  return (
    state.connections.get(
      stablePair(clean(firstUserId), clean(secondUserId)),
    ) ?? null
  );
}

export function createGroup(input: {
  name: string;
  ownerId: string;
  memberIds?: string[];
}): LumaLinkGroup {
  const name = clean(input.name);
  const ownerId = clean(input.ownerId);

  if (!name || !ownerId) throw new Error("group_name_and_owner_required");

  const memberIds = [...new Set([ownerId, ...(input.memberIds ?? [])].map(clean))]
    .filter(Boolean);

  const group: LumaLinkGroup = {
    id: id("group"),
    name,
    ownerId,
    memberIds,
    createdAt: now(),
  };

  state.groups.set(group.id, group);
  return group;
}

export function listGroups(userId: string): LumaLinkGroup[] {
  const normalized = clean(userId);
  if (!normalized) return [];

  return [...state.groups.values()].filter((group) =>
    group.memberIds.includes(normalized),
  );
}

export function addGroupMember(input: {
  groupId: string;
  actorId: string;
  memberId: string;
}): LumaLinkGroup {
  const group = state.groups.get(clean(input.groupId));
  if (!group) throw new Error("group_not_found");
  if (group.ownerId !== clean(input.actorId)) {
    throw new Error("group_owner_required");
  }

  const memberId = clean(input.memberId);
  if (!memberId) throw new Error("member_id_required");

  const updated = {
    ...group,
    memberIds: [...new Set([...group.memberIds, memberId])],
  };

  state.groups.set(group.id, updated);
  return updated;
}

export function sendMessage(input: {
  senderId: string;
  recipientId?: string;
  groupId?: string;
  body: string;
}): LumaLinkMessage {
  const senderId = clean(input.senderId);
  const recipientId = clean(input.recipientId);
  const groupId = clean(input.groupId);
  const body = clean(input.body);

  if (!senderId || !body) throw new Error("message_sender_and_body_required");
  if (!recipientId && !groupId) throw new Error("message_target_required");

  let conversationId: string;

  if (groupId) {
    const group = state.groups.get(groupId);
    if (!group) throw new Error("group_not_found");
    if (!group.memberIds.includes(senderId)) {
      throw new Error("group_membership_required");
    }
    conversationId = `group:${groupId}`;
  } else {
    const connection = relationshipBetween(senderId, recipientId);
    if (!connection || connection.status !== "accepted") {
      throw new Error("accepted_connection_required");
    }
    conversationId = `direct:${stablePair(senderId, recipientId)}`;
  }

  const message: LumaLinkMessage = {
    id: id("message"),
    conversationId,
    senderId,
    recipientId: recipientId || undefined,
    groupId: groupId || undefined,
    body,
    createdAt: now(),
  };

  const messages = state.messages.get(conversationId) ?? [];
  state.messages.set(conversationId, [...messages, message]);

  return message;
}

export function listMessages(conversationId: string): LumaLinkMessage[] {
  return [...(state.messages.get(clean(conversationId)) ?? [])];
}

export function setPresence(input: {
  userId: string;
  status: PresenceStatus;
}): LumaLinkPresence {
  const userId = clean(input.userId);
  if (!userId) throw new Error("presence_user_required");

  const presence = {
    userId,
    status: input.status,
    updatedAt: now(),
  };

  state.presence.set(userId, presence);
  return presence;
}

export function getPresence(userId: string): LumaLinkPresence {
  const normalized = clean(userId);

  return (
    state.presence.get(normalized) ?? {
      userId: normalized,
      status: "offline",
      updatedAt: now(),
    }
  );
}

export function getLumaLinkHealth() {
  return {
    ok: true,
    service: "lumalink",
    version: "3.0",
    capabilities: {
      connections: true,
      relationships: true,
      groups: true,
      messaging: true,
      presence: true,
      translation: true,
      consentRequired: true,
    },
  };
}

export function resetLumaLinkRuntimeForTests(): void {
  state.connections.clear();
  state.groups.clear();
  state.messages.clear();
  state.presence.clear();
}
