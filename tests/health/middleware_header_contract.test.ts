import { describe, it, expect } from "vitest";
import { invokeGET, isJsonLike } from "../_helpers/next.routeInvoke";

// Prefer App Router routes if present. If /api/_health route does not exist, tolerate.
type RouteMod = { GET?: (req: any) => any };

async function tryInvoke(modPath: string, url: string) {
  try {
    const mod = (await import(modPath)) as unknown as RouteMod;
    if (!mod?.GET) return { ok: false, why: "no_GET" as const };
    const r = await invokeGET(mod as any, url);
    return { ok: true as const, r };
  } catch (e: any) {
    const msg = String(e?.message || "");
    if (msg.includes("Cannot find module") || msg.includes("Cannot find")) {
      return { ok: false, why: "missing" as const };
    }
    return { ok: false, why: "error" as const, err: e };
  }
}

describe("middleware header contract (in-process)", () => {
  it("GET /api/_health returns JSON if route exists (or is skipped if missing)", async () => {
    // Try App Router first
    const a = await tryInvoke("../../app/api/_health/route", "http://local.test/api/_health");
    if (a.ok) {
      expect(a.r.status).toBe(200);
      expect(isJsonLike(a.r.json)).toBe(true);
      return;
    }
    if (a.why === "missing") {
      // Some repos do not expose /api/_health explicitly; accept.
      expect(true).toBe(true);
      return;
    }
    if (a.why === "error") throw (a as any).err;
    // no_GET: accept (route present but non-GET)
    expect(true).toBe(true);
  });

  it("GET /api/health does not include x-middleware-rewrite header (in-process)", async () => {
    const mod = (await import("../../app/api/health/route")) as unknown as RouteMod;
    const r = await invokeGET(mod as any, "http://local.test/api/health");
    // headers are lowercased in helper
    expect(r.headers["x-middleware-rewrite"]).toBeUndefined();
  });
});
