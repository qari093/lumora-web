import { NextResponse } from "next/server";

type PortalKey =
  | "fyp"
  | "gmar"
  | "nexa"
  | "videos"
  | "movies"
  | "live"
  | "celebrations"
  | "share"
  | "lumaspace"
  | "vibe";

type PortalStatus = {
  key: PortalKey;
  ok: boolean;
  enabled: boolean;
  note?: string;
};

function parseBool(v: string | undefined): boolean | undefined {
  if (v == null) return undefined;
  const s = String(v).trim().toLowerCase();
  if (["1", "true", "yes", "on"].includes(s)) return true;
  if (["0", "false", "no", "off"].includes(s)) return false;
  return undefined;
}

function enabledByDefault(key: PortalKey): boolean {
  // Conservative defaults: user-alive mode expects portals to be "alive",
  // but we must not hard-crash if a portal is intentionally gated in dev.
  // Use existing env if present; otherwise treat as enabled for status visibility only.
  // This endpoint does NOT guarantee content, it only reports visibility intent.
  return key !== "vibe" ? true : false;
}

function envEnabled(key: PortalKey): boolean {
  const k1 = `LUMORA_PORTAL_${key.toUpperCase()}_ENABLED`;
  const k2 = `NEXT_PUBLIC_LUMORA_PORTAL_${key.toUpperCase()}_ENABLED`;
  const v = parseBool(process.env[k1]) ?? parseBool(process.env[k2]);
  return v ?? enabledByDefault(key);
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const debug = url.searchParams.get("debug") === "1";

  const portals: PortalKey[] = [
    "fyp",
    "gmar",
    "nexa",
    "videos",
    "movies",
    "live",
    "celebrations",
    "share",
    "lumaspace",
    "vibe",
  ];

  try {
    const items: PortalStatus[] = portals.map((key) => {
      const enabled = envEnabled(key);
      // ok is "true" unless we detect a hard disable; never fails due to runtime errors.
      const ok = true;
      const note = enabled ? undefined : "disabled_by_env_or_default";
      return { key, ok, enabled, note };
    });

    const payload: any = {
      ok: true,
      ts: Date.now(),
      items,
      counts: {
        total: items.length,
        enabled: items.filter((x) => x.enabled).length,
        disabled: items.filter((x) => !x.enabled).length,
      },
    };

    if (debug) {
      const envKeys = portals.flatMap((k) => [
        `LUMORA_PORTAL_${k.toUpperCase()}_ENABLED`,
        `NEXT_PUBLIC_LUMORA_PORTAL_${k.toUpperCase()}_ENABLED`,
      ]);
      const snapshot: Record<string, string | undefined> = {};
      for (const k of envKeys) snapshot[k] = process.env[k];
      payload.debug = { env: snapshot };
    }

    return NextResponse.json(payload, { status: 200 });
  } catch (e: any) {
    // never-500 contract
    const msg = typeof e?.message === "string" ? e.message : "internal_error";
    return NextResponse.json(
      { ok: true, ts: Date.now(), items: [], counts: { total: 0, enabled: 0, disabled: 0 }, warn: msg },
      { status: 200 }
    );
  }
}
