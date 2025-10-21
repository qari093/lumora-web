export const runtime = "nodejs";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const ALLOWED_OBJECTIVES = ["AWARENESS","TRAFFIC","CONVERSIONS","VISITS"] as const;
const ALLOWED_CREATIVE = ["IMAGE","VIDEO"] as const;
const ALLOWED_STATUS = ["DRAFT","ACTIVE","PAUSED","ARCHIVED"] as const;

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const campaign = await prisma.adCampaign.findUnique({ where: { id: params.id } });
  if (!campaign) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true, campaign });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const data: any = {};

    if (typeof body.title === "string") data.title = body.title.trim();
    if (ALLOWED_OBJECTIVES.includes(body.objective)) data.objective = body.objective;
    if (ALLOWED_STATUS.includes(body.status)) data.status = body.status;
    if (ALLOWED_CREATIVE.includes(body.creativeType)) data.creativeType = body.creativeType;
    if (typeof body.creativeUrl === "string") data.creativeUrl = body.creativeUrl.trim();
    if (typeof body.landingUrl === "string" || body.landingUrl === null) data.landingUrl = body.landingUrl ?? null;
    if (Number.isFinite(body.dailyBudgetEuros)) data.dailyBudgetCents = Math.round(Number(body.dailyBudgetEuros) * 100);
    if (Number.isFinite(body.totalBudgetEuros)) data.totalBudgetCents = Math.round(Number(body.totalBudgetEuros) * 100);
    if (Number.isFinite(body.radiusKm)) data.radiusKm = Math.max(1, Math.round(Number(body.radiusKm)));
    if (body.centerLat === null || Number.isFinite(body.centerLat)) data.centerLat = body.centerLat === null ? null : Number(body.centerLat);
    if (body.centerLon === null || Number.isFinite(body.centerLon)) data.centerLon = body.centerLon === null ? null : Number(body.centerLon);
    if (typeof body.locationsJson === "string" || body.locationsJson === null) data.locationsJson = body.locationsJson ?? null;
    if (typeof body.startAt === "string" || body.startAt === null) data.startAt = body.startAt ? new Date(body.startAt) : null;
    if (typeof body.endAt === "string" || body.endAt === null) data.endAt = body.endAt ? new Date(body.endAt) : null;

    const updated = await prisma.adCampaign.update({
      where: { id: params.id },
      data
    });

    return NextResponse.json({ ok: true, campaign: updated });
  } catch (e: any) {
    console.error("Update campaign error:", e?.message || e);
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}

/** Soft delete → ARCHIVED */
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const updated = await prisma.adCampaign.update({
      where: { id: params.id },
      data: { status: "ARCHIVED" }
    });
    return NextResponse.json({ ok: true, campaign: updated });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}
