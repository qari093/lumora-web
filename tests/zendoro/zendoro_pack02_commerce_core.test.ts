import { describe, expect, it } from "vitest";
import {
  commerceCore,
  commerceCoreHealthy
} from "../../src/core/zendoro/commerce/commerceCore";

describe("Zendoro Pack 02/08 — Commerce Core", () => {
  it("supports commerce runtime", () => {
    expect(commerceCore.checkout).toBe(true);
    expect(commerceCoreHealthy()).toBe(true);
  });
});
