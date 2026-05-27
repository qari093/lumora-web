import { describe, expect, it } from "vitest";
import { validateZendoroDatabasePersistence } from "@/src/lib/zendoro/production/databasePersistence";

describe("Zendoro Production Pack 2/10 — Database + Persistence", () => {
  it("validates persistence hardening contract", () => {
    const r = validateZendoroDatabasePersistence();
    expect(r.prismaSchema).toBe(true);
    expect(r.transactions).toBe(true);
    expect(r.persistenceSeal).toBe(true);
  });
});
