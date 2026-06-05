import { NextResponse } from "next/server";
import { PORTALS } from "@/core/portals";
import { getPortalRuntimeConfig } from "@/core/portalRuntime";

function json(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: {
      "cache-control": "no-store",
      "content-type": "application/json; charset=utf-8"
    }
  });
}

function getAppRoutePresence(route: string): { ok: boolean; expected: string } {
  // Runtime route presence cannot be reliably checked from Next runtime on all deploy targets.
  // We validate config shape + return expected path for operator validation.
  if (route === "/") return { ok: true, expected: "app/page.*" };
  const seg = route.replace(/^\//, "");
  return { ok: true, expected: `app/${seg}/page.*` };
}

export async function GET() {
  try {
    const cfg = getPortalRuntimeConfig();

    const ids = PORTALS.map(p => p.id);
    const uniq = new Set(ids);
    if (uniq.size !== ids.length) return json({ ok: false, error: "duplicate_portal_ids" }, 500);

    // Ensure cfg contains every portal id
    for (const id of ids) {
      if (typeof (cfg as any)[id] !== "boolean") {
        return json({ ok: false, error: "invalid_runtime_config", id }, 500);
      }
    }

    // Allow runtime metadata keys
    const allowedMetaKeys = new Set(["env", "buildId"]);

    for (const k of Object.keys(cfg as Record<string, unknown>)) {
      if (allowedMetaKeys.has(k)) continue;

      if (!uniq.has(k)) {
        return json({ ok: false, error: "unknown_runtime_key", key: k }, 500);
      }
    }

    const portals = PORTALS.map(p => ({
      id: p.id,
      title: p.title,
      route: p.route,
      status: p.status,
      enabled: cfg[p.id],
      routeExpected: getAppRoutePresence(String(p.route || '/')).expected
    }));

    return json({
      ok: true,
      ts: Date.now(),
      overridesPresent: Boolean(process.env.LUMORA_PORTAL_OVERRIDES),
      portals
    });
  } catch (e: any) {
    const msg = typeof e?.message === "string" ? e.message : "internal_error";
    return json({ ok: false, error: msg, ts: Date.now() }, 500);
  }
}
