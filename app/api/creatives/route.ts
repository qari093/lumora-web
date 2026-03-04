import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const campaignId = url.searchParams.get("campaignId") || undefined;
    const rows = await prisma.adCreative.findMany({
      where: campaignId ? { campaignId } : {},
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json({ ok:true, rows });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:String(e?.message||e) }, { status:500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(()=> ({}));
    const { campaignId, imageUrl = null, headline, description, ctaText = "Learn More" } = body || {};
    if (!campaignId) return NextResponse.json({ ok:false, error:"CAMPAIGN_ID_REQUIRED" }, { status:400 });
    if (!headline || !description) return NextResponse.json({ ok:false, error:"HEADLINE_AND_DESCRIPTION_REQUIRED" }, { status:400 });

    const row = await prisma.adCreative.create({
      data: {
        campaignId: String(campaignId),
        imageUrl: imageUrl ? String(imageUrl) : null,
        headline: String(headline).slice(0, 120),
        description: String(description).slice(0, 500),
        ctaText: String(ctaText).slice(0, 48),
      }
    });
    return NextResponse.json({ ok:true, creative: row });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:String(e?.message||e) }, { status:500 });
  }
}
