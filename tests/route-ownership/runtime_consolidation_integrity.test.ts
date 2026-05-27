import { describe, expect, it } from "vitest";
import { apiConsolidationBoundary } from "@/src/core/route-ownership/consolidation/apiConsolidationBoundary";
import { runtimeIntegrityValidator } from "@/src/core/route-ownership/validation/runtimeIntegrityValidator";
import { consolidationValidator } from "@/src/core/route-ownership/validation/consolidationValidator";

describe("runtime consolidation integrity", () => {
  it("prevents blind deletes", () => {
    expect(apiConsolidationBoundary.noBlindDeletes).toBe(true);
  });

  it("validates runtime integrity", () => {
    expect(runtimeIntegrityValidator().fragmented).toBe(false);
  });

  it("allows safe consolidation", () => {
    expect(consolidationValidator().safeToProceed).toBe(true);
  });
});
