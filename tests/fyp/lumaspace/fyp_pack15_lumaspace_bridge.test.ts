import { describe, it, expect } from "vitest";

import {
  createFypLumaSpacePost
} from "../../../src/core/fyp/lumaspace/lumaspaceBridge";

import {
  openFypShareSheet,
  selectFypTargetSpace
} from "../../../src/core/fyp/lumaspace/shareSheet";

describe("FYP Omega Pack 15", () => {
  it("creates LumaSpace post with trace back", () => {
    const post = createFypLumaSpacePost({
      assetId: "asset_001",
      spaceId: "space_001",
      userId: "user_001",
      note: "save this trace",
      sourceRoute: "/fyp"
    });

    expect(post.id).toContain("fyp_space");
    expect(post.traceBackUrl).toBe("/fyp?trace=asset_001");
    expect(post.note).toBe("save this trace");
  });

  it("rejects missing asset id", () => {
    expect(() =>
      createFypLumaSpacePost({
        assetId: "",
        spaceId: "space_001",
        userId: "user_001",
        sourceRoute: "/fyp"
      })
    ).toThrow("assetId_required");
  });

  it("opens share sheet for selected asset", () => {
    const state = openFypShareSheet("asset_002");

    expect(state.open).toBe(true);
    expect(state.selectedAssetId).toBe("asset_002");
  });

  it("selects target LumaSpace", () => {
    const state = selectFypTargetSpace(
      openFypShareSheet("asset_003"),
      "space_777"
    );

    expect(state.selectedSpaceId).toBe("space_777");
  });
});
