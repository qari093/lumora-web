import { describe, expect, it } from "vitest";
import { filterEligibleCircleUploads, isUploadEligibleForCircle } from "@/src/lib/integration/circle-trigger/eligibleUploads";
import { queueUploadIntoNextCircle, queueUploadsIntoNextCircle } from "@/src/lib/integration/circle-trigger/queueUploads";
import { attachCircleAssignmentToFypItem } from "@/src/lib/integration/circle-trigger/fypCircleAssignment";
import { buildPreCircleIndicator } from "@/src/lib/integration/circle-trigger/preCircleIndicator";
import { validateCircleAssignment } from "@/src/lib/integration/circle-trigger/validateAssignment";

const upload = {
  uploadId: "up1",
  creatorId: "c1",
  videoId: "v1",
  createdAt: "2026-05-02T19:00:00.000Z",
  playable: true,
};

describe("Integration Pack04 — Circle Trigger Layer", () => {
  it("detects eligible uploads for circles", () => {
    expect(isUploadEligibleForCircle(upload)).toBe(true);
    expect(isUploadEligibleForCircle({ ...upload, playable: false })).toBe(false);
    expect(filterEligibleCircleUploads([upload, { ...upload, uploadId: "up2", alreadyAssigned: true }])).toHaveLength(1);
  });

  it("queues uploads into next circle", () => {
    const queued = queueUploadIntoNextCircle({
      upload,
      targetCircleId: "circle1",
      queuedAt: "2026-05-02T18:00:00.000Z",
    });

    expect(queued.targetCircleId).toBe("circle1");
    expect(queued.uploadId).toBe("up1");

    expect(queueUploadsIntoNextCircle({ uploads: [upload], targetCircleId: "circle1" })).toHaveLength(1);
  });

  it("syncs FYP to circle assignment", () => {
    const assignment = queueUploadIntoNextCircle({ upload, targetCircleId: "circle1" });
    const item = attachCircleAssignmentToFypItem({ id: "v1" }, assignment);

    expect(item.circleAssignment.assigned).toBe(true);
    expect(item.circleAssignment.circleId).toBe("circle1");
  });

  it("adds pre-circle indicator", () => {
    const indicator = buildPreCircleIndicator({
      assigned: true,
      circleId: "circle1",
      launchTimeIso: "2026-05-02T19:00:00.000Z",
    });

    expect(indicator.visible).toBe(true);
    expect(indicator.label).toBe("Queued for next circle");
  });

  it("validates assignment integrity", () => {
    expect(validateCircleAssignment({
      uploadId: "up1",
      creatorId: "c1",
      videoId: "v1",
      targetCircleId: "circle1",
    }).ok).toBe(true);

    expect(validateCircleAssignment({ uploadId: "up1" }).ok).toBe(false);
  });
});
