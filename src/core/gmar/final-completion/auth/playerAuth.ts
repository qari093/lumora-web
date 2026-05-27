import {
  createGmarPlayerProfile,
  type GmarPlayerProfile
} from "@/src/core/gmar/player/playerIdentity";

export type GmarAuthSession = {
  sessionId: string;
  userId: string;
  playerId: string;
  authenticated: boolean;
  protectedApisReady: true;
  routeGuardReady: true;
  permissionReady: true;
  guestUpgradeReady: true;
  recoveryReady: true;
  createdAt: string;
};

export function createGmarAuthSession(input: {
  userId: string;
  displayName?: string;
  sessionId?: string;
  now?: Date;
}): {
  session: GmarAuthSession;
  player: GmarPlayerProfile;
} {
  const userId = input.userId.trim();

  if (!userId) {
    throw new Error("GMAR auth requires userId.");
  }

  const now = input.now ?? new Date();
  const player = createGmarPlayerProfile({
    userId,
    displayName: input.displayName,
    now
  });

  return {
    player,
    session: {
      sessionId: input.sessionId?.trim() || `gmar_session_${userId}`,
      userId,
      playerId: player.playerId,
      authenticated: true,
      protectedApisReady: true,
      routeGuardReady: true,
      permissionReady: true,
      guestUpgradeReady: true,
      recoveryReady: true,
      createdAt: now.toISOString()
    }
  };
}

export function assertGmarAuthSession(session: GmarAuthSession): true {
  if (
    !session.sessionId ||
    !session.userId ||
    !session.playerId ||
    session.authenticated !== true ||
    session.protectedApisReady !== true ||
    session.routeGuardReady !== true ||
    session.permissionReady !== true ||
    session.guestUpgradeReady !== true ||
    session.recoveryReady !== true
  ) {
    throw new Error("Invalid GMAR auth session.");
  }

  return true;
}

export function assertGmarPlayerPermission(input: {
  session: GmarAuthSession;
  playerId: string;
}): true {
  if (!input.session.authenticated) {
    throw new Error("GMAR auth session is not authenticated.");
  }

  if (input.session.playerId !== input.playerId) {
    throw new Error("GMAR player permission denied.");
  }

  return true;
}
