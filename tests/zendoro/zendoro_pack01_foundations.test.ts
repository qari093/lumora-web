import { describe, expect, it } from "vitest";
import {
  zendoroDoctrine,
  zendoroDoctrineHealthy
} from "../../src/core/zendoro/foundation/doctrine";

describe("Zendoro Pack 01/08 — Foundations", () => {
  it("supports doctrine", () => {
    expect(zendoroDoctrine.trustBeforeTransaction).toBe(true);
    expect(zendoroDoctrineHealthy()).toBe(true);
  });
});
