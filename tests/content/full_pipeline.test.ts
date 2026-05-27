import { describe, expect, it } from "vitest";
import { fetchProcessPipeline } from "@/src/lib/content/pipeline/fetchAndProcess";
import { buildFypFeed } from "@/src/lib/content/pipeline/feedBuilder";

describe("Lumora Full Pipeline", () => {
  it("processes sources and returns structure", async () => {
    const res = await fetchProcessPipeline();
    expect(res).toHaveProperty("accepted");
    expect(res).toHaveProperty("rejected");
  });

  it("builds feed with playable items", async () => {
    const feed = await buildFypFeed();
    expect(Array.isArray(feed)).toBe(true);
  });
});
