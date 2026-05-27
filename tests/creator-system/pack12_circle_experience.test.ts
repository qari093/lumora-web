import { describe, expect, it } from "vitest";
import { getCircleVisibilityConfig } from "@/src/lib/creator-system/circle-experience/visibilityRules";
import { getNextCircleVideo, orderCircleVideos } from "@/src/lib/creator-system/circle-experience/sequentialPlayback";
import { getCircleInteractionMode } from "@/src/lib/creator-system/circle-experience/chatClutterRule";
import { buildSoftTimeline } from "@/src/lib/creator-system/circle-experience/softTimeline";
import { createCalmCircleDissolve } from "@/src/lib/creator-system/circle-experience/dissolveCircle";

describe("Pack12 Circle Experience", () => {
  it("hides vanity metrics inside circle", () => {
    const config = getCircleVisibilityConfig();
    expect(config.showFollowers).toBe(false);
    expect(config.showViews).toBe(false);
    expect(config.showHumanSignals).toBe(true);
  });

  it("plays videos sequentially", () => {
    const ordered = orderCircleVideos([
      { videoId: "v2", creatorId: "c2", playbackUrl: "/2.mp4", order: 2 },
      { videoId: "v1", creatorId: "c1", playbackUrl: "/1.mp4", order: 1 },
    ]);

    expect(ordered[0].videoId).toBe("v1");
    expect(getNextCircleVideo(ordered, "v1")?.videoId).toBe("v2");
  });

  it("disables chat clutter", () => {
    const mode = getCircleInteractionMode();
    expect(mode.chatEnabled).toBe(false);
    expect(mode.commentsEnabled).toBe(false);
    expect(mode.humanSignalsEnabled).toBe(true);
  });

  it("builds soft timeline", () => {
    const timeline = buildSoftTimeline(["v1", "v2"], "v2");
    expect(timeline[1].active).toBe(true);
    expect(timeline[0].label).toBe("Moment 1");
  });

  it("dissolves circle calmly", () => {
    const dissolve = createCalmCircleDissolve("c1");
    expect(dissolve.status).toBe("dissolving");
    expect(dissolve.dissolveAfterMs).toBe(6000);
  });
});
