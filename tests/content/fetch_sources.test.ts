import { describe, it, expect } from "vitest";
import { fetchAllSources } from "@/src/lib/content/sources/fetchAll";

describe("Fetch Sources", () => {
  it("returns some clips", async () => {
    const data = await fetchAllSources();
    expect(Array.isArray(data)).toBe(true);
  });
});
