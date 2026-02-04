import { describe, it, expect } from "vitest";
import { invokeGET, isJsonLike } from "../_helpers/next.routeInvoke";

// App Router route module import
import * as HealthRoute from "../../app/api/health/route";

describe("/api/health (in-process)", () => {
  it("returns 200 and JSON-ish body", async () => {
    const r = await invokeGET(HealthRoute as any, "http://local.test/api/health");
    expect(r.status).toBe(200);
    expect(isJsonLike(r.json)).toBe(true);
    expect(r.json.ok).toBe(true);
    expect(typeof r.json.service).toBe("string");
  });
});
