import type { AccordRule, GuardianAccord } from "./types";

export function createGuardianAccord(communityId: string, rules: AccordRule[]): GuardianAccord {
  if (!communityId.trim()) throw new Error("communityId_required");

  return {
    communityId,
    rules,
    acceptedBy: [],
    active: rules.some((rule) => rule.required),
  };
}

export function acceptAccord(accord: GuardianAccord, guardianId: string): GuardianAccord {
  if (!guardianId.trim()) throw new Error("guardianId_required");
  return { ...accord, acceptedBy: Array.from(new Set([...accord.acceptedBy, guardianId])) };
}
