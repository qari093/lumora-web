import { describe, expect, it } from "vitest";
import {
  createDeadLetterRecord,
  createProcessingJob,
  finishProcessingJob,
  startProcessingJob,
  validateFfmpegProbe,
} from "@/src/content-engine/processing";

const validProbe = {
  contentId: "content1",
  container: "mp4",
  durationSec: 30,
  width: 1280,
  height: 720,
  hasAudio: true,
  videoCodec: "h264",
  audioCodec: "aac",
  corrupted: false,
};

describe("Content Engine Pack04 — Processing Queue + FFmpeg Probe Contract", () => {
  it("creates queued processing job", () => {
    const job = createProcessingJob({
      contentId: "content1",
      queuedAt: "2026-05-04T00:00:00.000Z",
    });

    expect(job.status).toBe("queued");
    expect(job.jobId).toBe("job_content1");
    expect(job.queuedAt).toBe("2026-05-04T00:00:00.000Z");
  });

  it("starts processing job and increments attempt", () => {
    const job = startProcessingJob(createProcessingJob({ contentId: "content1" }));

    expect(job.status).toBe("processing");
    expect(job.attempt).toBe(1);
  });

  it("validates successful ffmpeg probe", () => {
    const validation = validateFfmpegProbe(validProbe);

    expect(validation.ok).toBe(true);
    expect(validation.idealDuration).toBe(true);
  });

  it("fails invalid ffmpeg probe", () => {
    const validation = validateFfmpegProbe({
      ...validProbe,
      hasAudio: false,
      corrupted: true,
      videoCodec: "vp9",
    });

    expect(validation.ok).toBe(false);
    expect(validation.errors).toContain("audio_missing");
    expect(validation.errors).toContain("corrupted_file");
    expect(validation.errors).toContain("unsupported_video_codec");
  });

  it("finishes or dead-letters jobs based on probe", () => {
    const processing = startProcessingJob(createProcessingJob({ contentId: "content1" }));
    const done = finishProcessingJob(processing, validProbe);
    const failedProbe = { ...validProbe, hasAudio: false };
    const failed = finishProcessingJob(processing, failedProbe);
    const deadLetter = createDeadLetterRecord({ job: failed, probe: failedProbe });

    expect(done.status).toBe("complete");
    expect(failed.status).toBe("failed");
    expect(deadLetter.failed).toBe(true);
    expect(deadLetter.eventType).toBe("content.processing.failed");
  });
});
