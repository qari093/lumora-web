import { NextRequest, NextResponse } from "next/server";
import { createCampaign, listCampaigns } from "@/src/lib/vendor/campaign";
import { computeOwnerSpendEuros } from "@/src/lib/vendor/spend";
import { reqId } from "@/src/lib/reqid";

function withComputed(rows: ReturnType<typeof listCampaigns>, spent: number) {
  const budgetTotal = rows.reduce((s,c)=>s+(c.budgetEuros||0),0);
  return {
    campaigns: rows,
    aggregates: { budgetTotal: +budgetTotal.toFixed(2), spentEuros: spent, remainingEuros: +(budgetTotal - spent).toFixed(2) }
  };
}

export async function GET(req: NextRequest) {
  const id = reqId();
  const u = new URL(req.url);
  const ownerId = u.searchParams.get("ownerId") || "";
  if (!ownerId) return NextResponse.json({ ok:false, error:"MISSING_OWNER", requestId:id }, { status:200, headers:{ "x-request-id": id } });

  const rows = listCampaigns(ownerId);
  const spent = computeOwnerSpendEuros(ownerId);
  return NextResponse.json({ ok:true, ownerId, ...withComputed(rows, spent), requestId:id }, { status:200, headers:{ "x-request-id": id } });
}

export async function POST(req: NextRequest) {
  const id = reqId();
  let body:any = {}; try { body = await req.json(); } catch {}
  const ownerId = typeof body?.ownerId === "string" ? body.ownerId : "";
  const name = typeof body?.name === "string" ? body.name : "";
  const budgetEuros = typeof body?.budgetEuros === "number" ? body.budgetEuros : NaN;
  const startAt = typeof body?.startAt === "number" ? body.startAt : null;
  const endAt = typeof body?.endAt === "number" ? body.endAt : null;

  const need = [];
  if (!ownerId) need.push("ownerId");
  if (!name) need.push("name");
  if (!isFinite(budgetEuros) || budgetEuros < 0) need.push("budgetEuros>=0");
  if (need.length) return NextResponse.json({ ok:false, error:"BAD_REQUEST", need, requestId:id }, { status:200, headers:{ "x-request-id": id } });

  try {
    const c = createCampaign({ ownerId, name, budgetEuros, startAt, endAt });
    return NextResponse.json({ ok:true, campaign:c, requestId:id }, { status:200, headers:{ "x-request-id": id } });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:String(e?.message||e), requestId:id }, { status:200, headers:{ "x-request-id": id } });
  }
}
export const dynamic = "force-dynamic";
