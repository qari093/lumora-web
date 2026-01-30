import { createJob, updateJob } from "./store";

export type VideoGenInput = {
  prompt: string;
  durationSec: number;
  aspect: "9:16" | "16:9" | "1:1";
};

export type VideoGenResult = {
  ok: boolean;
  jobId?: string;
  error?: string;
};

export async function generateVideo(
  input: VideoGenInput
): Promise<VideoGenResult> {
  if (!input.prompt || input.prompt.trim().length < 3) {
    return { ok: false, error: "invalid_prompt" };
  }
  if (typeof input.durationSec !== "number" || input.durationSec <= 0 || input.durationSec > 120) {
    return { ok: false, error: "invalid_duration" };
  }
  if (input.aspect !== "9:16" && input.aspect !== "16:9" && input.aspect !== "1:1") {
    return { ok: false, error: "invalid_aspect" };
  }

  const job = createJob({
    prompt: input.prompt,
    durationSec: input.durationSec,
    aspect: input.aspect,
  });

  // SAFE STUB: mark as done immediately with a deterministic placeholder URL
  updateJob(job.jobId, {
    status: "done",
    resultUrl: `/video-gen/mock/${job.jobId}.mp4`,
  });

  return { ok: true, jobId: job.jobId };
}
