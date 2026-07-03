import type { CollaborativeObject } from "./types";

export function suggestCollaborators(params: {
  object: CollaborativeObject;
  candidateUserIds: string[];
  relationshipScores: Record<string, number>;
}): string[] {
  const existing = new Set(params.object.members.map((member) => member.userId));

  return params.candidateUserIds
    .filter((userId) => !existing.has(userId))
    .sort((a, b) => (params.relationshipScores[b] ?? 0) - (params.relationshipScores[a] ?? 0))
    .slice(0, 5);
}

export function summarizeCollaborationHealth(object: CollaborativeObject) {
  const conflictPenalty = Math.min(0.4, object.conflicts.filter((conflict) => conflict.status === "pending").length * 0.1);
  const memberScore = Math.min(0.35, object.members.length * 0.05);
  const activityScore = Math.min(0.25, object.versions.length * 0.03);
  const score = Number(Math.max(0, Math.min(1, 0.5 + memberScore + activityScore - conflictPenalty)).toFixed(4));

  return {
    score,
    state: score >= 0.8 ? "thriving" : score >= 0.55 ? "healthy" : "needs_attention",
    pendingConflicts: object.conflicts.filter((conflict) => conflict.status === "pending").length,
    memberCount: object.members.length,
    versionCount: object.versions.length,
  };
}

export function createContributionSummary(object: CollaborativeObject): string {
  return `${object.title}: ${object.members.length} collaborators, ${object.objectIds.length} shared objects, ${object.versions.length} versions.`;
}
