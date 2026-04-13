import { describe, expect, it } from "vitest";
import { summarizeSession, validateSessionEvent } from "../../lib/analytics/sessionPipeline";

describe("session analytics pipeline", () => {
  const now = Date.now();

  it("validates good session events", () => {
    expect(
      validateSessionEvent({
        sessionId: "s1",
        userId: "u1",
        type: "session_start",
        timestamp: now
      })
    ).toBe(true);
  });

  it("rejects invalid session events", () => {
    expect(
      validateSessionEvent({
        sessionId: "",
        type: "page_view",
        timestamp: -1
      })
    ).toBe(false);
  });

  it("summarizes a session correctly", () => {
    const summary = summarizeSession(
      [
        { sessionId: "s1", userId: "u1", type: "session_start", timestamp: now },
        { sessionId: "s1", userId: "u1", type: "page_view", timestamp: now + 1000, path: "/fyp" },
        { sessionId: "s1", userId: "u1", type: "video_view", timestamp: now + 2000, path: "/video" },
        { sessionId: "s1", userId: "u1", type: "interaction", timestamp: now + 3000 },
        { sessionId: "s1", userId: "u1", type: "session_end", timestamp: now + 5000 }
      ],
      "s1"
    );

    expect(summary.valid).toBe(true);
    expect(summary.userId).toBe("u1");
    expect(summary.pageViews).toBe(1);
    expect(summary.videoViews).toBe(1);
    expect(summary.interactions).toBe(1);
    expect(summary.durationMs).toBe(5000);
    expect(summary.totalEvents).toBe(5);
  });

  it("handles missing session boundaries safely", () => {
    const summary = summarizeSession(
      [
        { sessionId: "s2", type: "page_view", timestamp: now + 1000, path: "/fyp" },
        { sessionId: "s2", type: "interaction", timestamp: now + 2500 }
      ],
      "s2"
    );

    expect(summary.valid).toBe(true);
    expect(summary.durationMs).toBe(1500);
    expect(summary.startedAt).toBeNull();
    expect(summary.endedAt).toBeNull();
  });
});
