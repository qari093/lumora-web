import { describe, expect, it } from "vitest";

import { createAuditEvent } from "@/lib/zendoro/audit";
import { createIdempotencyKey } from "@/lib/zendoro/idempotency";

describe("Zendoro Mega Pack 01", () => {
  it("creates idempotency key", () => {
    expect(createIdempotencyKey("abc")).toContain("zendoro");
  });

  it("creates audit event", () => {
    expect(createAuditEvent("checkout").action).toBe("checkout");
  });
});
