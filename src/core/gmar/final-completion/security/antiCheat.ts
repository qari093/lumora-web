export type GmarSecurityAction =
  | "reward_claim"
  | "xp_gain"
  | "inventory_grant"
  | "session_join"
  | "economy_spend";

export type GmarSecurityRequest = {
  playerId: string;
  action: GmarSecurityAction;
  requestId: string;
  timestamp: number;
  signature: string;
  cooldownKey: string;
  amount?: number;
};

export type GmarSecurityDecision = {
  allowed: boolean;
  playerId: string;
  action: GmarSecurityAction;
  requestId: string;
  signed: boolean;
  cooldownValid: boolean;
  amountValid: boolean;
  suspicious: boolean;
  reason: string;
};

export function createGmarRequestSignature(input: {
  playerId: string;
  action: GmarSecurityAction;
  requestId: string;
}): string {
  const raw = `${input.playerId}:${input.action}:${input.requestId}`;
  let hash = 0;

  for (let index = 0; index < raw.length; index += 1) {
    hash = (hash * 31 + raw.charCodeAt(index)) >>> 0;
  }

  return `gmar_sig_${hash.toString(16)}`;
}

export function evaluateGmarSecurityRequest(input: {
  request: GmarSecurityRequest;
  previousCooldownKeys?: string[];
  maxAmount?: number;
}): GmarSecurityDecision {
  const expectedSignature = createGmarRequestSignature({
    playerId: input.request.playerId,
    action: input.request.action,
    requestId: input.request.requestId
  });

  const signed = input.request.signature === expectedSignature;
  const cooldownValid = !(input.previousCooldownKeys ?? []).includes(
    input.request.cooldownKey
  );

  const maxAmount = input.maxAmount ?? 100;
  const amount = input.request.amount ?? 0;
  const amountValid = amount >= 0 && amount <= maxAmount;

  const suspicious =
    !signed ||
    !cooldownValid ||
    !amountValid ||
    !input.request.playerId.trim() ||
    !input.request.requestId.trim();

  return {
    allowed: suspicious === false,
    playerId: input.request.playerId,
    action: input.request.action,
    requestId: input.request.requestId,
    signed,
    cooldownValid,
    amountValid,
    suspicious,
    reason: suspicious ? "GMAR security request blocked." : "GMAR security request allowed."
  };
}

export function assertGmarSecurityDecision(
  decision: GmarSecurityDecision
): true {
  if (
    decision.allowed !== true ||
    decision.signed !== true ||
    decision.cooldownValid !== true ||
    decision.amountValid !== true ||
    decision.suspicious !== false
  ) {
    throw new Error("GMAR security decision blocked.");
  }

  return true;
}
