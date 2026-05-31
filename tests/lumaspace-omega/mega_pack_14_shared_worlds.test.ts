import { describe, expect, it } from "vitest";
import { createSharedWorld, addWorldRitual } from "@/src/core/lumaspace/omega/shared-worlds/worldEngine";
import { addSharedWorldMember, promoteSharedWorldMember, canInviteToSharedWorld } from "@/src/core/lumaspace/omega/shared-worlds/memberEngine";
import { createSharedWorldInvite, acceptSharedWorldInvite } from "@/src/core/lumaspace/omega/shared-worlds/inviteEngine";
import { addSharedWorldMemory, addSharedWorldBloom } from "@/src/core/lumaspace/omega/shared-worlds/memoryEngine";
import { calculateSharedWorldHealth } from "@/src/core/lumaspace/omega/shared-worlds/healthEngine";
import { runLumaSpaceOmegaMegaPack14Runtime } from "@/src/core/lumaspace/omega/shared-worlds/omegaPack14Runtime";

describe("LumaSpace Ω∞ Mega Pack 14 — Shared Worlds", () => {
  it("creates private shared world", () => {
    const world = createSharedWorld({
      id: "w1",
      type: "family",
      title: "Family World",
      ownerId: "u1",
    });

    expect(world.privateByDefault).toBe(true);
    expect(world.members[0].role).toBe("guardian");
  });

  it("adds rituals and members", () => {
    let world = createSharedWorld({
      id: "w2",
      type: "learning",
      title: "Learning World",
      ownerId: "u1",
    });

    world = addWorldRitual(world, "Weekly Reflection");
    world = addSharedWorldMember(world, "u2", "builder");

    expect(world.rituals).toContain("Weekly Reflection");
    expect(world.members).toHaveLength(2);
  });

  it("promotes member to steward invite role", () => {
    let world = createSharedWorld({
      id: "w3",
      type: "team",
      title: "Team World",
      ownerId: "u1",
    });

    world = addSharedWorldMember(world, "u2", "member");
    world = promoteSharedWorldMember(world, "u2", "steward");

    expect(canInviteToSharedWorld(world, "u2")).toBe(true);
  });

  it("creates and accepts invite", () => {
    let world = createSharedWorld({
      id: "w4",
      type: "creator",
      title: "Creator World",
      ownerId: "u1",
    });

    const invite = createSharedWorldInvite({
      world,
      invitedBy: "u1",
      invitedCitizenId: "u2",
    });

    const result = acceptSharedWorldInvite(world, invite);

    expect(result.invite.status).toBe("accepted");
    expect(result.world.members.some((member) => member.citizenId === "u2")).toBe(true);
  });

  it("adds memory and bloom", () => {
    let world = createSharedWorld({
      id: "w5",
      type: "wellness",
      title: "Wellness World",
      ownerId: "u1",
    });

    world = addSharedWorldMemory(world, "m1");
    world = addSharedWorldBloom(world, "b1");

    expect(world.memoryIds).toContain("m1");
    expect(world.treeBloomIds).toContain("b1");
  });

  it("calculates world health", () => {
    let world = createSharedWorld({
      id: "w6",
      type: "creator",
      title: "Creator World",
      ownerId: "u1",
    });

    world = addSharedWorldMember(world, "u2", "member");
    world = addSharedWorldMemory(world, "m1");
    world = addWorldRitual(world, "Ritual");

    const health = calculateSharedWorldHealth(world);

    expect(health.memberCount).toBe(2);
    expect(health.healthScore).toBeGreaterThan(30);
  });

  it("runs full mega pack runtime", () => {
    const runtime = runLumaSpaceOmegaMegaPack14Runtime();

    expect(runtime.ok).toBe(true);
    expect(runtime.world.members).toHaveLength(3);
    expect(runtime.health.healthScore).toBeGreaterThan(40);
  });
});
