import { beforeEach, describe, expect, it } from "vitest";
import {
  addGroupMember,
  createConnection,
  createGroup,
  getLumaLinkHealth,
  getPresence,
  listConnections,
  listGroups,
  listMessages,
  relationshipBetween,
  resetLumaLinkRuntimeForTests,
  sendMessage,
  setPresence,
  updateConnectionStatus,
} from "@/src/core/lumalink/runtime";

describe("LumaLink 3.0 canonical runtime foundation", () => {
  beforeEach(() => {
    resetLumaLinkRuntimeForTests();
  });

  it("creates consent-first relationships", () => {
    createConnection({ requesterId: "waqar", recipientId: "hamza" });

    expect(listConnections("waqar")).toHaveLength(1);
    expect(relationshipBetween("hamza", "waqar")?.status).toBe("pending");

    const accepted = updateConnectionStatus({
      requesterId: "waqar",
      recipientId: "hamza",
      status: "accepted",
    });

    expect(accepted.status).toBe("accepted");
  });

  it("prevents self-connections", () => {
    expect(() =>
      createConnection({ requesterId: "waqar", recipientId: "waqar" }),
    ).toThrow("self_connection_forbidden");
  });

  it("creates owner-controlled groups", () => {
    const group = createGroup({
      name: "Founding Circle",
      ownerId: "waqar",
      memberIds: ["hamza"],
    });

    const updated = addGroupMember({
      groupId: group.id,
      actorId: "waqar",
      memberId: "sara",
    });

    expect(updated.memberIds).toEqual(
      expect.arrayContaining(["waqar", "hamza", "sara"]),
    );
    expect(listGroups("sara")).toHaveLength(1);
  });

  it("requires accepted relationships for direct messages", () => {
    createConnection({ requesterId: "waqar", recipientId: "hamza" });

    expect(() =>
      sendMessage({
        senderId: "waqar",
        recipientId: "hamza",
        body: "Hello",
      }),
    ).toThrow("accepted_connection_required");

    updateConnectionStatus({
      requesterId: "waqar",
      recipientId: "hamza",
      status: "accepted",
    });

    const message = sendMessage({
      senderId: "waqar",
      recipientId: "hamza",
      body: "Hello",
    });

    expect(listMessages(message.conversationId)).toHaveLength(1);
  });

  it("allows group members to send group messages", () => {
    const group = createGroup({
      name: "Builders",
      ownerId: "waqar",
      memberIds: ["hamza"],
    });

    const message = sendMessage({
      senderId: "hamza",
      groupId: group.id,
      body: "Ready",
    });

    expect(message.conversationId).toBe(`group:${group.id}`);
  });

  it("stores optional presence state", () => {
    expect(getPresence("waqar").status).toBe("offline");
    expect(setPresence({ userId: "waqar", status: "online" }).status).toBe(
      "online",
    );
  });

  it("exposes the complete LumaLink capability contract", () => {
    const health = getLumaLinkHealth();

    expect(health.ok).toBe(true);
    expect(health.version).toBe("3.0");
    expect(Object.values(health.capabilities).every(Boolean)).toBe(true);
  });
});
