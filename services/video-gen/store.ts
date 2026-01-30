export type VideoGenJobStatus = "queued" | "running" | "done" | "failed";

export type VideoGenJob = {
  jobId: string;
  createdAt: number;
  updatedAt: number;
  status: VideoGenJobStatus;
  promptHash: string; // never store raw prompt
  durationSec: number;
  aspect: "9:16" | "16:9" | "1:1";
  resultUrl?: string;
  error?: string;
};

const JOBS = new Map<string, VideoGenJob>();

function sha256Hex(input: string): string {
  // Node runtime only. Safe in Next.js route runtime=nodejs.
  const crypto = require("crypto") as typeof import("crypto");
  return crypto.createHash("sha256").update(input, "utf8").digest("hex");
}

export function createJob(input: {
  prompt: string;
  durationSec: number;
  aspect: "9:16" | "16:9" | "1:1";
}): VideoGenJob {
  const now = Date.now();
  const jobId = `vid_${now}_${Math.random().toString(36).slice(2, 10)}`;

  const job: VideoGenJob = {
    jobId,
    createdAt: now,
    updatedAt: now,
    status: "queued",
    promptHash: sha256Hex(input.prompt).slice(0, 32),
    durationSec: input.durationSec,
    aspect: input.aspect,
  };

  JOBS.set(jobId, job);
  return job;
}

export function getJob(jobId: string): VideoGenJob | null {
  return JOBS.get(jobId) ?? null;
}

export function updateJob(
  jobId: string,
  patch: Partial<Omit<VideoGenJob, "jobId" | "createdAt">>
): VideoGenJob | null {
  const j = JOBS.get(jobId);
  if (!j) return null;
  const next: VideoGenJob = {
    ...j,
    ...patch,
    updatedAt: Date.now(),
  };
  JOBS.set(jobId, next);
  return next;
}

export function resetStoreForTests() {
  JOBS.clear();
}
