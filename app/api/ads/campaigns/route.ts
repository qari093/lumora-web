export const runtime = "nodejs"; // ensure Node runtime (not Edge)

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function toInt(n: any, def = 0) {
  const x = typeof n === "string" ? n.trim() : n;
  const v = Number(x);
  return Number.isFinite(v) ? Math.round(v) : def;
}

const ALLOWED_OBJECTIVES = ["AWARENESS","TRAFFIC","CONVERSIONS","VISITS"] as const;
const ALLOWED_CREATIVE = ["IMAGE","VIDEO"] as const;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const title = String(body?.title || "").trim();
    if (!title) return NextResponse.json({ ok: false, error: "Title is required" }, { status: 400 });

    const objective = ALLOWED_OBJECTIVES.includes(body?.objective) ? body.objective : "AWARENESS";
    const creativeType = ALLOWED_CREATIVE.includes(body?.creativeType) ? body.creativeType : "IMAGE";

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

    const radiusKm = Math.max(1, toInt(body?.radiusKm ?? 50, 50));
    const centerLat = body?.centerLat != null ? Number(body.centerLat) : null;
    const centerLon = body?.centerLon != null ? Number(body.centerLon) : null;

    const startAt = body?.startAt ? new Date(body.startAt) : null;
    const endAt = body?.endAt ? new Date(body.endAt) : null;

    const created = await prisma.adCampaign.create({
      data: {
        title,
        objective,            // enum string
        status: "DRAFT",      // enum string
        creativeType,         // enum string
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
