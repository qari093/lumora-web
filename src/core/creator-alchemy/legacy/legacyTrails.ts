import type { LegacyTrailPolicy } from "./types";

export function canResurfaceLegacyWork(policy: LegacyTrailPolicy, workId: string): boolean {
  if (policy.blockedWorkIds.includes(workId)) return false;
  return policy.allowedWorkIds.includes(workId);
}

export function createLegacyTrailPolicy(input: {
  creatorId: string;
  allowedWorkIds?: string[];
  blockedWorkIds?: string[];
}): LegacyTrailPolicy {
  return {
    creatorId: input.creatorId,
    allowedWorkIds: [...new Set(input.allowedWorkIds ?? [])],
    blockedWorkIds: [...new Set(input.blockedWorkIds ?? [])]
  };
}
