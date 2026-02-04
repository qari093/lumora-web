import { describe, it, expect } from "vitest";
import { invokeGET, isJsonLike } from "../_helpers/next.routeInvoke";

import * as VersionRoute from "../../app/api/version/route";

describe("/api/version (in-process)", () => {
  it("returns 200 and JSON with ok/service/version", async () => {
    const r = await invokeGET(VersionRoute as any, "http://local.test/api/version");
    expect(r.status).toBe(200);
    expect(isJsonLike(r.json)).toBe(true);
    expect(r.json.ok).toBe(true);
    expect(typeof r.json.service).toBe("string");
    expect(typeof r.json.version).toBe("string");
  });
});
