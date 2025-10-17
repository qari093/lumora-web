import { NextResponse } from "next/server";
import { PrismaClient, AdObjective, AdStatus, CreativeType } from "@prisma/client";

const prisma = new PrismaClient();

// naive number sanitizer
function toInt(n: any, def = 0) {
  const x = typeof n === "string" ? n.trim() : n;
  const v = Number(x);
  return Number.isFinite(v) ? Math.round(v) : def;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Basic validation
    const title = String(body?.title || "").trim();
    if (!title) return NextResponse.json({ ok: false, error: "Title is required" }, { status: 400 });

    const objective = Object.values(AdObjective).includes(body?.objective)
      ? body.objective
      : AdObjective.AWARENESS;

    const creativeType = Object.values(CreativeType).includes(body?.creativeType)
      ? body.creativeType
      : CreativeType.IMAGE;

    const creativeUrl = String(body?.creativeUrl || "").trim();
    if (!creativeUrl) return NextResponse.json({ ok: false, error: "Creative URL is required" }, { status: 400 });

    const landingUrl = body?.landingUrl ? String(body.landingUrl) : null;

    const dailyBudget = toInt(body?.dailyBudgetEuros, 0);
    const totalBudget = toInt(body?.totalBudgetEuros, 0);
    if (dailyBudget <= 0 || totalBudget <= 0) {
      return NextResponse.json({ ok: false, error: "Budgets must be greater than 0" }, { status: 400 });
    }
    const dailyBudgetCents = dailyBudget * 100;
    const totalBudgetCents = totalBudget * 100;

    const radiusKm = Math.max(1, toInt(body?.radiusKm || 50, 50));

    const centerLat = body?.centerLat != null ? Number(body.centerLat) : null;
    const centerLon = body?.centerLon != null ? Number(body.centerLon) : null;

    const startAt = body?.startAt ? new Date(body.startAt) : null;
    const endAt = body?.endAt ? new Date(body.endAt) : null;

    const created = await prisma.adCampaign.create({
      data: {
        title,
        objective,
        status: AdStatus.DRAFT,
        creativeType,
        creativeUrl,
        landingUrl,
        dailyBudgetCents,
        totalBudgetCents,
        radiusKm,
        centerLat,
        centerLon,
        locationsJson: body?.locationsJson ? String(body.locationsJson) : null,
        startAt,
        endAt
      }
    });

    return NextResponse.json({ ok: true, campaign: created }, { status: 201 });
  } catch (e: any) {
    console.error("Create campaign error:", e?.message || e);
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}
