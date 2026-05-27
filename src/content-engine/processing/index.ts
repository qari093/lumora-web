export type ProcessingJob = {
  jobId: string;
  contentId: string;
  status: "queued" | "processing" | "complete" | "failed";
  attempt: number;
  queuedAt: string;
};

export type ProbeResult = {
  contentId: string;
  container: string;
  durationSec: number;
  width: number;
  height: number;
  hasAudio: boolean;
  videoCodec: string;
  audioCodec?: string;
  corrupted: boolean;
};

export function createProcessingJob(input: {
  contentId: string;
  queuedAt?: string;
}): ProcessingJob {
  return {
    jobId: `job_${input.contentId}`,
    contentId: input.contentId,
    status: "queued",
    attempt: 0,
    queuedAt: input.queuedAt || new Date().toISOString(),
  };
}

export function startProcessingJob(job: ProcessingJob): ProcessingJob {
  return {
    ...job,
    status: "processing",
    attempt: job.attempt + 1,
  };
}

export function validateFfmpegProbe(probe: ProbeResult) {
  const errors: string[] = [];

  if (probe.corrupted) errors.push("corrupted_file");
  if (!probe.hasAudio) errors.push("audio_missing");
  if (probe.durationSec < 5 || probe.durationSec > 90) errors.push("duration_out_of_bounds");
  if (probe.width < 480 || probe.height < 480) errors.push("resolution_too_low");
  if (!["h264", "avc1"].includes(probe.videoCodec.toLowerCase())) errors.push("unsupported_video_codec");

  return {
    ok: errors.length === 0,
    errors,
    idealDuration: probe.durationSec >= 10 && probe.durationSec <= 45,
  };
}

export function finishProcessingJob(job: ProcessingJob, probe: ProbeResult): ProcessingJob {
  const validation = validateFfmpegProbe(probe);

  return {
    ...job,
    status: validation.ok ? "complete" : "failed",
  };
}

export function createDeadLetterRecord(input: {
  job: ProcessingJob;
  probe: ProbeResult;
}) {
  const validation = validateFfmpegProbe(input.probe);

  return {
    contentId: input.job.contentId,
    jobId: input.job.jobId,
    failed: !validation.ok,
    reasons: validation.errors,
    eventType: "content.processing.failed" as const,
  };
}
