import { describe, expect, it } from "vitest";
import { launchLiveCircleSession } from "@/src/lib/integration/circle-runtime/liveCircleSession";
import { syncAttendeesIntoCircle } from "@/src/lib/integration/circle-runtime/attendeeSync";
import { getActiveRuntimeVideo, getNextRuntimeVideoIndex } from "@/src/lib/integration/circle-runtime/sequentialRuntime";
import { activateRuntimeSignalCapture } from "@/src/lib/integration/circle-runtime/signalCapture";
import { validateRealtimeCircleFlow } from "@/src/lib/integration/circle-runtime/validateRealtimeFlow";

describe("Integration Pack05 — Circle Runtime Engine", () => {
  it("launches live circle sessions", () => {
    const session = launchLiveCircleSession({
      circleId: "circle1",
      startedAt: "2026-05-02T19:00:00.000Z",
    });

    expect(session.status).toBe("live");
    expect(session.live).toBe(true);
    expect(session.durationMinutes).toBe(12);
  });

  it("syncs attendees into circle", () => {
    const attendees = syncAttendeesIntoCircle([
      { userId: "u1", witnessName: "Nova" },
      { userId: "u2", witnessName: "Willow" },
    ]);

    expect(attendees).toHaveLength(2);
    expect(attendees[0].present).toBe(true);
  });

  it("enables sequential playback", () => {
    const videos = [
      { videoId: "v2", playbackUrl: "/v2.mp4", order: 2 },
      { videoId: "v1", playbackUrl: "/v1.mp4", order: 1 },
    ];

    expect(getActiveRuntimeVideo(videos, 0)?.videoId).toBe("v1");
    expect(getNextRuntimeVideoIndex(videos, 0)).toBe(1);
    expect(getNextRuntimeVideoIndex(videos, 1)).toBe(null);
  });

  it("activates signal capture", () => {
    const capture = activateRuntimeSignalCapture({
      circleId: "circle1",
      videoId: "v1",
    });

    expect(capture.enabled).toBe(true);
    expect(capture.allowedSignals).toContain("silent-ovation");
  });

  it("validates real-time flow", () => {
    const session = launchLiveCircleSession({ circleId: "circle1" });
    const attendees = syncAttendeesIntoCircle([{ userId: "u1", witnessName: "Nova" }]);
    const activeVideo = getActiveRuntimeVideo([{ videoId: "v1", playbackUrl: "/v1.mp4", order: 1 }], 0);
    const signalCapture = activateRuntimeSignalCapture({ circleId: "circle1", videoId: "v1" });

    expect(validateRealtimeCircleFlow({ session, attendees, activeVideo, signalCapture }).ok).toBe(true);
    expect(validateRealtimeCircleFlow({ session, attendees: [], activeVideo, signalCapture }).ok).toBe(false);
  });
});
