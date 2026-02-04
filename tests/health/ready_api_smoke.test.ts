import { describe, it, expect } from "vitest";
import { invokeGET, isJsonLike } from "../_helpers/next.routeInvoke";

import * as ReadyRoute from "../../app/api/ready/route";

describe("/api/ready (in-process)", () => {
  it("returns 200 and JSON-ish body", async () => {
    const r = await invokeGET(ReadyRoute as any, "http://local.test/api/ready");
    expect(r.status).toBe(200);
    expect(isJsonLike(r.json)).toBe(true);
    expect(r.json.ok).toBe(true);
  });
});
