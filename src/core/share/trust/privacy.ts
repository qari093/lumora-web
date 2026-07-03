import type { PrivacyPolicy } from "./types";

export function createPrivacyPolicy(input: Partial<PrivacyPolicy> & { ownerId: string }): PrivacyPolicy {
  return {
    ownerId: input.ownerId,
    audience: input.audience ?? "friends",
    allowedActorIds: input.allowedActorIds ?? [],
    deniedActorIds: input.deniedActorIds ?? [],
    expiresAt: input.expiresAt,
    revocable: input.revocable ?? true,
  };
}

export function isShareExpired(policy: PrivacyPolicy, now = Date.now()): boolean {
  return Boolean(policy.expiresAt && Date.parse(policy.expiresAt) <= now);
}

export function canActorView(policy: PrivacyPolicy, actorId: string): boolean {
  if (isShareExpired(policy)) return false;
  if (policy.deniedActorIds.includes(actorId)) return false;
  if (actorId === policy.ownerId) return true;
  if (policy.audience === "self") return false;
  if (policy.allowedActorIds.includes(actorId)) return true;
  return policy.audience === "public" || policy.audience === "community" || policy.audience === "external";
}

export function revokePrivacyPolicy(policy: PrivacyPolicy): PrivacyPolicy {
  return {
    ...policy,
    audience: "self",
    allowedActorIds: [],
    deniedActorIds: Array.from(new Set([...policy.deniedActorIds, "*"])),
  };
}
