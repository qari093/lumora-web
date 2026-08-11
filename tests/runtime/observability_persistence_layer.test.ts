import { describe, expect, it } from "vitest";

import {
  parseObservabilityTimestamp,
  sanitizeObservabilityMetadata,
} from "@/src/lib/observability/persistence";

describe("observability persistence layer", () => {
  it("normalizes timestamps from ISO and Unix values", () => {
    expect(
      parseObservabilityTimestamp(
        "2026-08-01T20:00:00.000Z",
      ).toISOString(),
    ).toBe("2026-08-01T20:00:00.000Z");

    expect(
      parseObservabilityTimestamp(1_785_592_800).getTime(),
    ).toBe(1_785_592_800_000);
  });

  it("removes unsupported metadata values", () => {
    const metadata = sanitizeObservabilityMetadata({
      valid: true,
      finite: 12,
      invalid: Number.NaN,
      nested: {
        text: "safe",
        unsupported: undefined,
      },
    });

    expect(metadata).toEqual({
      valid: true,
      finite: 12,
      nested: {
        text: "safe",
      },
    });
  });

  it("caps oversized metadata", () => {
    const metadata = sanitizeObservabilityMetadata({
      payload: "x".repeat(20_000),
    });

    expect(metadata).toEqual({
      truncated: true,
      reason: "metadata_size_limit_exceeded",
    });
  });
});
