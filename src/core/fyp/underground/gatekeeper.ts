export type GatekeeperPass = {
  passId: string;
  gatekeeperUserId: string;
  invitedUserId: string;
  singleUse: true;
  used: boolean;
  issuedAt: number;
};

export function createGatekeeperPass(input: {
  gatekeeperUserId: string;
  invitedUserId: string;
  now?: number;
}): GatekeeperPass {
  if (!input.gatekeeperUserId.trim() || !input.invitedUserId.trim()) {
    throw new Error("Gatekeeper pass requires gatekeeperUserId and invitedUserId.");
  }

  const now = input.now ?? Date.now();

  return {
    passId: `gatekeeper_${input.gatekeeperUserId}_${input.invitedUserId}_${now}`,
    gatekeeperUserId: input.gatekeeperUserId,
    invitedUserId: input.invitedUserId,
    singleUse: true,
    used: false,
    issuedAt: now
  };
}

export function redeemGatekeeperPass(
  pass: GatekeeperPass
): GatekeeperPass {
  if (pass.used) {
    throw new Error("Gatekeeper pass already used.");
  }

  return {
    ...pass,
    used: true
  };
}
