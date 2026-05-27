import { describe, expect, it } from "vitest";
import { buildWitnessThreadLine } from "@/src/lib/creator-system/witness-thread/threadLine";
import { createFirstWitnessAnchorPoint } from "@/src/lib/creator-system/witness-thread/anchorPoint";
import { calculateWitnessDepth } from "@/src/lib/creator-system/witness-thread/depthTracker";
import { getWitnessThreadTone } from "@/src/lib/creator-system/witness-thread/threadTone";
import { getWitnessThreadDisplayPolicy } from "@/src/lib/creator-system/witness-thread/noProgressBars";

describe("Pack17 Witness Thread", () => {
  it("builds witness thread visual line", () => {
    const p1 = createFirstWitnessAnchorPoint({
      creatorId: "c1",
      witnessId: "w1",
      circleId: "circle1",
      createdAt: "2026-05-02T19:00:00.000Z",
    });

    const line = buildWitnessThreadLine({
      creatorId: "c1",
      witnessId: "w1",
      points: [p1],
    });

    expect(line.points).toHaveLength(1);
    expect(line.numericProgressHidden).toBe(true);
  });

  it("adds first fixed anchor point", () => {
    const point = createFirstWitnessAnchorPoint({
      creatorId: "c1",
      witnessId: "w1",
      circleId: "circle1",
    });

    expect(point.id).toContain("anchor-c1-w1-circle1");
    expect(point.label).toBe("first quiet presence");
  });

  it("tracks depth over time", () => {
    const points = Array.from({ length: 5 }).map((_, index) =>
      createFirstWitnessAnchorPoint({
        creatorId: "c1",
        witnessId: "w1",
        circleId: `circle${index}`,
        createdAt: `2026-05-0${index + 1}T19:00:00.000Z`,
      }),
    );

    const depth = calculateWitnessDepth(points);
    expect(depth.depthLevel).toBe("familiar");
    expect(depth.pointCount).toBe(5);
  });

  it("shifts tone as depth grows", () => {
    expect(getWitnessThreadTone({ depthLevel: "new", pointCount: 1 })).toBe("a first quiet presence");
    expect(getWitnessThreadTone({ depthLevel: "familiar", pointCount: 5 })).toBe("has been still with you often");
  });

  it("avoids numeric progress bars", () => {
    const policy = getWitnessThreadDisplayPolicy();

    expect(policy.numericProgressBarsAllowed).toBe(false);
    expect(policy.percentagesAllowed).toBe(false);
    expect(policy.toneLabelsAllowed).toBe(true);
  });
});
