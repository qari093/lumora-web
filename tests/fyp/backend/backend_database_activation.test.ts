import { describe, expect, it } from "vitest";

import { validateFeedQuery } from "@/src/core/fyp/backend/contracts/feedContract";
import { createFeedSeed } from "@/src/core/fyp/backend/runtime/feedSeed";
import { getFeedRecords } from "@/src/core/fyp/backend/runtime/feedRepository";
import { activateFypDatabaseRuntime } from "@/src/core/fyp/backend/runtime/databaseActivation";

describe("Lumora FYP Backend Database Activation", () => {
  it("validates feed query", () => {
    const result = validateFeedQuery({
      limit: 200
    });

    expect(result.limit).toBe(50);
  });

  it("creates feed seed", () => {
    const items = createFeedSeed(3);

    expect(items).toHaveLength(3);
    expect(items[0].portal).toBe("videos");
  });

  it("returns repository feed response", async () => {
    const response = await getFeedRecords({
      limit: 5
    });

    expect(response.ok).toBe(true);
    expect(response.items).toHaveLength(5);
  });

  it("activates backend runtime", () => {
    const result = activateFypDatabaseRuntime();

    expect(result.ok).toBe(true);
    expect(result.runtime).toBe("fyp-backend-active");
  });
});
