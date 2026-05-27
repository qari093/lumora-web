import {
  createGmarAdminContext,
  createGmarAdminAction,
  assertGmarAdminAction
} from "@/src/core/gmar/final-completion/admin/adminModeration";

describe("GMAR Final Completion Phase 11 — Admin + Moderation", () => {
  it("creates admin context", () => {
    const context = createGmarAdminContext({
      adminId: "admin_001",
      role: "operator"
    });

    expect(context.adminId).toBe("admin_001");
    expect(context.role).toBe("operator");
    expect(context.permissionReady).toBe(true);
    expect(context.auditLoggingReady).toBe(true);
  });

  it("creates approved admin action", () => {
    const context = createGmarAdminContext({
      adminId: "admin_001",
      role: "operator"
    });

    const action = createGmarAdminAction({
      context,
      type: "reward_adjustment",
      targetId: "gmar_user_001",
      now: new Date("2026-05-09T00:00:00.000Z")
    });

    expect(action.approved).toBe(true);
    expect(action.auditLogged).toBe(true);
    expect(action.rollbackReady).toBe(true);
    expect(assertGmarAdminAction(action)).toBe(true);
  });

  it("blocks unauthorized action", () => {
    const context = createGmarAdminContext({
      adminId: "admin_001",
      role: "viewer"
    });

    expect(() =>
      createGmarAdminAction({
        context,
        type: "ban_player",
        targetId: "gmar_user_001"
      })
    ).toThrow("GMAR admin permission denied.");
  });

  it("allows owner rollback", () => {
    const context = createGmarAdminContext({
      adminId: "owner_001",
      role: "owner"
    });

    const action = createGmarAdminAction({
      context,
      type: "rollback",
      targetId: "event_origin_storm"
    });

    expect(action.type).toBe("rollback");
    expect(assertGmarAdminAction(action)).toBe(true);
  });
});
