import { describe, it, expect } from "vitest";

import {
  evaluatePlaybackReadiness
} from "../../../src/core/fyp/playback/playbackReadiness";

import {
  buildPlayableQueue
} from "../../../src/core/fyp/playback/playbackQueue";

describe("FYP Omega Pack 09", () => {
  it("accepts verified mp4 assets", () => {
    const result = evaluatePlaybackReadiness({
      id: "v1",
      playbackUrl: "https://cdn.example.com/v1.mp4",
      mimeType: "video/mp4",
      durationSeconds: 30,
      verified: true
    });

    expect(result.playable).toBe(true);
    expect(result.reason).toBe("ready");
  });

  it("rejects unsupported formats", () => {
    const result = evaluatePlaybackReadiness({
      id: "v2",
      playbackUrl: "https://cdn.example.com/v2.mkv",
      mimeType: "video/x-matroska",
      durationSeconds: 30,
      verified: true
    });

    expect(result.playable).toBe(false);
    expect(result.reason).toBe("unsupported_format");
  });

  it("rejects invalid duration", () => {
    const result = evaluatePlaybackReadiness({
      id: "v3",
      playbackUrl: "https://cdn.example.com/v3.mp4",
      mimeType: "video/mp4",
      durationSeconds: 900,
      verified: true
    });

    expect(result.playable).toBe(false);
    expect(result.reason).toBe("invalid_duration");
  });

  it("builds playable queue only", () => {
    const queue = buildPlayableQueue([
      {
        id: "good",
        playbackUrl: "https://cdn.example.com/good.mp4",
        mimeType: "video/mp4",
        durationSeconds: 20,
        verified: true
      },
      {
        id: "bad",
        playbackUrl: "",
        mimeType: "video/mp4",
        durationSeconds: 20,
        verified: true
      }
    ]);

    expect(queue.length).toBe(1);
    expect(queue[0].id).toBe("good");
  });
});
