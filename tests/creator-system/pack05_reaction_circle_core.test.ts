import { describe, expect, it } from "vitest";
import { createDailyAnchorCircle } from "@/src/lib/creator-system/reaction-circle/anchorCircle";
import { buildDateKey, buildFixedAnchorLaunchTime } from "@/src/lib/creator-system/reaction-circle/launchTime";
import { enforceAnchorCircleDuration, getAnchorCircleEndTime } from "@/src/lib/creator-system/reaction-circle/durationRule";
import { addAnchorCircleAttendee, validateAnchorCircleAttendeeRange } from "@/src/lib/creator-system/reaction-circle/attendeeRange";
import { assignUploadToNextCircle, assignUploadsToNextCircle } from "@/src/lib/creator-system/reaction-circle/uploadAssignment";

describe("Creator System Pack 05 — Reaction Circle Core", () => {
  it("creates a single daily anchor circle", () => {
    const date = new Date("2026-05-02T10:00:00.000Z");
    const circle = createDailyAnchorCircle({
      dateKey: buildDateKey(date),
      launchTimeIso: buildFixedAnchorLaunchTime(date),
    });

    expect(circle.circleId).toBe("anchor-2026-05-02");
    expect(circle.status).toBe("scheduled");
    expect(circle.durationMinutes).toBe(12);
  });

  it("sets fixed launch time", () => {
    const launch = buildFixedAnchorLaunchTime(new Date("2026-05-02T10:00:00.000Z"));
    expect(launch).toBe("2026-05-02T19:00:00.000Z");
  });

  it("enforces 12-minute duration and computes end time", () => {
    const circle = enforceAnchorCircleDuration(
      createDailyAnchorCircle({
        dateKey: "2026-05-02",
        launchTimeIso: "2026-05-02T19:00:00.000Z",
      }),
    );

    expect(circle.durationMinutes).toBe(12);
    expect(getAnchorCircleEndTime(circle)).toBe("2026-05-02T19:12:00.000Z");
  });

  it("enforces 3–12 attendee range", () => {
    expect(validateAnchorCircleAttendeeRange(["a", "b"]).ok).toBe(false);
    expect(validateAnchorCircleAttendeeRange(["a", "b", "c"]).ok).toBe(true);

    const many = Array.from({ length: 20 }).map((_, index) => `u${index}`);
    expect(validateAnchorCircleAttendeeRange(many).reason).toBe("too_many_attendees");

    const added = addAnchorCircleAttendee(["a", "b", "c"], "d");
    expect(added).toContain("d");
  });

  it("assigns uploads to next circle", () => {
    const circle = createDailyAnchorCircle({
      dateKey: "2026-05-02",
      launchTimeIso: "2026-05-02T19:00:00.000Z",
    });

    const one = assignUploadToNextCircle(
      { uploadId: "up1", creatorId: "c1", createdAt: "2026-05-02T11:00:00.000Z" },
      circle,
    );

    expect(one.upload.assignedCircleId).toBe(circle.circleId);
    expect(one.circle.assignedUploadIds).toContain("up1");

    const many = assignUploadsToNextCircle(
      [
        { uploadId: "up2", creatorId: "c1", createdAt: "t" },
        { uploadId: "up3", creatorId: "c2", createdAt: "t" },
      ],
      one.circle,
    );

    expect(many.circle.assignedUploadIds).toContain("up2");
    expect(many.circle.assignedUploadIds).toContain("up3");
  });
});
