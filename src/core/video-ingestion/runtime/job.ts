export type IngestionJobState =
  | "queued"
  | "discovering"
  | "importing"
  | "validated"
  | "failed"
  | "complete";

export type IngestionJob = {
  id: string;
  providerId: string;
  state: IngestionJobState;
  assetIds: string[];
  attempts: number;
  errors: string[];
  createdAt: string;
  updatedAt: string;
};

import { createIngestionJobId } from "./ids";

export function createIngestionJob(providerId: string): IngestionJob {
  const now = new Date().toISOString();

  return {
    id: createIngestionJobId(providerId, now),
    providerId,
    state: "queued",
    assetIds: [],
    attempts: 0,
    errors: [],
    createdAt: now,
    updatedAt: now,
  };
}

export function transitionIngestionJob(
  job: IngestionJob,
  state: IngestionJobState,
  error?: string,
): IngestionJob {
  return {
    ...job,
    state,
    attempts: state === "importing" ? job.attempts + 1 : job.attempts,
    errors: error ? [...job.errors, error] : job.errors,
    updatedAt: new Date().toISOString(),
  };
}

export function attachAsset(job: IngestionJob, assetId: string): IngestionJob {
  return {
    ...job,
    assetIds: [...new Set([...job.assetIds, assetId])],
    updatedAt: new Date().toISOString(),
  };
}
