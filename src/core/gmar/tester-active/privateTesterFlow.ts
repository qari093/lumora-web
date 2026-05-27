export type GmarTesterStatus =
  | "invited"
  | "accepted"
  | "active"
  | "blocked";

export type GmarPrivateTesterProfile = {
  testerId: string;
  displayName: string;
  status: GmarTesterStatus;
  firstSessionComplete: boolean;
  missionComplete: boolean;
  rewardClaimed: boolean;
  returnIntentCaptured: boolean;
  bugReportEnabled: boolean;
  createdAt: string;
  updatedAt: string;
};

export function createGmarPrivateTesterProfile(input: {
  testerId: string;
  displayName: string;
  now?: Date;
}): GmarPrivateTesterProfile {
  const testerId = input.testerId.trim();
  const displayName = input.displayName.trim();

  if (!testerId || !displayName) {
    throw new Error("GMAR private tester requires testerId and displayName.");
  }

  const iso = (input.now ?? new Date()).toISOString();

  return {
    testerId,
    displayName,
    status: "invited",
    firstSessionComplete: false,
    missionComplete: false,
    rewardClaimed: false,
    returnIntentCaptured: false,
    bugReportEnabled: true,
    createdAt: iso,
    updatedAt: iso
  };
}

export function activateGmarPrivateTester(
  profile: GmarPrivateTesterProfile
): GmarPrivateTesterProfile {
  if (profile.status === "blocked") {
    throw new Error("Blocked GMAR tester cannot be activated.");
  }

  return {
    ...profile,
    status: "active",
    updatedAt: new Date().toISOString()
  };
}

export function completeGmarTesterFirstSession(
  profile: GmarPrivateTesterProfile
): GmarPrivateTesterProfile {
  if (profile.status !== "active") {
    throw new Error("GMAR tester must be active before first session completion.");
  }

  return {
    ...profile,
    firstSessionComplete: true,
    missionComplete: true,
    rewardClaimed: true,
    returnIntentCaptured: true,
    updatedAt: new Date().toISOString()
  };
}

export function assertGmarPrivateTesterProfile(
  profile: GmarPrivateTesterProfile
): true {
  if (
    !profile.testerId ||
    !profile.displayName ||
    profile.bugReportEnabled !== true ||
    !["invited", "accepted", "active", "blocked"].includes(profile.status)
  ) {
    throw new Error("Invalid GMAR private tester profile.");
  }

  return true;
}
