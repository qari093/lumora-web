import { describe, expect, it } from "vitest";
import { verifyToken } from "../../../src/lib/security";
import * as Route from "../../../src/app/api/energy/issue/route";

async function callHandler(): Promise<any> {
  // Prefer GET then POST (some routes issue on GET, others POST)
  const url = "http://localhost/api/_test_issue";
  const req = new Request(url, { method: "GET" });

  if (typeof (Route as any).GET === "function") {
    return await (Route as any).GET(req as any);
  }
  if (typeof (Route as any).POST === "function") {
    const req2 = new Request(url, { method: "POST" });
    return await (Route as any).POST(req2 as any);
  }
  throw new Error("route has no GET/POST export");
}

function pickToken(payload: any): string | null {
  if (!payload) return null;
  if (typeof payload === "string") return payload;

  // common fields
  const keys = ["token", "accessToken", "manifestToken", "signedToken", "t"];
  for (const k of keys) {
    const v = payload?.[k];
    if (typeof v === "string" && v.length > 10) return v;
  }

  // fallback: first string-like value
  for (const v of Object.values(payload)) {
    if (typeof v === "string" && v.length > 10) return v;
  }
  return null;
}

describe("upload signing endpoint contract (in-process)", () => {
  it("returns a token that verifyToken accepts", async () => {
    const res: any = await callHandler();
    expect(res).toBeTruthy();

    // Handle Response
    let body: any = null;
    if (typeof res?.json === "function") {
      body = await res.json();
    } else if (typeof res?.body === "string") {
      try { body = JSON.parse(res.body); } catch { body = res.body; }
    } else {
      body = res;
    }

    const token = pickToken(body);
    expect(token, "no token found in endpoint response body").toBeTruthy();

    const vr: any = (verifyToken as any)(token);
    if (typeof vr === "boolean") {
      expect(vr).toBe(true);
    } else if (vr && typeof vr === "object" && "ok" in vr) {
      expect(vr.ok).toBe(true);
    } else {
      expect(!!vr).toBe(true);
    }
  });
});
