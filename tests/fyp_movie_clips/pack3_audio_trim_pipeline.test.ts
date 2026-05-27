import { describe, expect, it } from "vitest";
import fs from "node:fs";
import { buildAudioProbeFromFfprobe, extractAudioStream, extractVideoDuration, validateFfprobeHasAudio } from "../../src/lib/fyp_movie_clips/ffprobe_contract";
import { buildFfmpegTrimCommand, buildMovieTrimPlan } from "../../src/lib/fyp_movie_clips/trim_plan";
import { buildMovieClipDedupeKey, dedupeMovieCandidates } from "../../src/lib/fyp_movie_clips/dedupe";

describe("Safe Movie Clips Pack 3 — audio + trim pipeline", () => {
  const probe = {
    streams: [
      { codec_type: "video", codec_name: "h264", duration: "90" },
      { codec_type: "audio", codec_name: "aac", channels: 2, duration: "90" },
    ],
    format: { duration: "90" },
  };

  it("extracts and validates audio stream", () => {
    expect(extractAudioStream(probe)?.codec_name).toBe("aac");
    expect(validateFfprobeHasAudio(probe)).toBe(true);
  });

  it("builds audio probe contract", () => {
    const out = buildAudioProbeFromFfprobe(probe);
    expect(out.hasAudioTrack).toBe(true);
    expect(out.audioCodec).toBe("aac");
    expect(out.duration).toBe(90);
  });

  it("extracts duration and builds safe trim plan", () => {
    const plan = buildMovieTrimPlan("in.mp4", "out.mp4", extractVideoDuration(probe));
    expect(plan.durationSeconds).toBeGreaterThanOrEqual(10);
    expect(plan.durationSeconds).toBeLessThanOrEqual(45);
    expect(plan.normalizeAudio).toBe(true);
  });

  it("builds ffmpeg command with audio mapping", () => {
    const cmd = buildFfmpegTrimCommand(buildMovieTrimPlan("in.mp4", "out.mp4", 90));
    expect(cmd).toContain("-map");
    expect(cmd).toContain("0:a:0");
    expect(cmd.join(" ")).toContain("loudnorm");
  });

  it("dedupes movie clip candidates", () => {
    const one = { sourceId: "archive", sourceUrl: "u", title: "t", startSeconds: 10 };
    expect(buildMovieClipDedupeKey(one)).toContain("archive");
    expect(dedupeMovieCandidates([one, one])).toHaveLength(1);
    expect(fs.existsSync("scripts/fyp_movie_clips/ffprobe_movie_audio_hint.sh")).toBe(true);
  });
});
