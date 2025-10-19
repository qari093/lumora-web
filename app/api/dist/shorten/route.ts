import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function safeSlug(s?: string | null) {
  return (s || "")
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(()=> ({}));
    const { targetUrl, campaignId, slug } = body || {};
    if (!targetUrl || typeof targetUrl !== "string") {
      return NextResponse.json({ ok:false, error:"TARGET_URL_REQUIRED" }, { status:400 });
    }
    let finalSlug = safeSlug(slug);
    if (!finalSlug) {
      // generate slug like ab12cd
      finalSlug = Math.random().toString(36).slice(2, 8);
    }
    // Reuse existing exact (slug,target) pair if exists
    const existing = await prisma.shortLink.findFirst({ where: { slug: finalSlug } });
    if (existing) {
      if (existing.targetUrl === targetUrl) {
        return NextResponse.json({ ok:true, reused:true, link: existing });
      }
      // slug taken → try suffix
      let attempt = 0;
      let candidate = finalSlug;
      while (attempt < 5) {
        candidate = (finalSlug + "-" + Math.random().toString(36).slice(2, 4)).slice(0, 64);
        const probe = await prisma.shortLink.findUnique({ where: { slug: candidate } });
        if (!probe) { finalSlug = candidate; break; }
        attempt++;
      }
    }
    const link = await prisma.shortLink.create({
      data: {
        slug: finalSlug,
        targetUrl: String(targetUrl),
        campaignId: typeof campaignId === "string" ? campaignId : null,
      }
    });
    return NextResponse.json({ ok:true, link });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:String(e?.message||e) }, { status:500 });
  }
}
