export type GmarAdminRole =
  | "viewer"
  | "moderator"
  | "operator"
  | "owner";

export type GmarAdminActionType =
  | "player_lookup"
  | "wallet_audit"
  | "event_control"
  | "creator_review"
  | "reward_adjustment"
  | "ban_player"
  | "rollback";

export type GmarAdminContext = {
  adminId: string;
  role: GmarAdminRole;
  permissionReady: true;
  auditLoggingReady: true;
};

export type GmarAdminAction = {
  actionId: string;
  adminId: string;
  type: GmarAdminActionType;
  targetId: string;
  approved: boolean;
  auditLogged: true;
  rollbackReady: true;
  createdAt: string;
};

const ROLE_PERMISSIONS: Record<GmarAdminRole, GmarAdminActionType[]> = {
  viewer: ["player_lookup"],
  moderator: ["player_lookup", "creator_review", "ban_player"],
  operator: ["player_lookup", "wallet_audit", "event_control", "creator_review", "reward_adjustment", "ban_player"],
  owner: ["player_lookup", "wallet_audit", "event_control", "creator_review", "reward_adjustment", "ban_player", "rollback"]
};

export function createGmarAdminContext(input: {
  adminId: string;
  role: GmarAdminRole;
}): GmarAdminContext {
  const adminId = input.adminId.trim();

  if (!adminId) {
    throw new Error("GMAR adminId is required.");
  }

  return {
    adminId,
    role: input.role,
    permissionReady: true,
    auditLoggingReady: true
  };
}

export function createGmarAdminAction(input: {
  context: GmarAdminContext;
  type: GmarAdminActionType;
  targetId: string;
  now?: Date;
}): GmarAdminAction {
  const targetId = input.targetId.trim();

  if (!targetId) {
    throw new Error("GMAR admin targetId is required.");
  }

  const allowed = ROLE_PERMISSIONS[input.context.role].includes(input.type);

  if (!allowed) {
    throw new Error("GMAR admin permission denied.");
  }

  const iso = (input.now ?? new Date()).toISOString();

  return {
    actionId: `gmar_admin_${input.type}_${targetId}`,
    adminId: input.context.adminId,
    type: input.type,
    targetId,
    approved: true,
    auditLogged: true,
    rollbackReady: true,
    createdAt: iso
  };
}

export function assertGmarAdminAction(action: GmarAdminAction): true {
  if (
    !action.actionId ||
    !action.adminId ||
    !action.targetId ||
    action.approved !== true ||
    action.auditLogged !== true ||
    action.rollbackReady !== true
  ) {
    throw new Error("Invalid GMAR admin action.");
  }

  return true;
}
