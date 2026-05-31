import type { ChronicleMoment } from "./types";

export function createChronicleMoment(input: {
  id: string;
  sourceMemoryId: string;
  title: string;
  summary: string;
  emotionalWeight?: number;
  contributionWeight?: number;
  connectionWeight?: number;
}): ChronicleMoment {
  if (!input.id.trim()) throw new Error("chronicle_moment_id_required");
  if (!input.sourceMemoryId.trim()) throw new Error("sourceMemoryId_required");

  return {
    id: input.id,
    sourceMemoryId: input.sourceMemoryId,
    title: input.title,
    summary: input.summary,
    emotionalWeight: Math.max(0, Math.min(100, input.emotionalWeight ?? 50)),
    contributionWeight: Math.max(0, Math.min(100, input.contributionWeight ?? 50)),
    connectionWeight: Math.max(0, Math.min(100, input.connectionWeight ?? 50)),
  };
}

export function rankChronicleMoments(moments: ChronicleMoment[]): ChronicleMoment[] {
  return [...moments].sort((a, b) => {
    const scoreA = a.emotionalWeight * 0.4 + a.contributionWeight * 0.3 + a.connectionWeight * 0.3;
    const scoreB = b.emotionalWeight * 0.4 + b.contributionWeight * 0.3 + b.connectionWeight * 0.3;
    return scoreB - scoreA;
  });
}
