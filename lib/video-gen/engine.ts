export type VideoGenJobStatus = "queued" | "done" | "failed";

export type VideoGenJob = {
  jobId: string;
  prompt: string;
  status: VideoGenJobStatus;
  createdAt: number;
  updatedAt: number;
  error?: string;
};

const STORE_KEY = Symbol.for("lumora.video_gen.store.v1");

type Store = Map<string, VideoGenJob>;

function getGlobalStore(): Store {
  const g = globalThis as any;
  if (!g[STORE_KEY]) g[STORE_KEY] = new Map<string, VideoGenJob>();
  return g[STORE_KEY] as Store;
}

function now() {
  return Date.now();
}

function newId(): string {
  const c: any = globalThis as any;
  if (c.crypto && typeof c.crypto.randomUUID === "function") return c.crypto.randomUUID();
  // Fallback stable-enough for tests
  return "job_" + Math.random().toString(16).slice(2) + "_" + Math.random().toString(16).slice(2);
}

export function createJob(prompt: string): VideoGenJob {
  const jobId = newId();
  const t = now();
  const job: VideoGenJob = { jobId, prompt, status: "queued", createdAt: t, updatedAt: t };
  const store = getGlobalStore();
  store.set(jobId, job);

  // Synchronous mock completion for contract tests:
  // status endpoint is expected to return "done" immediately after submit.
  const done: VideoGenJob = { ...job, status: "done", updatedAt: now() };
  store.set(jobId, done);
  return done;
}

export function getJob(jobId: string): VideoGenJob | undefined {
  return getGlobalStore().get(jobId);
}

export function clearAllJobsForTestsOnly() {
  getGlobalStore().clear();
}
