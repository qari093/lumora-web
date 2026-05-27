export type GmarPrivateTester = {
  testerId: string;
  invited: boolean;
  accepted: boolean;
};

export type GmarPrivatePlaytestSession = {
  sessionId: string;
  testerId: string;
  accessGranted: boolean;
  targetTesterCount: number;
  metrics: {
    firstSessionTracked: boolean;
    missionCompletionTracked: boolean;
    rewardClaimTracked: boolean;
    returnIntentTracked: boolean;
    bugCaptureEnabled: boolean;
  };
};

export function createGmarPrivatePlaytestSession(input: {
  testerId: string;
  accepted: boolean;
}): GmarPrivatePlaytestSession {
  const testerId = input.testerId.trim();

  if (!testerId) {
    throw new Error("GMAR private playtest testerId is required.");
  }

  if (input.accepted !== true) {
    throw new Error("GMAR private playtest access requires accepted invite.");
  }

  return {
    sessionId: `gmar_private_playtest_${testerId}`,
    testerId,
    accessGranted: true,
    targetTesterCount: 10,
    metrics: {
      firstSessionTracked: true,
      missionCompletionTracked: true,
      rewardClaimTracked: true,
      returnIntentTracked: true,
      bugCaptureEnabled: true
    }
  };
}

export function assertGmarPrivatePlaytestSession(
  session: GmarPrivatePlaytestSession
): true {
  if (
    !session.sessionId ||
    session.accessGranted !== true ||
    session.targetTesterCount < 5 ||
    session.metrics.firstSessionTracked !== true ||
    session.metrics.bugCaptureEnabled !== true
  ) {
    throw new Error("Invalid GMAR private playtest session.");
  }

  return true;
}
