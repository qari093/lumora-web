import { describe, expect, it } from "vitest";
import { triageBug } from "../../src/core/ops/bugs/triage";
import {
  canApplyCreatorShareOperationalSeal,
  creatorShareOperationalSeal,
} from "../../src/core/ops/final/operational-seal";

describe("Creator + Share operational seal", () => {
  it("triages production bugs", () => {
    expect(triageBug({ title: "checkout failure", severity: "critical" }).blocker).toBe(true);
  });

  it("applies operational seal", () => {
    expect(creatorShareOperationalSeal.sealed).toBe(true);
    expect(canApplyCreatorShareOperationalSeal()).toBe(true);
  });
});
