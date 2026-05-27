import type { QueueJob } from "../types";

export function createQueueJob(type: string): QueueJob {
  return {
    id: `job_${type}`,
    type,
    retries: 0
  };
}
