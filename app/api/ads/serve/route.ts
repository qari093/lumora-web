import { NextRequest, NextResponse } from "next/server";
import { demoCreatives } from "@/src/lib/ads/fixtures";
import { checkCaps } from "@/src/lib/ads/caps";
import { parseLatLon, eligibleForRadius, getConsent } from "@/src/lib/geo/core";
import { reqId } from "@/src/lib/reqid";
import { ensureBudget, budgetStatus } from "@/src/lib/ads/spend";
import { trustCheck } from "@/src/lib/trust/engine";
import { campaignsForCreative, creativesForCampaign } from "@/src/lib/vendor/assign";
import { getCampaign } from "@/src/lib/vendor/campaign";
import { isCampaignLive } from "@/src/lib/vendor/campaign_spend";

function getIp(req: NextRequest): string {
  const xf = req.headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0].trim();
  const xr = req.headers.get("x-real-ip");
  if (xr) return xr.trim();
  return "0.0.0.0";
}

export async function GET(req: NextRequest) {
  const id = reqId();
  const url = new URL(req.url);
  const ownerId = url.searchParams.get("ownerId") || "";
  const ip = getIp(req);
  const ua = req.headers.get("user-agent") || "";

  // Trust check
  const trust = trustCheck(ip, ua);
  if (!trust.ok) return NextResponse.json({ ok:false, decision:null, reason:"FRAUD_BLOCKED", trust, requestId:id }, { status:200, headers:{ "x-request-id": id } });

  // Geo (optional)
  const lat = url.searchParams.get("lat");
  const lon = url.searchParams.get("lon");
  const centerLat = url.searchParams.get("centerLat");
  const centerLon = url.searchParams.get("centerLon");
  const radiusStr = url.searchParams.get("radiusKm");

  const capKey = `${ownerId || "_"}::${ip}`;
  const verdict = checkCaps(capKey);

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
  if (userPos && centerPos) { const r = eligibleForRadius(userPos, centerPos, radiusKm); geo.eligible = r.eligible; geo.distanceKm = r.distanceKm; geo.usedCenter = centerPos; }

  // Budget gate
  let spendGate: any = null;
  if (ownerId) {
    const gate = ensureBudget(ownerId);
    if (!gate.ok) {
      const bs = budgetStatus(ownerId);
      spendGate = { reason: gate.reason, balance: gate.balance, paused: bs.paused };
      return NextResponse.json({ ok:false, decision:null, reason: gate.reason, caps: verdict.meta, geo, spend: spendGate, trust, requestId:id }, { status:200, headers:{ "x-request-id": id } });
    }
  }

  if (!verdict.allowed) {
    return NextResponse.json({ ok:false as const, decision:null, reason: verdict.reason, retryAfterMs: verdict.retryAfterMs ?? 0, caps: verdict.meta, geo, spend: spendGate, trust, requestId:id }, { status:200, headers:{ "x-request-id": id } });
  }

  // Eligible creatives: must match owner and be assigned to at least one LIVE campaign
  const pool = demoCreatives.filter(c => (!ownerId || c.ownerId === ownerId)).filter(c => {
    const cmps = campaignsForCreative(c.id);
    if (!cmps.length) return false;
    return cmps.some(cid => { const cc = getCampaign(cid); return !!cc && isCampaignLive(cc); });
  });

  if (!pool.length) {
    return NextResponse.json({ ok:true, decision:null, reason:"NO_ELIGIBLE_CAMPAIGN", caps: verdict.meta, geo, spend: spendGate, trust, requestId:id }, { status:200, headers:{ "x-request-id": id } });
  }

  // pick first random
  const creative = pool[ Math.floor(Math.random() * pool.length) ];
  // pick any live campaign that includes this creative
  const cmpId = campaignsForCreative(creative.id).find(cid => { const cc = getCampaign(cid); return !!cc && isCampaignLive(cc); }) || null;

  const decision = {
    ttlMs: 30_000,
    campaignId: cmpId,
    creative,
    tracking: {
      impressionUrl: `/api/ads/imp?cid=${encodeURIComponent(creative.id)}&rid=${encodeURIComponent(id)}${cmpId?`&cmp=${encodeURIComponent(cmpId)}`:""}`,
      clickUrl: `/api/ads/click?cid=${encodeURIComponent(creative.id)}&rid=${encodeURIComponent(id)}${cmpId?`&cmp=${encodeURIComponent(cmpId)}`:""}`
    }
  };

  return NextResponse.json({ ok:true, decision, caps: verdict.meta, geo, spend: spendGate, trust, requestId:id }, { status:200, headers:{ "x-request-id": id } });
}

export const dynamic = "force-dynamic";
