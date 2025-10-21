import { NextRequest, NextResponse } from "next/server";
import { pickCreative } from "@/src/lib/ads/fixtures";
import { checkCaps } from "@/src/lib/ads/caps";
import { parseLatLon, eligibleForRadius, getConsent } from "@/src/lib/geo/core";
import { reqId } from "@/src/lib/reqid";

function getIp(req: NextRequest): string {
  const xf = req.headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0].trim();
  const xr = req.headers.get("x-real-ip");
  if (xr) return xr.trim();
  return "0.0.0.0"; // dev fallback
}

export async function GET(req: NextRequest) {
  const id = reqId();
  const url = new URL(req.url);
  const ownerId = url.searchParams.get("ownerId");
  const ip = getIp(req);

  // Geo params (optional, non-breaking)
  const lat = url.searchParams.get("lat");
  const lon = url.searchParams.get("lon");
  const centerLat = url.searchParams.get("centerLat");
  const centerLon = url.searchParams.get("centerLon");
  const radiusStr = url.searchParams.get("radiusKm");

  const capKey = `${ownerId || "_"}::${ip}`;
  const verdict = checkCaps(capKey);

  // Build geo block
  const userPos = parseLatLon(lat, lon);
  const centerPos = parseLatLon(centerLat, centerLon);
  const radiusKm = Number.isFinite(Number(radiusStr)) ? Number(radiusStr) : 50;
  const consent = getConsent(ip);
  let geo: any = {
    consent: consent || null,
    whereami: userPos ? { lat: userPos.lat, lon: userPos.lon } : null,
    eligible: null as null | boolean,
    distanceKm: null as null | number,
    usedCenter: null as any,
    radiusKm,
  };
  // compute eligibility only if both endpoints exist
  if (userPos && centerPos) {
    const r = eligibleForRadius(userPos, centerPos, radiusKm);
    geo.eligible = r.eligible;
    geo.distanceKm = r.distanceKm;
    geo.usedCenter = centerPos;
  }

  if (!verdict.allowed) {
    const body = {
      ok: false as const,
      decision: null,
      reason: verdict.reason,
      retryAfterMs: verdict.retryAfterMs ?? 0,
      caps: verdict.meta,
      geo,
      requestId: id,
    };
    return NextResponse.json(body, { status: 200, headers: { "x-request-id": id } });
  }

  const creative = pickCreative(ownerId);
  if (!creative) {
    const body = {
      ok: true,
      decision: null,
      reason: "NO_CREATIVE" as const,
      caps: verdict.meta,
      geo,
      requestId: id,
    };
    return NextResponse.json(body, { status: 200, headers: { "x-request-id": id } });
  }

  const decision = {
    ttlMs: 30_000,
    creative,
    tracking: {
      impressionUrl: `/api/ads/imp?cid=${encodeURIComponent(creative.id)}&rid=${encodeURIComponent(id)}`,
      clickUrl: `/api/ads/click?cid=${encodeURIComponent(creative.id)}&rid=${encodeURIComponent(id)}`,
    },
  };

  const body = { ok: true, decision, caps: verdict.meta, geo, requestId: id };
  return NextResponse.json(body, { status: 200, headers: { "x-request-id": id } });
}

export const dynamic = "force-dynamic";
