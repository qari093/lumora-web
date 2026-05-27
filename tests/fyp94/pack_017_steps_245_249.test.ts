import { describe, expect, it } from "vitest";
import { createFyp94UnfinishedThread, shouldCreateFyp94UnfinishedThread } from "../../src/lib/fyp94/unfinished/detect";
import { buildFyp94CuriosityMessage } from "../../src/lib/fyp94/unfinished/message";
import { canSendFyp94UnfinishedReminder } from "../../src/lib/fyp94/unfinished/rateLimit";
import { buildFyp94ResumeState, canResumeFyp94UnfinishedThread } from "../../src/lib/fyp94/unfinished/resume";

describe("FYP 9.4 Pack 017 — Unfinished Thread", () => {
  it("detects exit states", () => {
    expect(shouldCreateFyp94UnfinishedThread({ exited: true, context: "sequence" })).toBe(true);
    expect(shouldCreateFyp94UnfinishedThread({ exited: false, context: "sequence" })).toBe(false);
  });

  it("stores unfinished state", () => {
    const thread = createFyp94UnfinishedThread({
      anonymousUserId: "anon_1",
      context: "sequence",
      category: "surf",
      tags: ["wave"],
      sequenceId: "seq_1",
      now: new Date("2026-01-01T00:00:00.000Z"),
    });

    expect(thread.threadId).toContain("unfinished_sequence");
    expect(thread.sequenceId).toBe("seq_1");
  });

  it("generates template curiosity message", () => {
    const thread = createFyp94UnfinishedThread({
      anonymousUserId: "anon_1",
      context: "countdown",
      category: "parkour",
      tags: ["jump"],
      clipId: "clip_1",
    });

    const msg = buildFyp94CuriosityMessage(thread);

    expect(msg.message).toContain("unlock");
    expect(msg.deeplink).toContain("unfinished=");
  });

  it("rate-limits reminders", () => {
    expect(canSendFyp94UnfinishedReminder({})).toBe(true);

    expect(
      canSendFyp94UnfinishedReminder({
        lastSentAt: "2026-01-01T00:00:00.000Z",
        now: new Date("2026-01-01T03:00:00.000Z"),
        minHours: 8,
      }),
    ).toBe(false);
  });

  it("resumes unfinished state", () => {
    const thread = createFyp94UnfinishedThread({
      anonymousUserId: "anon_1",
      context: "wave",
      category: "surf",
      waveId: "wave_1",
      now: new Date("2026-01-01T00:00:00.000Z"),
      resumeMinutes: 60,
    });

    expect(canResumeFyp94UnfinishedThread(thread, new Date("2026-01-01T00:30:00.000Z"))).toBe(true);
    expect(canResumeFyp94UnfinishedThread(thread, new Date("2026-01-01T02:00:00.000Z"))).toBe(false);

    const resume = buildFyp94ResumeState(thread);
    expect(resume.target).toBe("wave");
    expect(resume.targetId).toBe("wave_1");
  });
});
