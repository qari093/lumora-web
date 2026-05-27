import { describe, expect, it } from "vitest";
import {
  findMissingOperationalEnv,
  requiredOperationalEnv,
} from "../../src/core/ops/credentials/required-env";

describe("operational provider credentials", () => {
  it("declares required production provider env keys", () => {
    expect(requiredOperationalEnv.length).toBeGreaterThanOrEqual(20);
  });

  it("detects missing provider env values", () => {
    expect(findMissingOperationalEnv({ DATABASE_URL: "x" })).toContain("STRIPE_SECRET_KEY");
  });
});
