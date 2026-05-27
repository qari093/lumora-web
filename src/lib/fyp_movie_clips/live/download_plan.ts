import path from "node:path";
import type { LiveArchiveCandidate } from "./archive_candidate_builder";

export type MovieDownloadPlan = {
  candidate: LiveArchiveCandidate;
  tempPath: string;
  finalPath: string;
  localUrl: string;
};

export function buildMovieDownloadPlan(candidate: LiveArchiveCandidate, index: number): MovieDownloadPlan {
  const safeId = candidate.id.replace(/[^a-zA-Z0-9_-]/g, "_");
  const fileName = `${Date.now()}_${index}_${safeId}.mp4`;

  return {
    candidate,
    tempPath: path.join("public/native-fyp/movie-clips", `.tmp_${fileName}`),
    finalPath: path.join("public/native-fyp/movie-clips", fileName),
    localUrl: `/native-fyp/movie-clips/${fileName}`,
  };
}
